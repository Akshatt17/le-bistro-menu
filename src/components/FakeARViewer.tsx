import React, { useEffect, useRef, useState } from 'react';
import { detectDevice } from '../utils/deviceDetection';

interface FakeARViewerProps {
  modelPath: string;
  onClose: () => void;
}

const FakeARViewer: React.FC<FakeARViewerProps> = ({ modelPath, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modelViewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0 });
  const [modelScale, setModelScale] = useState(1);
  const deviceInfo = detectDevice();

  // Initialize camera
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Camera access error:', error);
        setCameraError('Camera access denied. Please allow camera permissions and try again.');
      }
    };

    initializeCamera();

    // Cleanup camera stream on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle model viewer load
  const handleModelLoad = () => {
    setIsModelLoaded(true);
    console.log('Fake AR model loaded successfully');
  };

  // Handle model viewer error
  const handleModelError = (error: any) => {
    console.error('Fake AR model error:', error);
    setCameraError('Failed to load 3D model. Please try again.');
  };

  // Mouse/touch drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - modelPosition.x,
      y: e.clientY - modelPosition.y
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    setModelPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setModelScale(prev => Math.max(0.1, Math.min(3, prev * delta)));
  };

  // Touch pinch zoom handler
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Simple pinch zoom implementation
      const scaleFactor = distance / 200; // Adjust sensitivity
      setModelScale(Math.max(0.1, Math.min(3, scaleFactor)));
    }
  };

  // Close handler
  const handleClose = () => {
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* Camera Feed Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Model Viewer Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-auto"
        style={{ zIndex: 1 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <model-viewer
          ref={modelViewerRef}
          src={modelPath}
          camera-controls
          auto-rotate
          auto-rotate-delay="1000"
          rotation-per-second="30deg"
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            transform: `translate(${modelPosition.x}px, ${modelPosition.y}px) scale(${modelScale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          onLoad={handleModelLoad}
          onError={handleModelError}
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          aria-label="Close Fake AR"
        >
          ✕
        </button>

        {/* Reset Position Button */}
        <button
          onClick={() => {
            setModelPosition({ x: 0, y: 0 });
            setModelScale(1);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          aria-label="Reset Model Position"
        >
          ↺
        </button>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg text-center">
          <p className="text-sm mb-2">
            <strong>Fake AR Mode</strong>
          </p>
          <p className="text-xs">
            • Drag to move the model<br/>
            • Scroll to zoom in/out<br/>
            • Pinch to zoom (mobile)<br/>
            • Tap controls to reset
          </p>
        </div>
      </div>

      {/* Error Message */}
      {cameraError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-gray-700 mb-4">{cameraError}</p>
            <button
              onClick={handleClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {!isModelLoaded && !cameraError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading 3D model...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeARViewer;
