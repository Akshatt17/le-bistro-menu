// Model Path Utility
// Determines the correct model file format based on device type

import { detectDevice } from './deviceDetection';

/**
 * Get the appropriate model path based on device type
 * - Android: Uses GLB files (better WebXR support)
 * - iOS: Uses USDZ files (better ARKit support)
 * - Desktop: Uses GLB files (better Three.js support)
 */
export function getModelPath(modelPath: string): string {
  const deviceInfo = detectDevice();
  
  // If the path is already a USDZ path, return it as-is for iOS
  if (modelPath.includes('/usdz/') && modelPath.endsWith('.usdz')) {
    if (deviceInfo.isIOS) {
      return modelPath;
    } else {
      // For non-iOS devices, convert USDZ back to GLB
      const glbPath = modelPath.replace('/usdz/', '/glb/').replace('.usdz', '.glb');
      return glbPath;
    }
  }
  
  // If the path is a GLB path, convert to USDZ for iOS
  if (modelPath.includes('/glb/') && modelPath.endsWith('.glb')) {
    const usdzPath = modelPath.replace('/glb/', '/usdz/').replace('.glb', '.usdz');
    
    if (deviceInfo.isIOS) {
      return usdzPath;
    } else {
      return modelPath;
    }
  }
  
  // Fallback: return original path
  return modelPath;
}

/**
 * Get model format information for debugging
 */
export function getModelInfo(modelPath: string) {
  const deviceInfo = detectDevice();
  const selectedPath = getModelPath(modelPath);
  
  // Determine original format
  const isOriginalUSDZ = modelPath.includes('/usdz/') && modelPath.endsWith('.usdz');
  const isOriginalGLB = modelPath.includes('/glb/') && modelPath.endsWith('.glb');
  
  // Determine converted paths
  const glbPath = isOriginalUSDZ 
    ? modelPath.replace('/usdz/', '/glb/').replace('.usdz', '.glb')
    : modelPath;
  const usdzPath = isOriginalGLB 
    ? modelPath.replace('/glb/', '/usdz/').replace('.glb', '.usdz')
    : modelPath;
  
  return {
    device: deviceInfo.platform,
    isMobile: deviceInfo.isMobile,
    isIOS: deviceInfo.isIOS,
    isAndroid: deviceInfo.isAndroid,
    originalPath: modelPath,
    glbPath,
    usdzPath,
    selectedPath,
    format: selectedPath.endsWith('.usdz') ? 'USDZ' : 'GLB',
    reason: deviceInfo.isIOS 
      ? 'iOS devices use USDZ for better ARKit support'
      : 'Android/Desktop devices use GLB for better WebXR/Three.js support'
  };
}
