import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const Effects: React.FC = () => {
  return (
    <EffectComposer disableNormalPass>
      {/* Selective bloom for the gold glow */}
      <Bloom 
        luminanceThreshold={0.8} // Only very bright things glow
        mipmapBlur 
        intensity={1.5} 
        radius={0.6}
      />
      
      {/* Film grain for cinematic texture */}
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      
      {/* Dark corners to focus attention */}
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};