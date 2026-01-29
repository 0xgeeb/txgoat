'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshBasicMaterial } from 'three';
import * as THREE from 'three';
import { COLORS, ROD_RADIUS } from './constants';
import { percentToPosition } from './utils';

interface SelectionGlowProps {
  startPercent: number;
  endPercent: number;
  visible: boolean;
}

export function SelectionGlow({ startPercent, endPercent, visible }: SelectionGlowProps) {
  const outerGlowRef = useRef<Mesh>(null);
  const outerMaterialRef = useRef<MeshBasicMaterial>(null);
  const innerGlowRef = useRef<Mesh>(null);
  const innerMaterialRef = useRef<MeshBasicMaterial>(null);
  const pulseRef = useRef<Mesh>(null);
  const pulseMaterialRef = useRef<MeshBasicMaterial>(null);
  const groundGlowRef = useRef<Mesh>(null);
  const groundMaterialRef = useRef<MeshBasicMaterial>(null);

  const minPercent = Math.min(startPercent, endPercent);
  const maxPercent = Math.max(startPercent, endPercent);

  const startPos = percentToPosition(minPercent);
  const endPos = percentToPosition(maxPercent);
  const width = Math.max(0.01, endPos - startPos);
  const centerPos = (startPos + endPos) / 2;

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const lerpFactor = 1 - Math.exp(-8 * delta);

    // Outer glow - soft backdrop for depth
    if (outerGlowRef.current && outerMaterialRef.current) {
      const targetOpacity = visible ? 0.08 : 0;
      outerMaterialRef.current.opacity = THREE.MathUtils.lerp(
        outerMaterialRef.current.opacity,
        targetOpacity,
        lerpFactor
      );
      outerGlowRef.current.position.x = THREE.MathUtils.lerp(
        outerGlowRef.current.position.x,
        centerPos,
        lerpFactor
      );
      outerGlowRef.current.scale.x = THREE.MathUtils.lerp(
        outerGlowRef.current.scale.x,
        width + 0.3,
        lerpFactor
      );
    }

    // Inner glow cylinder - wraps around rod
    if (innerGlowRef.current && innerMaterialRef.current) {
      const pulseIntensity = 0.12 + Math.sin(time * 2.5) * 0.03;
      const targetOpacity = visible ? pulseIntensity : 0;
      innerMaterialRef.current.opacity = THREE.MathUtils.lerp(
        innerMaterialRef.current.opacity,
        targetOpacity,
        lerpFactor
      );
      innerGlowRef.current.position.x = THREE.MathUtils.lerp(
        innerGlowRef.current.position.x,
        centerPos,
        lerpFactor
      );
      innerGlowRef.current.scale.x = THREE.MathUtils.lerp(
        innerGlowRef.current.scale.x,
        width,
        lerpFactor
      );

      // Pulsing scale
      const pulse = 1 + Math.sin(time * 3) * 0.06;
      innerGlowRef.current.scale.y = pulse;
      innerGlowRef.current.scale.z = pulse;
    }

    // Animated pulse ring - expanding outward
    if (pulseRef.current && pulseMaterialRef.current) {
      const pulsePhase = (time * 1.5) % 1;
      const pulseScale = 1 + pulsePhase * 0.8;
      pulseRef.current.scale.set(width, pulseScale, pulseScale);
      pulseRef.current.position.x = THREE.MathUtils.lerp(
        pulseRef.current.position.x,
        centerPos,
        lerpFactor
      );

      const pulseOpacity = visible ? (1 - pulsePhase) * 0.06 : 0;
      pulseMaterialRef.current.opacity = Math.max(0, pulseOpacity);
    }

    // Ground glow - subtle reflection effect
    if (groundGlowRef.current && groundMaterialRef.current) {
      const targetOpacity = visible ? 0.05 + Math.sin(time * 2) * 0.02 : 0;
      groundMaterialRef.current.opacity = THREE.MathUtils.lerp(
        groundMaterialRef.current.opacity,
        targetOpacity,
        lerpFactor
      );
      groundGlowRef.current.position.x = THREE.MathUtils.lerp(
        groundGlowRef.current.position.x,
        centerPos,
        lerpFactor
      );
      groundGlowRef.current.scale.x = THREE.MathUtils.lerp(
        groundGlowRef.current.scale.x,
        width + 0.5,
        lerpFactor
      );
    }
  });

  return (
    <group>
      {/* Outer glow - soft backdrop plane */}
      <mesh ref={outerGlowRef} position={[centerPos, 0.15, -0.3]}>
        <planeGeometry args={[1, 1.4]} />
        <meshBasicMaterial
          ref={outerMaterialRef}
          color={COLORS.glowColor}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow cylinder - wraps around rod selection */}
      <mesh
        ref={innerGlowRef}
        position={[centerPos, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[ROD_RADIUS * 4, ROD_RADIUS * 4, 1, 32, 1, true]} />
        <meshBasicMaterial
          ref={innerMaterialRef}
          color={COLORS.glowColor}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Pulsing expansion ring */}
      <mesh
        ref={pulseRef}
        position={[centerPos, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[ROD_RADIUS * 3.5, ROD_RADIUS * 3.5, 1, 24, 1, true]} />
        <meshBasicMaterial
          ref={pulseMaterialRef}
          color={COLORS.glowColor}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ground reflection glow */}
      <mesh
        ref={groundGlowRef}
        position={[centerPos, -0.4, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1, 0.8]} />
        <meshBasicMaterial
          ref={groundMaterialRef}
          color={COLORS.glowColor}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

SelectionGlow.displayName = 'SelectionGlow';
