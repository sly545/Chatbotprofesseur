import React, { useRef, useState } from 'react';

const CameraCapture: React.FC<{ onCapture: (dataUrl: string) => void }> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCapture = async () => {
    setIsCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
    stopCapture();
  };

  const stopCapture = () => {
    setIsCapturing(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div>
      <button onClick={startCapture}>Start Camera</button>
      <button onClick={captureImage} disabled={!isCapturing}>Capture</button>
      {isCapturing && <video ref={videoRef} width="300" height="200" />}
      <canvas ref={canvasRef} width="300" height="200" style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;
