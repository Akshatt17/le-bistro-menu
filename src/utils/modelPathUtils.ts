// Model Path Utility
// Determines the correct model file format based on device type

import { detectDevice } from './deviceDetection';

// Round-robin USDZ assignment for iOS AR
const roundRobinUSDZFiles = [
  'sushi_toro_shrimp.usdz',
  'spicy_ramen.usdz', 
  'grilled_cheese_sandwich.usdz',
  'Food_Tiramisu_Cake.usdz',
  'Strawberry_cake.usdz',
  'vietnamese_food.usdz'
];

/**
 * Get a USDZ file using round-robin based on the original GLB filename
 */
function getRoundRobinUSDZ(originalPath: string): string {
  const baseName = originalPath.split('/').pop()?.split('.')[0] || '';
  let hash = 0;
  for (let i = 0; i < baseName.length; i++) {
    const char = baseName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % roundRobinUSDZFiles.length;
  const selectedUSDZ = roundRobinUSDZFiles[index];
  
  console.log(`Round-robin USDZ selection: ${baseName} -> ${selectedUSDZ} (index: ${index})`);
  
  return `./3D models/usdz/${selectedUSDZ}`;
}

/**
 * Get the appropriate model path based on device type
 * - For regular 3D viewing: Always use GLB files (works well on all devices)
 * - For AR mode: Use round-robin USDZ on iOS, GLB on Android/Desktop
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
    // For AR mode on iOS, use round-robin USDZ
    if (deviceInfo.isIOS && forAR) {
      const roundRobinUSDZ = getRoundRobinUSDZ(modelPath);
      console.log(`iOS AR: Using round-robin USDZ: ${roundRobinUSDZ}`);
      return roundRobinUSDZ;
    } else {
      // For regular viewing or non-iOS, always use GLB
      return modelPath;
    }
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
