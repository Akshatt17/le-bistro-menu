import React, { useRef, useEffect, useState } from 'react';
import { detectDevice } from '../utils/deviceDetection';
import { getModelPath, getModelInfo } from '../utils/modelPathUtils';

interface SimpleModelViewerProps {
  modelPath: string;
  dishName: string;
}

export function SimpleModelViewer({ modelPath, dishName }: SimpleModelViewerProps) {
  const modelViewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deviceInfo = detectDevice();
  
  // Get device-specific model path
  const deviceSpecificModelPath = getModelPath(modelPath);
  const modelInfo = getModelInfo(modelPath);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      console.log('Model loaded successfully');
      setIsLoading(false);
    };

    const handleError = (event: any) => {
      console.error('Model loading error:', event);
      const errorMessage = deviceInfo.isIOS 
        ? `Failed to load ${modelInfo.format} model on iOS. Try refreshing the page or using a different browser.`
        : `Failed to load ${modelInfo.format} model`;
      setError(errorMessage);
      setIsLoading(false);
    };

    const handleProgress = (event: any) => {
      const progress = event.detail.totalProgress;
      console.log('Loading progress:', Math.round(progress * 100) + '%');
    };

    // Add event listeners
    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    modelViewer.addEventListener('progress', handleProgress);

    // Cleanup
    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
      modelViewer.removeEventListener('progress', handleProgress);
    };
  }, [modelPath]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Model</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <p className="text-sm text-gray-500">File: {deviceSpecificModelPath.split('/').pop()}</p>
        <p className="text-sm text-gray-500">Format: {modelInfo.format}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full max-w-2xl relative">
        <model-viewer
          ref={modelViewerRef}
          src={deviceSpecificModelPath}
          alt={dishName}
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer"
          environment-image="neutral"
          shadow-intensity="1"
          shadow-softness="0.5"
          interaction-policy="allow-when-focused"
          touch-action="pan-y"
          loading="eager"
          reveal="auto"
          poster=""
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0'
          }}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading 3D Model...</p>
          </div>
        )}
      </div>
      
      {/* Device-Specific Instructions */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-center max-w-md">
        <h4 className="font-medium text-gray-800 mb-2">
          {deviceInfo.isMobile ? '📱 Mobile Controls:' : '🎮 Desktop Controls:'}
        </h4>
        <ul className="text-gray-600 space-y-1">
          {deviceInfo.isMobile ? (
            <>
              <li>• <strong>Touch:</strong> Drag to rotate model</li>
              <li>• <strong>Pinch:</strong> Zoom in/out</li>
              <li>• <strong>AR:</strong> Tap AR button for immersive view</li>
              <li>• <strong>Device:</strong> {deviceInfo.platform.toUpperCase()}</li>
              <li>• <strong>Format:</strong> {modelInfo.format}</li>
            </>
          ) : (
            <>
              <li>• <strong>Mouse:</strong> Click and drag to rotate</li>
              <li>• <strong>Scroll:</strong> Zoom in/out</li>
              <li>• <strong>Right-click:</strong> Pan around</li>
              <li>• <strong>AR:</strong> Click AR button (if supported)</li>
            </>
          )}
        </ul>
        
        {/* AR Capabilities */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div>AR Support: {deviceInfo.supportsWebXR ? '✅' : '❌'}</div>
            <div>Camera: {deviceInfo.supportsCamera ? '✅' : '❌'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleModelViewer;
