'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { ROD_LENGTH, ROD_RADIUS, COLORS } from './constants';

export function Rod() {
  const meshRef = useRef<Mesh>(null);
  const leftCapRef = useRef<Mesh>(null);
  const rightCapRef = useRef<Mesh>(null);

  // Subtle idle animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      // Very subtle breathing effect
      const scale = 1 + Math.sin(time * 0.4) * 0.003;
      meshRef.current.scale.set(1, scale, scale);
    }

    // Subtle rotation on end caps
    if (leftCapRef.current) {
      leftCapRef.current.rotation.x = time * 0.1;
    }
    if (rightCapRef.current) {
      rightCapRef.current.rotation.x = -time * 0.1;
    }
  });

  return (
    <group>
      {/* Main rod with enhanced material */}
      <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[ROD_RADIUS, ROD_RADIUS, ROD_LENGTH, 48]} />
        <meshStandardMaterial
          color={COLORS.rodColor}
          metalness={COLORS.rodMetalness}
          roughness={COLORS.rodRoughness}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* End caps - polished dark metal */}
      <mesh ref={leftCapRef} position={[-ROD_LENGTH / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[ROD_RADIUS * 1.4, ROD_RADIUS * 1.4, 0.05, 48]} />
        <meshStandardMaterial
          color={COLORS.charcoal}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      <mesh ref={rightCapRef} position={[ROD_LENGTH / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[ROD_RADIUS * 1.4, ROD_RADIUS * 1.4, 0.05, 48]} />
        <meshStandardMaterial
          color={COLORS.charcoal}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Inner ring accents on caps */}
      <mesh position={[-ROD_LENGTH / 2 - 0.025, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[ROD_RADIUS * 1.1, 0.008, 8, 48]} />
        <meshStandardMaterial
          color={COLORS.charcoalLight}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[ROD_LENGTH / 2 + 0.025, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[ROD_RADIUS * 1.1, 0.008, 8, 48]} />
        <meshStandardMaterial
          color={COLORS.charcoalLight}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

Rod.displayName = 'Rod';
