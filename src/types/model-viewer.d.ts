declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': {
      src?: string;
      'ios-src'?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      ar?: boolean;
      'ar-modes'?: string;
      'environment-image'?: string;
      'shadow-intensity'?: string;
      'shadow-softness'?: string;
      'interaction-policy'?: string;
      'touch-action'?: string;
      loading?: string;
      reveal?: string;
      poster?: string;
      style?: React.CSSProperties;
      children?: React.ReactNode;
      ref?: React.Ref<any>;
    };
  }
}



