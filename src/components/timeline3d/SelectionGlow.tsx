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

  const minPercent = Math.min(startPercent, endPercent);
  const maxPercent = Math.max(startPercent, endPercent);

  const startPos = percentToPosition(minPercent);
  const endPos = percentToPosition(maxPercent);
  const width = Math.max(0.01, endPos - startPos);
  const centerPos = (startPos + endPos) / 2;

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const lerpFactor = 1 - Math.exp(-6 * delta);

    // Outer glow - backdrop
    if (outerGlowRef.current && outerMaterialRef.current) {
      const targetOpacity = visible ? 0.12 : 0;
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
        width,
        lerpFactor
      );
    }

    // Inner glow cylinder - wraps around rod
    if (innerGlowRef.current && innerMaterialRef.current) {
      const targetOpacity = visible ? 0.15 : 0;
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
      const pulse = 1 + Math.sin(time * 3) * 0.08;
      innerGlowRef.current.scale.y = pulse;
      innerGlowRef.current.scale.z = pulse;
    }

    // Animated pulse ring
    if (pulseRef.current && pulseMaterialRef.current) {
      const pulseScale = 1 + (Math.sin(time * 4) * 0.5 + 0.5) * 0.5;
      pulseRef.current.scale.set(width * pulseScale, pulseScale, pulseScale);
      pulseRef.current.position.x = centerPos;

      const pulseOpacity = visible ? (1 - (pulseScale - 1) / 0.5) * 0.1 : 0;
      pulseMaterialRef.current.opacity = Math.max(0, pulseOpacity);
    }
  });

  return (
    <group>
      {/* Outer glow - soft backdrop plane */}
      <mesh ref={outerGlowRef} position={[centerPos, 0, -0.2]}>
        <planeGeometry args={[1, 1.2]} />
        <meshBasicMaterial
          ref={outerMaterialRef}
          color={COLORS.charcoal}
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
        <cylinderGeometry args={[ROD_RADIUS * 3, ROD_RADIUS * 3, 1, 24, 1, true]} />
        <meshBasicMaterial
          ref={innerMaterialRef}
          color={COLORS.charcoalLight}
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
        <cylinderGeometry args={[ROD_RADIUS * 2.5, ROD_RADIUS * 2.5, 1, 16, 1, true]} />
        <meshBasicMaterial
          ref={pulseMaterialRef}
          color={COLORS.border}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

SelectionGlow.displayName = 'SelectionGlow';
