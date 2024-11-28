import React, {useEffect, useRef, useState} from 'react';
import * as cv from '@techstark/opencv-js';
import "./SnapshotPage.scss"
import {Button, Layout} from "@douyinfe/semi-ui";
import {IconCamera} from "@douyinfe/semi-icons";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const SnapshotPage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const faceCascadeRef = useRef(null); // Cache the CascadeClassifier for performance
    const [isReadyToTakePhoto, setIsReadyToTakePhoto] = useState(false);
    const [warning, setWarning] = useState('正在初始化摄像头和检测器，请稍候...');
    const [capturedImage, setCapturedImage] = useState(null); // Store captured image data
    const {Header, Content, Footer} = Layout
    const navigate=useNavigate()

    useEffect(() => {
        const initialize = async () => {
            try {
                if (!cv.getBuildInformation) {
                    setWarning('正在加载 OpenCV...');
                    await new Promise((resolve) => {
                        cv['onRuntimeInitialized'] = resolve;
                    });
                }
                setWarning('正在加载人脸检测模型...');
                await loadCascadeFile(); // Ensure the Haar Cascade file is loaded

                setWarning('正在初始化人脸检测器...');
                initializeFaceCascade(); // Initialize the CascadeClassifier

                setWarning('正在启动摄像头...');
                await startCamera(); // Start accessing the camera

                setWarning('正在处理画面...');
                const interval = setInterval(processFrame, 1000); // Process one frame per second
                return () => clearInterval(interval); // Cleanup on unmount
            } catch (error) {
                console.error('初始化失败:', error.message);
                setWarning('初始化失败，请检查您的摄像头设置或尝试刷新页面');
            }
        };

        initialize();

        // 清理资源
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }
            // 添加防护，避免 `videoRef.current` 为 `null` 的情况
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('您的浏览器不支持摄像头功能，请使用最新版本的浏览器');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
            });

            // 添加防护，避免 `videoRef.current` 为 `null`
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('访问摄像头失败:', err.message);
            throw new Error('无法访问摄像头，请检查权限设置并确保您的设备有可用摄像头');
        }
    };


    const loadCascadeFile = async () => {
        const faceCascadeUrl = `${process.env.PUBLIC_URL}/haarcascade_frontalface_default.xml`;
        try {
            console.log('正在尝试加载人脸检测模型：', faceCascadeUrl);
            const response = await fetch(faceCascadeUrl);
            if (!response.ok) {
                throw new Error(`无法加载人脸检测模型: ${response.status} ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer();
            const data = new Uint8Array(buffer);
            cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', data, true, false, false);
            console.log('人脸检测模型加载成功');
        } catch (error) {
            console.warn('人脸检测模型加载失败:', error.message);
            throw new Error('人脸检测模型加载失败，请检查网络连接');
        }
    };

    const initializeFaceCascade = () => {
        try {
            if (!cv.CascadeClassifier) {
                throw new Error('CascadeClassifier 未在 OpenCV.js 中找到');
            }
            faceCascadeRef.current = new cv.CascadeClassifier('haarcascade_frontalface_default.xml');
            console.log('人脸检测器初始化成功');
        } catch (error) {
            console.error('人脸检测器初始化失败:', error.message);
            throw new Error('人脸检测器初始化失败，请刷新页面');
        }
    };

    const processFrame = () => {
        if (!videoRef.current || !canvasRef.current || !faceCascadeRef.current) {
            setWarning('资源未完全加载，正在重试...');
            return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            setWarning('视频画面不可用，请检查摄像头是否正常');
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let src = cv.matFromImageData(imageData);

        try {
            let isValid = true; // Track if the image meets all conditions

            // Brightness check
            const brightnessThreshold = {min: 70, max: 180};
            const mean = cv.mean(src);
            const brightness = (mean[0] + mean[1] + mean[2]) / 3;

            if (brightness < brightnessThreshold.min) {
                setWarning('图像过暗，请确保有充足的光线');
                isValid = false;
            } else if (brightness > brightnessThreshold.max) {
                setWarning('图像过亮，请避免过曝');
                isValid = false;
            } else {
                setWarning('');
            }

            // Convert to grayscale
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

            // Blur detection
            const blurThreshold = 75;
            let laplacian = new cv.Mat();
            cv.Laplacian(gray, laplacian, cv.CV_64F);

            let meanMat = new cv.Mat();
            let stddev = new cv.Mat();
            cv.meanStdDev(laplacian, meanMat, stddev);
            const variance = stddev.data64F[0] ** 2;

            if (variance < blurThreshold) {
                setWarning('图像模糊，请对焦');
                isValid = false;
            }

            // Face detection
            const faces = new cv.RectVector();
            faceCascadeRef.current.detectMultiScale(
                gray,
                faces,
                1.1,
                5,
                cv.CASCADE_FIND_BIGGEST_OBJECT
            );

            if (faces.size() === 0) {
                setWarning('未检测到人脸，请确保您的脸完全出现在画面中');
                isValid = false;
            } else {
                const face = faces.get(0);
                const minFaceWidth = canvas.width * 0.3;
                const minFaceHeight = canvas.height * 0.3;

                if (face.width < minFaceWidth || face.height < minFaceHeight) {
                    setWarning('人脸过小或未完全显示，请调整位置');
                    isValid = false;
                } else if (isValid) {
                    setWarning('');
                }
            }

            faces.delete();
            cleanup(src, gray, laplacian, meanMat, stddev);

            setIsReadyToTakePhoto(isValid);
        } catch (error) {
            console.error('处理帧时出错:', error.message);
            setWarning('处理画面时出错，请稍后重试');
            cleanup(src);
            setIsReadyToTakePhoto(false);
        }
    };

    const cleanup = (...mats) => {
        mats.forEach((mat) => mat && mat.delete());
    };

    const getWarningMessage = () => {
        return warning || (isReadyToTakePhoto ? '可以拍照了✅' : '实时画面不符合拍照要求❌');
    };

    const takePhoto = () => {
        if (!isReadyToTakePhoto || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const imageDataUrl = canvas.toDataURL('image/png'); // Capture the current frame as a base64 image
        setCapturedImage(imageDataUrl); // Store the captured image for preview
        setIsReadyToTakePhoto(false); // Hide the take photo button after taking a photo
    };

    const resetCamera = async () => {
        try {
            setCapturedImage(null); // 清除捕获的图像
            setIsReadyToTakePhoto(false); // 重置拍照按钮状态
            await startCamera(); // 重新加载摄像头
            setWarning('摄像头已重置，请重新调整您的位置');
        } catch (error) {
            console.error('重新加载摄像头失败:', error.message);
            setWarning('无法重新加载摄像头，请刷新页面');
        }
    };

    const sendFormData = async () => {
        if (!capturedImage) {
            console.error('没有拍摄的图片可发送');
            return;
        }

        // 创建 FormData 实例
        const formData = new FormData();

        // 添加 API key 和 secret
        formData.append('api_key', '3OArM8NmM2U01LOeRtsIsVkSGKiXgMHB');
        formData.append('api_secret', 'HYwoEG6VYWYNQPX2YeuEFlnrMlC-ylDp');

        try {
            // 将 Base64 转换为 Blob
            const base64Data = capturedImage.split(',')[1]; // 去掉 "data:image/png;base64," 部分
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const imageBlob = new Blob([byteArray], { type: 'image/png' });

            // 创建一个 File 对象
            const imageFile = new File([imageBlob], 'captured-image.png', { type: 'image/png' });
            formData.append('image_file', imageFile);

            // 发送 POST 请求
            const response = await axios.post('https://api-cn.faceplusplus.com/facepp/v1/skinanalyze_pro', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // 必须指定这个 Content-Type
                },
            });
            navigate('/detection-result', {
                state: {
                    responseData: response.data,
                    capturedImage: capturedImage, // 添加图片数据
                },
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error sending image:', error);
        }
    };


    return (
        <div className={"snapshot-page"}>
            <Layout>
                <Header className={"header"}></Header>
                <Content className={"content"}>
                    {!capturedImage ? (
                        <div className={"photo-taking"}>
                            <button className={"button"} onClick={takePhoto}
                                    style={{backgroundColor: isReadyToTakePhoto ? "blanchedalmond" : "gray"}}
                                    disabled={!isReadyToTakePhoto}
                            ><IconCamera/></button>
                            <video className={"video"} ref={videoRef} autoPlay playsInline width="640"
                                   height="480"/>
                            <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
                            <h1>{getWarningMessage()}</h1>

                        </div>
                    ) : (
                        <div className={"preview"}>
                            <h2>预览图片</h2>
                            <img src={capturedImage} alt="Captured preview" style={{width: '100%'}}/>
                            <div className="options">
                                <Button onClick={()=>resetCamera()}>重新拍照</Button>
                                <Button onClick={()=>sendFormData()} >就用这张!</Button>
                            </div>
                        </div>
                    )}
                </Content>
                <Footer className={"footer"}></Footer>
            </Layout>
        </div>

    );
};

export default SnapshotPage;
