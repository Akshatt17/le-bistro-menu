// Model Path Utility
// Determines the correct model file format based on device type

import { detectDevice } from './deviceDetection';


/**
 * Get the appropriate model path based on device type
 * - For regular 3D viewing: Always use GLB files (works well on all devices)
 * - For AR mode: Use USDZ on iOS, GLB on Android/Desktop
 */
export function getModelPath(modelPath: string, forAR: boolean = false): string {
  const deviceInfo = detectDevice();
  
  // If the path is already a USDZ path, return it as-is for iOS AR
  if (modelPath.includes('/usdz/') && modelPath.endsWith('.usdz')) {
    if (deviceInfo.isIOS && forAR) {
      return modelPath;
    } else {
      // For non-iOS devices or non-AR mode, convert USDZ back to GLB
      const glbPath = modelPath.replace('/usdz/', '/glb/').replace('.usdz', '.glb');
      return glbPath;
    }
  }
  
  // If the path is a GLB path
  if (modelPath.includes('/glb/') && modelPath.endsWith('.glb')) {
    // For regular viewing or non-iOS, always use GLB
    return modelPath;
  }
  
  // Safety check: prevent double extensions
  if (modelPath.includes('.usdz.usdz') || modelPath.includes('.glb.glb')) {
    console.warn('Double extension detected in model path:', modelPath);
    return modelPath.replace(/\.(usdz|glb)\.(usdz|glb)$/, '.$2');
  }
  
  // Fallback: return original path
  return modelPath;
}

/**
 * Get model format information for debugging
 */
export function getModelInfo(modelPath: string, forAR: boolean = false) {
  const deviceInfo = detectDevice();
  const selectedPath = getModelPath(modelPath, forAR);
  
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
  
  const isUsingUSDZ = selectedPath.endsWith('.usdz');
  const isARMode = forAR;
  
  return {
    device: deviceInfo.platform,
    isMobile: deviceInfo.isMobile,
    isIOS: deviceInfo.isIOS,
    isAndroid: deviceInfo.isAndroid,
    originalPath: modelPath,
    glbPath,
    usdzPath,
    selectedPath,
    format: isUsingUSDZ ? 'USDZ' : 'GLB',
    reason: isARMode 
      ? (deviceInfo.isIOS 
          ? 'iOS AR uses USDZ for ARKit Quick Look'
          : 'Android/Desktop AR uses GLB for WebXR')
      : 'Regular 3D viewing uses GLB (works well on all devices)',
    isARMode,
    isUsingUSDZ
  };
}
