import React, { useEffect, useRef, useState } from 'react';
import * as cv from '@techstark/opencv-js';

const CameraComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const faceCascadeRef = useRef(null); // Cache the CascadeClassifier for performance
    const [isReadyToTakePhoto, setIsReadyToTakePhoto] = useState(false);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        const initialize = async () => {
            await loadCascadeFile(); // Ensure the Haar Cascade file is loaded
            initializeFaceCascade(); // Initialize the CascadeClassifier
            startCamera(); // Start accessing the camera
            const interval = setInterval(processFrame, 1000); // Process one frame per second
            return () => clearInterval(interval); // Cleanup on unmount
        };
        initialize();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
            });
            videoRef.current.srcObject = stream;
        } catch (err) {
            console.error('Error accessing camera: ', err);
        }
    };

    const loadCascadeFile = async () => {
        const faceCascadeUrl = '/haarcascade_frontalface_default.xml';
        try {
            const response = await fetch(faceCascadeUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch cascade file: ${response.status} ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer();
            const data = new Uint8Array(buffer);
            cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', data, true, false, false);
            console.log('Cascade file loaded successfully');
        } catch (error) {
            console.warn('Non-critical error loading Haar Cascade file:', error.message);
        }
    };

    const initializeFaceCascade = () => {
        try {
            if (!cv.CascadeClassifier) {
                console.error('CascadeClassifier is not available in OpenCV.js');
                return;
            }
            faceCascadeRef.current = new cv.CascadeClassifier('haarcascade_frontalface_default.xml');
            console.log('CascadeClassifier initialized successfully');
        } catch (error) {
            console.error('Error initializing CascadeClassifier:', error.message);
        }
    };

    const processFrame = () => {
        if (!videoRef.current || !canvasRef.current || !faceCascadeRef.current) {
            console.warn('Skipping frame processing due to missing resources');
            return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let src = cv.matFromImageData(imageData);

        try {
            let isValid = true; // Track if the image meets all conditions

            // Brightness check
            const brightnessThreshold = { min: 70, max: 180 };
            const mean = cv.mean(src);
            const brightness = (mean[0] + mean[1] + mean[2]) / 3;

            if (brightness < brightnessThreshold.min) {
                setWarning('The image is too dark, please ensure good lighting');
                isValid = false;
            } else if (brightness > brightnessThreshold.max) {
                setWarning('The image is too bright, please avoid overexposure');
                isValid = false;
            } else {
                setWarning('');
            }

            // Convert to grayscale
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

            // Blur detection
            const blurThreshold = 200;
            let laplacian = new cv.Mat();
            cv.Laplacian(gray, laplacian, cv.CV_64F);

            let meanMat = new cv.Mat();
            let stddev = new cv.Mat();
            cv.meanStdDev(laplacian, meanMat, stddev);
            const variance = stddev.data64F[0] ** 2;

            if (variance < blurThreshold) {
                setWarning('The image is blurry, please focus properly');
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
                setWarning('No face detected, please ensure your face is fully visible');
                isValid = false;
            } else {
                const face = faces.get(0);
                const minFaceWidth = canvas.width * 0.3;
                const minFaceHeight = canvas.height * 0.3;

                if (face.width < minFaceWidth || face.height < minFaceHeight) {
                    setWarning(
                        'Face is too small or partially visible, please center your face in the frame'
                    );
                    isValid = false;
                } else {
                    setWarning('');
                }
            }

            faces.delete();
            cleanup(src, gray, laplacian, meanMat, stddev);

            setIsReadyToTakePhoto(isValid);
        } catch (error) {
            console.error('Face detection error:', error.message);
            cleanup(src);
            setIsReadyToTakePhoto(false);
        }
    };

    const cleanup = (...mats) => {
        mats.forEach((mat) => mat && mat.delete());
    };

    const getWarningMessage = () => {
        if (!isReadyToTakePhoto) {
            return warning || '实时画面不符合照相要求❌';
        }
        return '可以拍照了✅';
    };

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline width="640" height="480" />
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <h1>{getWarningMessage()}</h1>
        </div>
    );
};

export default CameraComponent;