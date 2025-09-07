import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X, AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { detectDevice, getARCapabilities } from '../utils/deviceDetection';
import { SimpleModelViewer } from './SimpleModelViewer';

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  modelPath: string;
  dishName: string;
}

// Device-Aware AR Viewer Component
function DeviceAwareARViewer({ modelPath, dishName }: { modelPath: string; dishName: string }) {
  console.log('DeviceAwareARViewer rendered with:', { modelPath, dishName });
  const [deviceInfo, setDeviceInfo] = useState(detectDevice());
  const [capabilities, setCapabilities] = useState(getARCapabilities(deviceInfo));

  useEffect(() => {
    setDeviceInfo(detectDevice());
    setCapabilities(getARCapabilities(deviceInfo));
  }, []);

  return (
    <div className="w-full h-full">
      {/* Device Info Header */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          {deviceInfo.isMobile ? (
            <Smartphone className="h-5 w-5 text-blue-500" />
          ) : (
            <Monitor className="h-5 w-5 text-green-500" />
          )}
          <span className="font-medium">
            {deviceInfo.platform.toUpperCase()} Device
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• WebXR: {capabilities.canUseWebXR ? '✅ Supported' : '❌ Not Supported'}</div>
          <div>• Camera: {capabilities.canUseCamera ? '✅ Available' : '❌ Not Available'}</div>
          <div>• 3D Viewer: {capabilities.canUse3DViewer ? '✅ Available' : '❌ Not Available'}</div>
          <div>• Recommended: {capabilities.recommendedMode.toUpperCase()}</div>
        </div>
      </div>

             {/* Render model viewer */}
             <SimpleModelViewer modelPath={modelPath} dishName={dishName} />
    </div>
  );
}

export function ARViewer({ isOpen, onClose, modelPath, dishName }: ARViewerProps) {
  console.log('ARViewer rendered with:', { isOpen, modelPath, dishName });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            🍽️ {dishName} - 3D View
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 relative p-6">
          <DeviceAwareARViewer modelPath={modelPath} dishName={dishName} />
        </div>

        {/* Instructions */}
        <div className="p-6 pt-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">🎮 Device-Specific Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>File:</strong> {modelPath.split('/').pop()}</li>
              <li>• <strong>Format:</strong> GLB (GL Transmission Format Binary)</li>
              <li>• <strong>Desktop:</strong> Interactive 3D model with mouse controls</li>
              <li>• <strong>Mobile:</strong> AR overlay with camera feed (if supported)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ARViewer;
