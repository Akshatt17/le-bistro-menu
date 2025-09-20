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
  const [modelViewerReady, setModelViewerReady] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const deviceInfo = detectDevice();
  
  // Get device-specific model path - always use GLB for regular viewing
  const deviceSpecificModelPath = getModelPath(modelPath, false); // false = regular viewing
  const modelInfo = getModelInfo(modelPath, false);
  
  // For Safari on iOS, get the AR-specific path for ios-src
  const arModelPath = deviceInfo.isIOS ? getModelPath(modelPath, true) : undefined;
  
  // Debug logging
  console.log('SimpleModelViewer Debug:', {
    originalPath: modelPath,
    deviceSpecificPath: deviceSpecificModelPath,
    arModelPath: arModelPath,
    deviceInfo: {
      platform: deviceInfo.platform,
      isIOS: deviceInfo.isIOS,
      isAndroid: deviceInfo.isAndroid
    },
    modelInfo: {
      format: modelInfo.format,
      selectedPath: modelInfo.selectedPath
    },
    browser: {
      isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
      userAgent: navigator.userAgent
    }
  });

  // Test file accessibility
  useEffect(() => {
    const testFileAccess = async () => {
      try {
        const response = await fetch(deviceSpecificModelPath, { method: 'HEAD' });
        console.log('File accessibility test:', {
          path: deviceSpecificModelPath,
          status: response.status,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // Additional iOS-specific checks
        if (deviceInfo.isIOS) {
          console.log('iOS-specific checks:', {
            userAgent: navigator.userAgent,
            isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
            supportsQuickLook: 'QuickLook' in window,
            fileExtension: deviceSpecificModelPath.split('.').pop(),
            isUSDZ: deviceSpecificModelPath.endsWith('.usdz'),
            arModelPath: arModelPath,
            arModelExtension: arModelPath?.split('.').pop()
          });
          
          // Test AR model accessibility for Safari
          if (arModelPath) {
            fetch(arModelPath, { method: 'HEAD' })
              .then(response => {
                console.log('Safari AR model accessibility:', {
                  path: arModelPath,
                  status: response.status,
                  ok: response.ok,
                  contentType: response.headers.get('content-type')
                });
              })
              .catch(error => {
                console.error('Safari AR model accessibility failed:', error);
              });
          }
        }
      } catch (error) {
        console.error('File accessibility test failed:', error);
      }
    };
    
    testFileAccess();
  }, [deviceSpecificModelPath, deviceInfo.isIOS]);

  // Check if model-viewer is ready
  useEffect(() => {
    const checkModelViewerReady = () => {
      const modelViewer = modelViewerRef.current;
      if (modelViewer && typeof modelViewer.addEventListener === 'function') {
        setModelViewerReady(true);
        console.log('Model viewer is ready');
      } else {
        console.log('Model viewer not ready, retrying in 100ms...');
        setTimeout(checkModelViewerReady, 100);
      }
    };
    
    checkModelViewerReady();
  }, []);

  // Detect AR mode activation
  useEffect(() => {
    if (!modelViewerReady) return;
    
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleARModeChange = (event: any) => {
      const isAR = event.detail?.mode === 'quick-look' || event.detail?.mode === 'webxr';
      console.log('AR mode changed:', { 
        isAR, 
        mode: event.detail?.mode,
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
        userAgent: navigator.userAgent
      });
      setIsARMode(isAR);
      
      // If AR is activated on iOS, switch to USDZ if available
      if (isAR && deviceInfo.isIOS) {
        const arModelPath = getModelPath(modelPath, true); // true = for AR
        if (arModelPath !== deviceSpecificModelPath) {
          console.log('Switching to USDZ for AR mode:', arModelPath);
          // Update the model source
          modelViewer.src = arModelPath;
        }
      }
    };

    // Safari-specific AR detection
    const handleARButtonClick = () => {
      console.log('AR button clicked on Safari');
      if (deviceInfo.isIOS) {
        const arModelPath = getModelPath(modelPath, true);
        console.log('Safari AR: Using model path:', arModelPath);
        // For Safari, we might need to update the ios-src attribute
        if (arModelPath.endsWith('.usdz')) {
          modelViewer.setAttribute('ios-src', arModelPath);
        }
      }
    };

    const handleLoad = () => {
      console.log('Model loaded successfully');
      setIsLoading(false);
    };

    const handleError = (event: any) => {
      console.error('Model loading error:', event);
      console.error('Error details:', {
        deviceInfo,
        modelPath: deviceSpecificModelPath,
        modelInfo,
        eventDetail: event.detail
      });
      
      // For iOS USDZ errors, try to provide more helpful information
      if (deviceInfo.isIOS && deviceSpecificModelPath.endsWith('.usdz')) {
        console.log('iOS USDZ loading failed, checking for common issues...');
        console.log('Model-viewer version:', document.querySelector('model-viewer')?.getAttribute('src'));
        console.log('iOS-src attribute:', document.querySelector('model-viewer')?.getAttribute('ios-src'));
      }
      
      const errorMessage = deviceInfo.isIOS 
        ? `Failed to load ${modelInfo.format} model on iOS. Path: ${deviceSpecificModelPath}. This might be due to iOS Safari compatibility or model format issues. Try refreshing the page or using a different browser.`
        : `Failed to load ${modelInfo.format} model. Path: ${deviceSpecificModelPath}`;
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
    modelViewer.addEventListener('ar-status', handleARModeChange);
    
    // Safari-specific event listeners
    modelViewer.addEventListener('ar-tracking', handleARModeChange);
    modelViewer.addEventListener('ar-ready', handleARModeChange);
    
    // Listen for AR button clicks (Safari specific)
    const arButton = modelViewer.shadowRoot?.querySelector('[data-ar-button]');
    if (arButton) {
      arButton.addEventListener('click', handleARButtonClick);
    }

    // Cleanup
    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
      modelViewer.removeEventListener('progress', handleProgress);
      modelViewer.removeEventListener('ar-status', handleARModeChange);
      modelViewer.removeEventListener('ar-tracking', handleARModeChange);
      modelViewer.removeEventListener('ar-ready', handleARModeChange);
      
      if (arButton) {
        arButton.removeEventListener('click', handleARButtonClick);
      }
    };
  }, [modelPath, modelViewerReady, deviceInfo.isIOS]);

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
          ar-modes={deviceInfo.isIOS ? "quick-look" : "webxr scene-viewer"}
          environment-image="neutral"
          shadow-intensity="1"
          shadow-softness="0.5"
          interaction-policy="allow-when-focused"
          touch-action="pan-y"
          loading="eager"
          reveal="auto"
          poster=""
          ios-src={arModelPath}
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
              <li>• <strong>Format:</strong> {modelInfo.format} ({modelInfo.reason})</li>
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
