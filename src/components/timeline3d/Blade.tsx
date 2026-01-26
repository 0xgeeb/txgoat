'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import {
  COLORS,
  BLADE_WIDTH,
  BLADE_HEIGHT_IDLE,
  BLADE_HEIGHT_SELECTED,
  BLADE_DEPTH,
} from './constants';

interface BladeProps {
  position: number;
  isSelected: boolean;
  isHovered: boolean;
}

export function Blade({
  position,
  isSelected,
  isHovered,
}: BladeProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const lerpSpeed = isSelected ? 12 : 8;
    const lerpFactor = 1 - Math.exp(-lerpSpeed * delta);

    // === SCALE ANIMATION - uniform for all selected ===
    const targetScaleY = isSelected
      ? BLADE_HEIGHT_SELECTED / BLADE_HEIGHT_IDLE
      : 1;
    const targetScaleX = isSelected ? 2 : 1;
    const targetScaleZ = isSelected ? 1.5 : 1;

    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScaleY, lerpFactor);
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScaleX, lerpFactor);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScaleZ, lerpFactor);

    // === ROTATION - uniform tilt toward viewer when selected ===
    const targetRotationX = isSelected ? 0.25 : 0;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, lerpFactor);

    // === Z POSITION - come toward camera uniformly ===
    const targetZ = isSelected ? 0.2 : 0;
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, lerpFactor);

    // === Y POSITION - rise up uniformly ===
    const targetY = isSelected ? 0.15 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, lerpFactor);

    // === COLOR ANIMATION ===
    const targetColor = new THREE.Color(
      isSelected
        ? COLORS.bladeSelected
        : isHovered
          ? COLORS.bladeHovered
          : COLORS.bladeIdle
    );
    materialRef.current.color.lerp(targetColor, lerpFactor);

    // === MATERIAL PROPERTIES ===
    const targetMetalness = isSelected ? 0.9 : 0.2;
    const targetRoughness = isSelected ? 0.1 : 0.5;

    materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, targetMetalness, lerpFactor);
    materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, targetRoughness, lerpFactor);
  });

  return (
    <mesh
      ref={meshRef}
      position={[position, 0, 0]}
    >
      <boxGeometry args={[BLADE_WIDTH, BLADE_HEIGHT_IDLE, BLADE_DEPTH]} />
      <meshStandardMaterial
        ref={materialRef}
        color={COLORS.bladeIdle}
        metalness={0.2}
        roughness={0.5}
      />
    </mesh>
  );
}

Blade.displayName = 'Blade';
