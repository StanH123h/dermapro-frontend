import React, {useEffect, useRef, useState} from 'react';
import * as faceapi from 'face-api.js'; // Added face-api.js import
import "./SnapshotPage.scss"
import {Button, Layout, Spin, Toast} from "@douyinfe/semi-ui";
import {IconCamera, IconChevronLeft} from "@douyinfe/semi-icons";
import axiosInstance from "../../api/axiosInstance";
import {useNavigate} from "react-router-dom";

const SnapshotPage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    // Removed faceCascadeRef
    const [isReadyToTakePhoto, setIsReadyToTakePhoto] = useState(false);
    const [warning, setWarning] = useState('正在初始化摄像头和检测器，请稍候...');
    const [capturedImage, setCapturedImage] = useState(null); // Store captured image data
    const {Header, Content, Footer} = Layout
    const navigate = useNavigate()
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                setWarning('正在加载 face-api.js 模型...');
                // Load face-api.js models
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // Ensure models are in public/models
                    // You can load additional models if needed
                ]);

                setWarning('正在启动摄像头...');
                await startCamera(); // Start accessing the camera

                setWarning('正在处理画面...');
                const interval = setInterval(processFrame, 1000); // Process one frame per second
                return () => clearInterval(interval); // Cleanup on unmount
            } catch (error) {
                console.error('初始化失败:', error.message);
                setWarning('初始化中，请稍作等待，若一直未初始化完成请尝试刷新页面');
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
                video: {
                    facingMode: 'user',
                    width: {ideal: 1000}, // 请求理想宽度
                    height: {ideal: 1700}, // 请求理想高度
                },
                audio: false, // 如果不需要音频，可以禁用
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

    const processFrame = async () => {
        if (!videoRef.current || !canvasRef.current) {
            setWarning('资源未完全加载，正在重试...');
            return;
        }

        const video = videoRef.current;

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            setWarning('视频画面不可用，请检查摄像头是否正常');
            return;
        }

        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const displaySize = {width: video.videoWidth, height: video.videoHeight};
        faceapi.matchDimensions(canvas, displaySize);

        try {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

            if (detections.length === 0) {
                setWarning('未检测到人脸，请确保您的脸完全出现在画面中');
                setIsReadyToTakePhoto(false);
                return;
            }

            // Check the size of the first detected face
            const face = detections[0].box;
            const minFaceWidth = video.videoWidth * 0.3;
            const minFaceHeight = video.videoHeight * 0.44;

            if (face.width < minFaceWidth || face.height < minFaceHeight) {
                setWarning('人脸过小或未完全显示，请调整位置');
                setIsReadyToTakePhoto(false);
            } else {
                setWarning('可以拍照了✅');
                setIsReadyToTakePhoto(true);
            }
        } catch (error) {
            console.error('处理帧时出错:', error.message);
            setWarning('处理画面时出错，请稍后重试');
            setIsReadyToTakePhoto(false);
        }
    };

    const getWarningMessage = () => {
        return warning || (isReadyToTakePhoto ? '可以拍照了✅' : '实时画面不符合拍照要求❌');
    };

    const takePhoto = () => {
        if (!isReadyToTakePhoto || !canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        // 设置 Canvas 尺寸与 Video 一致
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 翻转 Canvas 坐标系
        ctx.save(); // 保存当前状态
        ctx.scale(-1, 1); // 水平翻转
        ctx.translate(-canvas.width, 0); // 将画布坐标平移回来

        // 绘制翻转后的 Video 图像
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 恢复 Canvas 状态
        ctx.restore();

        // 获取翻转后的图像
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl); // 存储图像以供预览

        // 关闭摄像头
        if (video.srcObject) {
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            video.srcObject = null;
        }
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
        setIsLoading(true)

        try {
            // 将 Base64 转换为 Blob
            const base64Data = capturedImage.split(',')[1]; // 去掉 "data:image/png;base64," 部分
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const imageBlob = new Blob([byteArray], {type: 'image/png'});

            // 创建一个 File 对象
            const imageFile = new File([imageBlob], 'captured-image.png', {type: 'image/png'});
            formData.append('file', imageFile);

            // 发送 POST 请求
            const response = await axiosInstance.post('/analysis/facialReport', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // 必须指定这个 Content-Type
                },
            });
            console.log(response.data)
            navigate('/detection-result', {
                state: {
                    responseData: response.data,
                    capturedImage: capturedImage, // 添加图片数据
                },
            });
        } catch (error) {
            console.error('Error sending image:', error);
            setIsButtonDisabled(false)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className={"snapshot-page"}>
            <Layout>
                <Header className={"header"}>
                    <IconChevronLeft onClick={() => {
                        if (!isButtonDisabled) {
                            navigate("/")
                            const video = videoRef.current;
                            if (video.srcObject) {
                                const stream = video.srcObject;
                                const tracks = stream.getTracks();
                                tracks.forEach((track) => track.stop());
                                video.srcObject = null;
                            }
                        } else {
                            Toast.warning("正在分析面部情况，请勿返回")
                        }
                    }}/>
                </Header>
                <Content className={"content"}>
                    {!capturedImage ? (
                        <div className={"photo-taking"}>
                            <div className="video-container" style={{position: 'relative'}}>
                                <video
                                    playsInline={true}
                                    ref={videoRef}
                                    autoPlay
                                    style={{
                                        width: "100%", // 覆盖样式为全宽
                                        minHeight: "70vh", // 限制最大高度
                                        objectFit: "cover", // 保证内容填充容器
                                        transform: "scaleX(-1)", // 保持水平翻转
                                    }}
                                    onLoadedData={() => setVideoLoaded(true)}
                                />
                                {videoLoaded && videoRef.current ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            pointerEvents: 'none',
                                            width: `${videoRef.current.clientWidth}px`, // 根据 video 宽动态设置 SVG 宽
                                            height: `${videoRef.current.clientHeight}px`, // 根据 video 高动态设置 SVG 高
                                            zIndex: 2,
                                        }}
                                        viewBox="0 0 100 100"
                                    >
                                        <ellipse
                                            cx="50"
                                            cy="50"
                                            rx="40.5" // 根据比例调整
                                            ry="57" // 根据比例调整
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeDasharray="5,5" // 虚线样式
                                        />
                                    </svg>
                                ) : null}

                                <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
                            </div>
                            <Button
                                className={"photo-button"}
                                onClick={takePhoto}
                                style={{backgroundColor: isReadyToTakePhoto ? "var(--sub-color)" : "gray"}}
                                disabled={!isReadyToTakePhoto}
                                icon={<IconCamera/>}
                            >
                                {isReadyToTakePhoto ? '拍照' : getWarningMessage()}
                            </Button>

                        </div>
                    ) : (
                        <div className={"preview"}>
                            <h2>预览图片</h2>
                            <img src={capturedImage} alt="Captured preview" style={{width: '100%'}}/>
                            <div className="options">
                                <Button onClick={() => resetCamera()} disabled={isButtonDisabled}>重新拍照</Button>
                                <Button onClick={() => {
                                    localStorage.setItem("historyCacheTimestamp", "1000000000000")
                                    sendFormData()
                                    setIsButtonDisabled(true)
                                }} disabled={isButtonDisabled}>
                                    {isLoading && (
                                        <Spin
                                            size="small"
                                            style={{
                                                marginRight: '8px', // 让 Spin 与文字之间有间距
                                            }}
                                        />
                                    )}
                                    就用这张!
                                </Button>
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
