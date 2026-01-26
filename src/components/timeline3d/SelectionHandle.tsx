'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
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
  const ringRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !sphereRef.current) return;

    const lerpFactor = 1 - Math.pow(0.001, delta);

    // Animate position
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      position,
      lerpFactor
    );

    // Scale up when active
    const targetScale = isActive ? 1.2 : 1;
    sphereRef.current.scale.setScalar(
      THREE.MathUtils.lerp(sphereRef.current.scale.x, targetScale, lerpFactor)
    );

    // Rotate ring
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * (isActive ? 3 : 1);
    }

    // Subtle hover animation
    const hover = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    groupRef.current.position.y = hover;
  });

  return (
    <group ref={groupRef} position={[position, 0, 0]}>
      {/* Main sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[HANDLE_RADIUS, 16, 16]} />
        <meshStandardMaterial
          color={COLORS.handleColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Decorative ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[HANDLE_RADIUS * 1.4, 0.015, 8, 32]} />
        <meshStandardMaterial
          color={COLORS.charcoalLight}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Direction indicator line */}
      <mesh position={[side === 'start' ? 0.15 : -0.15, 0, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial
          color={COLORS.charcoal}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

SelectionHandle.displayName = 'SelectionHandle';
