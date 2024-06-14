import React, { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  buttonClassName?: string; // Classe pour le style des boutons
  videoStyle?: React.CSSProperties; // Style pour la vidéo
  containerStyle?: React.CSSProperties; // Style pour le conteneur de la caméra
  countdownClassName?: string; // Classe pour le style du compte à rebours
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  buttonClassName,
  videoStyle,
  containerStyle,
  countdownClassName,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
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

  const startCountdown = () => {
    let count = 5;
    setCountdown(count);
    const countdownInterval = setInterval(() => {
      playSound('start-sound.mp3');
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countdownInterval);
        captureImage();
        setCountdown(null);
      }
    }, 1000);
  };

  const playSound = (soundFile: string) => {
    const audio = new Audio(`/sounds/${soundFile}`);
    audio.play();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div>
        {!isCameraOn && <button onClick={startCamera} className={buttonClassName}>Envois moi ton devoir</button>}
        {isCameraOn && <button onClick={stopCamera} className={buttonClassName}>Stop Camera</button>}
      </div>
      <div style={{ position: 'relative' }}>
        <video ref={videoRef} style={{ ...videoStyle, display: isCameraOn ? 'block' : 'none' }} />
        {isCameraOn && countdown === null && (
          <button onClick={startCountdown} className={buttonClassName}>Capture Image</button>
        )}
        {countdown !== null && (
          <div className={countdownClassName} style={{ position: 'absolute', top: '20%', left: '14%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
             {countdown}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
