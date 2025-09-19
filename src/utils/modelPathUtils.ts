// Model Path Utility
// Determines the correct model file format based on device type

import { detectDevice } from './deviceDetection';

/**
 * Get the appropriate model path based on device type
 * - Android: Uses GLB files (better WebXR support)
 * - iOS: Uses USDZ files (better ARKit support)
 * - Desktop: Uses GLB files (better Three.js support)
 */
export function getModelPath(glbPath: string): string {
  const deviceInfo = detectDevice();
  
  // Convert GLB path to USDZ path
  const usdzPath = glbPath.replace('/glb/', '/usdz/').replace('.glb', '.usdz');
  
  // Return appropriate format based on device
  if (deviceInfo.isIOS) {
    // iOS devices use USDZ for better ARKit support
    return usdzPath;
  } else {
    // Android and desktop devices use GLB for better WebXR/Three.js support
    return glbPath;
  }
}

/**
 * Get model format information for debugging
 */
export function getModelInfo(glbPath: string) {
  const deviceInfo = detectDevice();
  const usdzPath = glbPath.replace('/glb/', '/usdz/').replace('.glb', '.usdz');
  const selectedPath = getModelPath(glbPath);
  
  return {
    device: deviceInfo.platform,
    isMobile: deviceInfo.isMobile,
    isIOS: deviceInfo.isIOS,
    isAndroid: deviceInfo.isAndroid,
    glbPath,
    usdzPath,
    selectedPath,
    format: selectedPath.endsWith('.usdz') ? 'USDZ' : 'GLB',
    reason: deviceInfo.isIOS 
      ? 'iOS devices use USDZ for better ARKit support'
      : 'Android/Desktop devices use GLB for better WebXR/Three.js support'
  };
}
