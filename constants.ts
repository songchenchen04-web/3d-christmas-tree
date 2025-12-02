import * as THREE from 'three';

export const COLORS = {
  // Tree Colors
  EMERALD_DEEP: "#001a0d",
  EMERALD: "#046307",
  EMERALD_LIGHT: "#2e8b32",
  TRUNK_BROWN: "#3E2723", // Dark wood
  
  // Luxury Metallics
  GOLD_METALLIC: "#FFD700",
  GOLD_WARM: "#FFB300",
  GOLD_HIGHLIGHT: "#FFF8DC",
  
  // Accent Jewels
  RUBY_RED: "#8a0303",
  AMETHYST_PURPLE: "#4a0e4e",
  
  // Munich Night Atmosphere
  NIGHT_SKY_TOP: "#0f172a", // Deep blue/slate
  NIGHT_SKY_BOTTOM: "#1e1b4b", // Indigo
  CITY_WARM_GLOW: "#ff8c00", // Sodium vapor street light orange
};

// Configuration for the different layers of the tree
export const TREE_LAYERS = [
  // 1. The Trunk (Cylinder core)
  {
    id: 'trunk',
    type: 'TRUNK',
    count: 4000,
    radius: 0.8,
    height: 4, // Visible at bottom
    yOffset: -6.5, // Push down to be the base
    color: COLORS.TRUNK_BROWN,
    scaleMult: 1.0,
    distribution: 'CYLINDER',
    geometry: 'box', // Rough bark strips
  },
  // 2. The Needles (Main Cone)
  {
    id: 'needles',
    type: 'NEEDLE',
    count: 25000, // Very dense
    radius: 4.5, // Wider base
    height: 12,
    yOffset: 0,
    color: COLORS.EMERALD,
    scaleMult: 1.0, 
    distribution: 'CONE',
    geometry: 'box',
  },
  // 3. Gold Ornaments
  {
    id: 'ornaments-gold',
    type: 'ORNAMENT',
    count: 300,
    radius: 4.6,
    height: 12,
    yOffset: 0,
    color: COLORS.GOLD_METALLIC,
    scaleMult: 0.6,
    distribution: 'CONE',
    geometry: 'sphere',
  },
  // 4. Red Ornaments
  {
    id: 'ornaments-red',
    type: 'ORNAMENT',
    count: 200,
    radius: 4.6,
    height: 11,
    yOffset: 0.5,
    color: COLORS.RUBY_RED,
    scaleMult: 0.7,
    distribution: 'CONE',
    geometry: 'sphere',
  },
  // 5. Gifts (Boxes) - Gold
  {
    id: 'gifts-gold',
    type: 'GIFT',
    count: 80,
    radius: 4.8, // Stick out a bit more
    height: 10,
    yOffset: -1,
    color: COLORS.GOLD_WARM,
    scaleMult: 0.8, // Larger than ornaments
    distribution: 'CONE',
    geometry: 'cube',
  },
  // 6. Gifts (Boxes) - Purple
  {
    id: 'gifts-purple',
    type: 'GIFT',
    count: 60,
    radius: 4.8,
    height: 9,
    yOffset: -0.5,
    color: COLORS.AMETHYST_PURPLE,
    scaleMult: 0.9,
    distribution: 'CONE',
    geometry: 'cube',
  },
  // 7. Magic Dust
  {
    id: 'dust',
    type: 'DUST',
    count: 1500,
    radius: 6.0,
    height: 14,
    yOffset: 0,
    color: COLORS.GOLD_HIGHLIGHT,
    scaleMult: 0.3,
    distribution: 'CONE',
    geometry: 'tetra',
  }
] as const;

export const ANIMATION_SPEED = 1.8;
