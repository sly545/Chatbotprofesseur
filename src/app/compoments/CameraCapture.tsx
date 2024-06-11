import React, { useRef, useState, useEffect } from 'react';
import styles from '../compoments/Chatbot.module.css';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices.filter(device => device.kind === 'videoinput'));
    };
    getDevices();
  }, []);

  const startCamera = async () => {
    let stream: MediaStream | null = null;
    try {
      const nativeCamera = devices.find(device => device.label.includes('HP Wide Vision HD Camera'));
      if (nativeCamera) {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { deviceId: nativeCamera.deviceId } 
        });
      } else if (devices.length > 0) {
        // Use the first available camera if the native camera is not found
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { deviceId: devices[0].deviceId } 
        });
      } else {
        alert('No camera found. Please check your camera connections.');
        return;
      }

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
      alert('Error accessing the camera. Please check your camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.buttonGroup}>
        {!isCameraOn && <button onClick={startCamera} className={`${styles.button}`}>Envois moi ton devoir</button>}
        {isCameraOn && <button onClick={stopCamera} className={`${styles.button} `}>Stop Camera</button>}
      </div>
      <div>
        <video ref={videoRef} style={{ display: isCameraOn ? 'block' : 'none', width: '100%',marginBottom:'12px',marginTop:'12px',borderRadius:'5px' }} />
        {isCameraOn && <button onClick={captureImage} className={`${styles.button} `}>Capture Image</button>} 
      </div>
    </div>
  );
};

export default CameraCapture;
