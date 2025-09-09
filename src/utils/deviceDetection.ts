// Device Detection Utility
export interface DeviceInfo {
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isDesktop: boolean;
  supportsWebXR: boolean;
  supportsCamera: boolean;
  supportsARKit: boolean;
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
  
  // WebXR support detection (iOS has limited support)
  const supportsWebXR = 'xr' in navigator && 'requestSession' in navigator.xr && !isIOS;
  
  // Camera support detection
  const supportsCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  
  // ARKit support detection (iOS 11+)
  const supportsARKit = isIOS && (parseInt(userAgent.match(/os (\d+)/)?.[1] || '0') >= 11);
  
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
    supportsARKit,
    userAgent,
    platform
  };
}

// WebXR session request
export async function requestWebXRSession(): Promise<XRSession | null> {
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

// Camera access request with iOS-specific handling
export async function requestCameraAccess(): Promise<MediaStream | null> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera not supported');
    }
    
    // iOS-specific camera constraints
    const constraints = {
      video: {
        facingMode: 'environment', // Use back camera on mobile
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
    
    // For iOS, we need to be more specific about constraints
    const deviceInfo = detectDevice();
    if (deviceInfo.isIOS) {
      constraints.video = {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      };
    }
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
    canUseARKit: deviceInfo.supportsARKit && deviceInfo.isIOS,
    canUse3DViewer: deviceInfo.isDesktop || !deviceInfo.isMobile,
    recommendedMode: deviceInfo.isIOS ? 'camera' : (deviceInfo.isMobile ? 'ar' : '3d')
  };
}
