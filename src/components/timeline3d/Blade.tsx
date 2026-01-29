'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import {
  COLORS,
  BLADE_HEIGHT_IDLE,
  BLADE_HEIGHT_SELECTED,
  BLADE_DEPTH,
} from './constants';

interface BladeProps {
  position: number;
  width: number;
  isSelected: boolean;
  isHovered: boolean;
}

export function Blade({
  position,
  width,
  isSelected,
  isHovered,
}: BladeProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const lerpSpeed = isSelected ? 12 : 8;
    const lerpFactor = 1 - Math.exp(-lerpSpeed * delta);

    // Height animation
    const targetScaleY = isSelected
      ? BLADE_HEIGHT_SELECTED / BLADE_HEIGHT_IDLE
      : 1;

    meshRef.current.scale.y = THREE.MathUtils.lerp(
      meshRef.current.scale.y,
      targetScaleY,
      lerpFactor
    );

    // Y position - rise up when selected (anchor from bottom)
    const currentHeight = BLADE_HEIGHT_IDLE * meshRef.current.scale.y;
    const targetY = isSelected ? (currentHeight - BLADE_HEIGHT_IDLE) / 2 : 0;

    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      lerpFactor
    );

    // Color animation
    const targetColor = new THREE.Color(
      isSelected
        ? COLORS.bladeSelected
        : isHovered
          ? COLORS.bladeHovered
          : COLORS.bladeIdle
    );
    materialRef.current.color.lerp(targetColor, lerpFactor);
  });

  return (
    <mesh
      ref={meshRef}
      position={[position, 0, 0]}
    >
      <boxGeometry args={[width, BLADE_HEIGHT_IDLE, BLADE_DEPTH]} />
      <meshStandardMaterial
        ref={materialRef}
        color={COLORS.bladeIdle}
      />
    </mesh>
  );
}

Blade.displayName = 'Blade';
