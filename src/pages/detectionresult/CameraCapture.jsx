import React, { useEffect, useRef, useState } from 'react';
import * as cv from '@techstark/opencv-js';

const CameraComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [warning, setWarning] = useState('');
    const faceCascadeRef = useRef(null); // Cache the CascadeClassifier for performance

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
            console.error('Error loading Haar Cascade file:', error.message);
        }
    };

    const initializeFaceCascade = () => {
        try {
            faceCascadeRef.current = new cv.CascadeClassifier('haarcascade_frontalface_default.xml');
            console.log('CascadeClassifier initialized successfully');
        } catch (error) {
            console.error('Error initializing CascadeClassifier:', error.message);
        }
    };

    const processFrame = () => {
        if (!videoRef.current || !canvasRef.current || !faceCascadeRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        // Ensure video has valid dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Convert the frame to an OpenCV Mat object
        let src = cv.matFromImageData(imageData);

        try {
            // Brightness check
            const mean = cv.mean(src);
            const brightness = (mean[0] + mean[1] + mean[2]) / 3;
            if (brightness < 50) {
                setWarning('The image is too dark');
                cleanup(src);
                return;
            } else if (brightness > 200) {
                setWarning('The image is too bright');
                cleanup(src);
                return;
            } else {
                setWarning('');
            }

            // Convert to grayscale
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

            // Blur detection
            let laplacian = new cv.Mat();
            cv.Laplacian(gray, laplacian, cv.CV_64F);

            let meanMat = new cv.Mat();
            let stddev = new cv.Mat();
            cv.meanStdDev(laplacian, meanMat, stddev);
            const variance = stddev.data64F[0] ** 2;

            if (variance < 100) {
                setWarning('The image is blurry');
                cleanup(src, gray, laplacian, meanMat, stddev);
                return;
            }

            // Face detection
            const faces = new cv.RectVector();
            faceCascadeRef.current.detectMultiScale(gray, faces, 1.1, 3, 0);

            if (faces.size() === 0) {
                setWarning('No face detected');
            } else {
                const face = faces.get(0);
                if (face.width < canvas.width * 0.2 || face.height < canvas.height * 0.2) {
                    setWarning('Face is partially obscured or not fully visible');
                } else {
                    setWarning('');
                }
            }

            // Cleanup
            faces.delete();
            cleanup(src, gray, laplacian, meanMat, stddev);
        } catch (error) {
            console.error('Face detection error:', error.message);
            cleanup(src);
        }
    };

    const cleanup = (...mats) => {
        mats.forEach((mat) => mat && mat.delete());
    };

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline width="640" height="480" />
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            {warning ? <h1 className="warning">{warning}</h1> : <h1>FACE DETECTED ✅</h1>}
        </div>
    );
};

export default CameraComponent;
