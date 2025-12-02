import * as THREE from 'three';

export enum AppState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface ParticleData {
  id: number;
  scatterPosition: THREE.Vector3;
  treePosition: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  speed: number;
  phase: number;
}

export interface TreeConfig {
  id: string;
  count: number;
  radius: number;
  height: number;
  yOffset: number;
  color: string;
  type: 'NEEDLE' | 'ORNAMENT' | 'DUST' | 'TRUNK' | 'GIFT';
  distribution: 'CONE' | 'CYLINDER';
  geometry: 'box' | 'sphere' | 'tetra' | 'cube';
  scaleMult: number;
}
