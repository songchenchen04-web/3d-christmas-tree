import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../constants';

export const Lights: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying of the light rig to simulate life
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Base Ambient - Deep Blue Night Sky */}
      <ambientLight intensity={0.8} color="#1e1b4b" />

      {/* 2. City Glow (Warm Orange/Gold from bottom/sides) 
         Simulating the illumination from the Marienplatz square */}
      <spotLight
        position={[20, -5, 20]}
        angle={0.8}
        penumbra={1}
        intensity={4}
        color={COLORS.CITY_WARM_GLOW}
        distance={50}
        castShadow
      />
      
      {/* 3. The "Moon" or Upper Sky Light (Cold Blue) to contrast the warm city */}
      <directionalLight
        position={[-10, 20, -10]}
        intensity={1.5}
        color="#c7d2fe" // Pale blue
      />

      {/* 4. Hero Light on the Tree (Gold) */}
      <spotLight
        position={[5, 10, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={3.0}
        color={COLORS.GOLD_WARM}
        castShadow
      />

      {/* 5. Rim Light (Emerald) to highlight the needles from behind */}
      <pointLight 
        position={[0, 5, -10]} 
        intensity={5} 
        color={COLORS.EMERALD} 
        distance={20}
      />
      
      {/* 6. Uplight specifically for the Trunk and lower branches */}
      <pointLight
        position={[0, -8, 2]}
        intensity={3}
        color={COLORS.GOLD_HIGHLIGHT}
        distance={15}
      />
    </group>
  );
};
