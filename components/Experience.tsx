import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Lights } from './Lights';
import { ParticleSystem } from './ParticleSystem';
import { Effects } from './Effects';
import { AppState } from '../types';
import { COLORS, TREE_LAYERS } from '../constants';
import * as THREE from 'three';

interface ExperienceProps {
  appState: AppState;
}

export const Experience: React.FC<ExperienceProps> = ({ appState }) => {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: false,
          toneMapping: THREE.ReinhardToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        {/* Munich Night Background */}
        <color attach="background" args={[COLORS.NIGHT_SKY_BOTTOM]} />
        <fog attach="fog" args={[COLORS.NIGHT_SKY_BOTTOM, 15, 45]} />

        <PerspectiveCamera makeDefault position={[0, 0, 22]} fov={40} />
        
        <Lights />
        
        {/* Environment - Night City Vibe */}
        <Environment preset="night" blur={0.6} background={false} />
        
        {/* Subtle Stars in the distance */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <group position={[0, -4, 0]}>
          {TREE_LAYERS.map((layer) => (
            <ParticleSystem
              key={layer.id}
              count={layer.count}
              radius={layer.radius}
              height={layer.height}
              yOffset={layer.yOffset || 0}
              color={layer.color}
              appState={appState}
              geometryType={layer.geometry}
              distributionType={layer.distribution}
              scaleMult={layer.scaleMult}
            />
          ))}
        </group>

        {/* Reflective Ground (Wet cobblestone look) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#050510" 
            roughness={0.2} 
            metalness={0.6} 
          />
        </mesh>

        <Effects />
        
        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.9}
          minDistance={12}
          maxDistance={35}
          autoRotate={appState === AppState.TREE_SHAPE}
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
