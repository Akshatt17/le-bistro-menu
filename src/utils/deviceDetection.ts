// Device Detection Utility
export interface DeviceInfo {
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isDesktop: boolean;
  supportsWebXR: boolean;
  supportsCamera: boolean;
  userAgent: string;
  platform: 'android' | 'ios' | 'desktop';
}

export function detectDevice(): DeviceInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Mobile detection
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // Android detection
  const isAndroid = /android/i.test(userAgent);
  
  // iOS detection
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  
  // Desktop detection
  const isDesktop = !isMobile;
  
  // WebXR support detection
  const supportsWebXR = 'xr' in navigator && 'requestSession' in navigator.xr;
  
  // Camera support detection
  const supportsCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  
  // Determine platform
  let platform: 'android' | 'ios' | 'desktop';
  if (isAndroid) {
    platform = 'android';
  } else if (isIOS) {
    platform = 'ios';
  } else {
    platform = 'desktop';
  }
  
  return {
    isMobile,
    isAndroid,
    isIOS,
    isDesktop,
    supportsWebXR,
    supportsCamera,
    userAgent,
    platform
  };
}

// WebXR session request
export async function requestWebXRSession(): Promise<XRSystem | null> {
  try {
    if (!('xr' in navigator)) {
      throw new Error('WebXR not supported');
    }
    
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['local'],
      optionalFeatures: ['bounded-floor', 'hand-tracking']
    });
    
    return session;
  } catch (error) {
    console.error('WebXR session failed:', error);
    return null;
  }
}

// Camera access request
export async function requestCameraAccess(): Promise<MediaStream | null> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera not supported');
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Use back camera on mobile
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    
    return stream;
  } catch (error) {
    console.error('Camera access failed:', error);
    return null;
  }
}

// Check if device supports AR features
export function getARCapabilities(deviceInfo: DeviceInfo) {
  return {
    canUseWebXR: deviceInfo.supportsWebXR && deviceInfo.isMobile,
    canUseCamera: deviceInfo.supportsCamera && deviceInfo.isMobile,
    canUse3DViewer: deviceInfo.isDesktop || !deviceInfo.isMobile,
    recommendedMode: deviceInfo.isMobile ? 'ar' : '3d'
  };
}
