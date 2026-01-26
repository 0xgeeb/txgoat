'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { ROD_LENGTH, ROD_RADIUS, COLORS } from './constants';

export function Rod() {
  const meshRef = useRef<Mesh>(null);

  // Subtle idle animation
  useFrame((state) => {
    if (!meshRef.current) return;
    // Very subtle breathing effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.002;
    meshRef.current.scale.set(1, scale, scale);
  });

  return (
    <group>
      {/* Main rod */}
      <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[ROD_RADIUS, ROD_RADIUS, ROD_LENGTH, 32]} />
        <meshStandardMaterial
          color={COLORS.rodColor}
          metalness={COLORS.rodMetalness}
          roughness={COLORS.rodRoughness}
        />
      </mesh>

      {/* End caps - slightly darker, more metallic */}
      <mesh position={[-ROD_LENGTH / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[ROD_RADIUS * 1.3, ROD_RADIUS * 1.3, 0.04, 32]} />
        <meshStandardMaterial
          color={COLORS.charcoal}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[ROD_LENGTH / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[ROD_RADIUS * 1.3, ROD_RADIUS * 1.3, 0.04, 32]} />
        <meshStandardMaterial
          color={COLORS.charcoal}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

Rod.displayName = 'Rod';
