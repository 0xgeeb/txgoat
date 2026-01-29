'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import { COLORS, HANDLE_RADIUS } from './constants';

interface SelectionHandleProps {
  position: number;
  isActive: boolean;
  side: 'start' | 'end';
}

export function SelectionHandle({ position, isActive, side }: SelectionHandleProps) {
  const groupRef = useRef<Group>(null);
  const sphereRef = useRef<Mesh>(null);
  const sphereMaterialRef = useRef<MeshStandardMaterial>(null);
  const ringRef = useRef<Mesh>(null);
  const outerRingRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !sphereRef.current) return;

    const time = state.clock.elapsedTime;
    const lerpFactor = 1 - Math.exp(-12 * delta);

    // Animate position smoothly
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      position,
      lerpFactor
    );

    // Scale up when active with subtle pulse
    const pulseScale = isActive ? 1.15 + Math.sin(time * 4) * 0.05 : 1;
    sphereRef.current.scale.setScalar(
      THREE.MathUtils.lerp(sphereRef.current.scale.x, pulseScale, lerpFactor)
    );

    // Emissive glow on sphere
    if (sphereMaterialRef.current) {
      const targetEmissive = isActive ? 0.3 : 0.1;
      sphereMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        sphereMaterialRef.current.emissiveIntensity,
        targetEmissive + Math.sin(time * 3) * 0.05,
        lerpFactor
      );
    }

    // Rotate inner ring
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * (isActive ? 2.5 : 0.8);
      ringRef.current.rotation.z += delta * 0.3;
    }

    // Rotate outer ring in opposite direction
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * (isActive ? -1.5 : -0.5);
    }

    // Subtle floating animation
    const floatY = Math.sin(time * 2 + (side === 'start' ? 0 : Math.PI)) * 0.025;
    const floatZ = Math.cos(time * 1.5) * 0.01;
    groupRef.current.position.y = floatY;
    groupRef.current.position.z = 0.15 + floatZ;
  });

  return (
    <group ref={groupRef} position={[position, 0, 0.15]}>
      {/* Main sphere with glow */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[HANDLE_RADIUS, 24, 24]} />
        <meshStandardMaterial
          ref={sphereMaterialRef}
          color={COLORS.handleColor}
          metalness={0.9}
          roughness={0.1}
          emissive={COLORS.glowColor}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Inner decorative ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[HANDLE_RADIUS * 1.3, 0.012, 8, 48]} />
        <meshStandardMaterial
          color={COLORS.glowColor}
          metalness={0.7}
          roughness={0.2}
          emissive={COLORS.glowColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer decorative ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[HANDLE_RADIUS * 1.6, 0.008, 6, 48]} />
        <meshStandardMaterial
          color={COLORS.charcoalLight}
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

SelectionHandle.displayName = 'SelectionHandle';
