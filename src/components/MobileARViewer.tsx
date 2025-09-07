import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { detectDevice, requestCameraAccess, requestWebXRSession } from '../utils/deviceDetection';

interface MobileARViewerProps {
  modelPath: string;
  dishName: string;
}

export function MobileARViewer({ modelPath, dishName }: MobileARViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [arMode, setArMode] = useState<'camera' | 'webxr' | 'fallback'>('camera');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const deviceInfo = detectDevice();

  useEffect(() => {
    initializeAR();
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeAR = async () => {
    try {
      setIsLoading(true);
      
      // Try WebXR first if supported
      if (deviceInfo.supportsWebXR) {
        const xrSession = await requestWebXRSession();
        if (xrSession) {
          setArMode('webxr');
          await initializeWebXR(xrSession);
          return;
        }
      }
      
      // Fallback to camera AR
      if (deviceInfo.supportsCamera) {
        const stream = await requestCameraAccess();
        if (stream) {
          setCameraStream(stream);
          setArMode('camera');
          await initializeCameraAR(stream);
          return;
        }
      }
      
      // Final fallback
      setArMode('fallback');
      await initializeFallback();
      
    } catch (error) {
      console.error('AR initialization failed:', error);
      setError('Failed to initialize AR');
      setIsLoading(false);
    }
  };

  const initializeWebXR = async (xrSession: XRSystem) => {
    // WebXR implementation would go here
    // For now, fallback to camera AR
    console.log('WebXR session started:', xrSession);
    setIsLoading(false);
  };

  const initializeCameraAR = async (stream: MediaStream) => {
    if (!videoRef.current || !canvasRef.current) return;

    // Setup video element
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    // Setup Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    rendererRef.current = renderer;

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(0.5);
        model.position.set(0, 0, -2);
        scene.add(model);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading GLB model:', error);
        setError('Failed to load 3D model');
        setIsLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };

  const initializeFallback = async () => {
    // Simple fallback without camera
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-gray-500 text-sm">Device: {deviceInfo.platform}</p>
        <button 
          onClick={initializeAR}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="text-gray-600">Initializing AR...</p>
        <p className="text-sm text-gray-500">{dishName}</p>
        <p className="text-xs text-gray-400">Mode: {arMode}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Camera Feed */}
      {arMode === 'camera' && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />
      )}
      
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* AR Controls */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg text-sm">
        <div className="font-medium mb-1">📱 AR Mode: {arMode}</div>
        <div>• Device: {deviceInfo.platform}</div>
        <div>• WebXR: {deviceInfo.supportsWebXR ? '✅' : '❌'}</div>
        <div>• Camera: {deviceInfo.supportsCamera ? '✅' : '❌'}</div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg text-sm">
        <div className="font-medium mb-1">🎮 Mobile AR Controls:</div>
        <div>• Point camera at flat surface</div>
        <div>• Tap to place 3D model</div>
        <div>• Pinch to scale model</div>
      </div>
      
      {/* Fallback Message */}
      {arMode === 'fallback' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">{dishName}</h3>
            <p className="text-gray-600 mb-4">AR not available on this device</p>
            <p className="text-sm text-gray-500">
              Camera or WebXR support required for AR
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
