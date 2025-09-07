import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Desktop3DViewerProps {
  modelPath: string;
  dishName: string;
}

export function Desktop3DViewer({ modelPath, dishName }: Desktop3DViewerProps) {
  console.log('Desktop3DViewer rendered with:', { modelPath, dishName });
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Desktop3DViewer useEffect running, mountRef.current:', mountRef.current);
    
    // Use a small timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!mountRef.current) {
        console.log('No mount ref after timeout, this should not happen');
        return;
      }
      
      console.log('Mount ref is available, starting Three.js initialization...');
      initializeThreeJS();
    }, 50);
    
    const initializeThreeJS = () => {
      // Scene setup
      console.log('Starting Three.js initialization...');
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current!.clientWidth / mountRef.current!.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 5);
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current!.clientWidth, mountRef.current!.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Controls setup
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.enablePan = true;
      controlsRef.current = controls;

      // Lighting setup
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.5);
      pointLight.position.set(-10, -10, -5);
      scene.add(pointLight);

      // Load GLB model
      console.log('Creating GLTFLoader...');
      const loader = new GLTFLoader();
      console.log('Attempting to load model from:', modelPath);
      console.log('Full URL would be:', window.location.origin + modelPath);
      
      loader.load(
        modelPath,
        (gltf) => {
          console.log('GLB model loaded successfully:', gltf);
          const model = gltf.scene;
          
          // Scale and position the model
          model.scale.setScalar(1);
          model.position.set(0, 0, 0);
          
          // Enable shadows
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          scene.add(model);
          console.log('Model added to scene');
          setIsLoading(false);
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
        },
        (error) => {
          console.error('Error loading GLB model:', error);
          console.error('Model path was:', modelPath);
          setError(`Failed to load 3D model: ${error.message || 'Unknown error'}`);
          setIsLoading(false);
        }
      );

      // Add to DOM
      mountRef.current!.appendChild(renderer.domElement);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!mountRef.current || !camera || !renderer) return;
        
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);
    };

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', () => {});
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [modelPath]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
        <div className="text-red-500 text-6xl">⚠️</div>
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-gray-500 text-sm">File: {modelPath.split('/').pop()}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="text-gray-600">Loading 3D Model...</p>
        <p className="text-sm text-gray-500">{dishName}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full rounded-lg overflow-hidden" />
      
      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg text-sm">
        <div className="font-medium mb-1">🎮 Desktop Controls:</div>
        <div>• Left click + drag: Rotate</div>
        <div>• Right click + drag: Pan</div>
        <div>• Mouse wheel: Zoom</div>
      </div>
    </div>
  );
}
