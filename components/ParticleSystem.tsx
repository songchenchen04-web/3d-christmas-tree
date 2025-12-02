import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { AppState, ParticleData } from '../types';
import { ANIMATION_SPEED } from '../constants';

interface ParticleSystemProps {
  count: number;
  radius: number;
  height: number;
  yOffset: number;
  color: string;
  appState: AppState;
  geometryType: 'box' | 'sphere' | 'tetra' | 'cube';
  distributionType: 'CONE' | 'CYLINDER';
  scaleMult: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count,
  radius,
  height,
  yOffset,
  color,
  appState,
  geometryType,
  distributionType,
  scaleMult,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Create data for all particles
  const particles = useMemo(() => {
    const temp: ParticleData[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI * goldenRatio;

    for (let i = 0; i < count; i++) {
      // 1. TREE POSITION
      const t = i / count; // Normalized index (0 to 1)
      
      let xTree, yTree, zTree;

      if (distributionType === 'CYLINDER') {
        // TRUNK Logic: Uniform radius, spread across height
        const currentRadius = radius * Math.sqrt(Math.random()); // Uniform disk distribution or surface? Let's do Volume for trunk
        const angle = Math.random() * Math.PI * 2;
        
        xTree = Math.cos(angle) * currentRadius;
        zTree = Math.sin(angle) * currentRadius;
        yTree = (t * height) - (height / 2) + yOffset;

      } else {
        // CONE Logic (Tree foliage)
        // t maps to height. 0 is bottom, 1 is top.
        // But we want to randomize the layers a bit so it's not a perfect spiral line
        
        // We use the Fibonacci spiral for even packing on the surface
        const currentHeight = (t * height) - (height / 2) + yOffset;
        
        // Radius at this height. 
        // Note: linear taper (1-t) makes a cone.
        // We add some randomness to 't' for the radius calculation so particles aren't perfectly on the shell
        const radiusAtHeight = radius * (1 - t); 
        
        // Push some elements inside the volume (volumetric tree), mostly near surface
        const volumeFactor = 0.8 + 0.2 * Math.sqrt(Math.random());
        const finalRadius = radiusAtHeight * volumeFactor;

        const angle = i * angleIncrement;
        xTree = Math.cos(angle) * finalRadius;
        zTree = Math.sin(angle) * finalRadius;
        yTree = currentHeight;
      }
      
      // Jitter
      const jitter = geometryType === 'box' ? 0.4 : 0.1;
      const treePos = new THREE.Vector3(
        xTree + (Math.random() - 0.5) * jitter,
        yTree + (Math.random() - 0.5) * jitter,
        zTree + (Math.random() - 0.5) * jitter
      );

      // 2. SCATTER POSITION (Random Sphere Distribution)
      const scatterRadius = Math.max(height, 15); 
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = scatterRadius * Math.cbrt(Math.random());

      const xScatter = r * Math.sin(phi) * Math.cos(theta);
      const yScatter = r * Math.sin(phi) * Math.sin(theta);
      const zScatter = r * Math.cos(phi);
      
      const scatterPos = new THREE.Vector3(xScatter, yScatter, zScatter);

      // Orientation
      const rotX = Math.random() * Math.PI;
      const rotY = Math.random() * Math.PI;
      const rotZ = Math.random() * Math.PI;
      
      temp.push({
        id: i,
        treePosition: treePos,
        scatterPosition: scatterPos,
        rotation: new THREE.Euler(rotX, rotY, rotZ),
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count, radius, height, yOffset, distributionType, geometryType]);

  // Current interpolation factor (0 = scattered, 1 = tree)
  const morphFactor = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const targetFactor = appState === AppState.TREE_SHAPE ? 1 : 0;
    morphFactor.current = THREE.MathUtils.lerp(
      morphFactor.current,
      targetFactor,
      delta * ANIMATION_SPEED
    );

    const time = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      const { treePosition, scatterPosition, rotation, scale, speed, phase } = particle;

      const currentPos = new THREE.Vector3().lerpVectors(
        scatterPosition,
        treePosition,
        morphFactor.current
      );

      // Floating noise
      const noiseAmp = THREE.MathUtils.lerp(1.5, 0.05, morphFactor.current);
      const floatY = Math.sin(time * speed + phase) * noiseAmp;
      const floatX = Math.cos(time * speed * 0.5 + phase) * noiseAmp * 0.5;
      
      dummy.position.copy(currentPos).add(new THREE.Vector3(floatX, floatY, 0));

      // Rotation
      const rotSpeed = THREE.MathUtils.lerp(0.5, 0.05, morphFactor.current);
      dummy.rotation.set(
        rotation.x + time * rotSpeed,
        rotation.y + time * rotSpeed,
        rotation.z
      );

      // Scale pulse
      const isOrnament = geometryType === 'sphere' || geometryType === 'cube';
      const pulseBase = isOrnament ? 0.1 : 0.01;
      const pulse = 1 + Math.sin(time * 3 + phase) * pulseBase;
      
      dummy.scale.setScalar(scale * scaleMult * pulse);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Material setup
  const isTrunk = distributionType === 'CYLINDER';
  const isMetallic = geometryType === 'sphere' || geometryType === 'cube';
  const isDust = geometryType === 'tetra';

  const materialProps = {
    color: color,
    roughness: isTrunk ? 0.9 : (isMetallic ? 0.15 : 0.7),
    metalness: isMetallic ? 0.9 : 0.1,
    emissive: new THREE.Color(color),
    emissiveIntensity: isDust ? 2.0 : (isMetallic ? 0.2 : 0.0),
  };

  // Geometry Selection
  let geometry;
  if (geometryType === 'box') {
    // Needles or Bark Strips
    if (distributionType === 'CYLINDER') {
       // Trunk Bark: blocky
       geometry = <boxGeometry args={[0.2, 0.4, 0.2]} />;
    } else {
       // Needles: Thin and elegant
       geometry = <boxGeometry args={[0.015, 0.55, 0.015]} />;
    }
  } else if (geometryType === 'sphere') {
    geometry = <sphereGeometry args={[0.1, 16, 16]} />;
  } else if (geometryType === 'cube') {
    // Gifts
    geometry = <boxGeometry args={[0.25, 0.25, 0.25]} />;
  } else {
    // Dust
    geometry = <tetrahedronGeometry args={[0.1]} />;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      {geometry}
      <meshStandardMaterial {...materialProps} />
    </instancedMesh>
  );
};
