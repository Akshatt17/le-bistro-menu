declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      ar?: boolean;
      'ar-modes'?: string;
      'environment-image'?: string;
      'shadow-intensity'?: string;
      'shadow-softness'?: string;
      style?: React.CSSProperties;
      children?: React.ReactNode;
    };
  }
}
