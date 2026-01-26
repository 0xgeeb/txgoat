'use client';

import { useRef, useState, useCallback } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Vector2, Vector3, Raycaster, Plane } from 'three';
import { Rod } from './Rod';
import { Blade } from './Blade';
import { Tooltip3D } from './Tooltip3D';
import { SelectionHandle } from './SelectionHandle';
import { ROD_LENGTH, COLORS } from './constants';
import {
  generateMarkers,
  positionToPercent,
  percentToPosition,
  formatDateForZoom,
  positionToDate,
} from './utils';
import type { ViewState, TimeRange } from './types';

interface SceneProps {
  viewState: ViewState;
  onSelectionChange: (range: TimeRange | null) => void;
  clearTrigger: number; // Increment this to clear the selection
}

export function Scene({ viewState, onSelectionChange, clearTrigger }: SceneProps) {
  const { camera, gl } = useThree();

  // Selection state
  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState<{ startPercent: number; endPercent: number } | null>(null);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [activeHandle, setActiveHandle] = useState<'start' | 'end' | null>(null);
  const lastClearTrigger = useRef(clearTrigger);

  // Clear selection when clearTrigger changes
  if (clearTrigger !== lastClearTrigger.current) {
    lastClearTrigger.current = clearTrigger;
    if (selection !== null) {
      setSelection(null);
    }
  }

  const dragStartRef = useRef<number | null>(null);
  const raycaster = useRef(new Raycaster());
  const plane = useRef(new Plane(new Vector3(0, 0, 1), 0));
  const mouse = useRef(new Vector2());

  // Generate markers based on current view
  const markers = generateMarkers(viewState, selection, hoveredMarkerIndex);

  // Get position on rod from mouse event
  const getPositionFromMouse = useCallback((clientX: number, clientY: number): number | null => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);

    const intersectPoint = new Vector3();
    const intersected = raycaster.current.ray.intersectPlane(plane.current, intersectPoint);

    if (intersected) {
      // Clamp to rod bounds
      const pos = Math.max(-ROD_LENGTH / 2, Math.min(ROD_LENGTH / 2, intersectPoint.x));
      return pos;
    }
    return null;
  }, [camera, gl]);

  // Mouse handlers
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    const pos = getPositionFromMouse(e.clientX, e.clientY);
    if (pos !== null) {
      setIsDragging(true);
      dragStartRef.current = pos;
      const percent = positionToPercent(pos);
      setSelection({ startPercent: percent, endPercent: percent });
      setActiveHandle(null);
    }
  }, [getPositionFromMouse]);

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    const pos = getPositionFromMouse(e.clientX, e.clientY);

    if (pos !== null) {
      setHoverPosition(pos);

      if (isDragging && dragStartRef.current !== null) {
        const startPercent = positionToPercent(dragStartRef.current);
        const endPercent = positionToPercent(pos);
        setSelection({ startPercent, endPercent });
      }
    }
  }, [getPositionFromMouse, isDragging]);

  const handlePointerUp = useCallback(() => {
    if (isDragging && selection) {
      const minPercent = Math.min(selection.startPercent, selection.endPercent);
      const maxPercent = Math.max(selection.startPercent, selection.endPercent);

      // If selection is meaningful (more than 2% of the rod)
      if (maxPercent - minPercent > 2) {
        const startDate = positionToDate(
          percentToPosition(minPercent),
          viewState.viewStart,
          viewState.viewEnd
        );
        const endDate = positionToDate(
          percentToPosition(maxPercent),
          viewState.viewStart,
          viewState.viewEnd
        );

        onSelectionChange({ start: startDate, end: endDate });
      } else {
        // Clear selection if too small
        setSelection(null);
        onSelectionChange(null);
      }
    }

    setIsDragging(false);
    setActiveHandle(null);
    dragStartRef.current = null;
  }, [isDragging, selection, viewState, onSelectionChange]);

  const handlePointerLeave = useCallback(() => {
    setHoverPosition(null);
    setHoveredMarkerIndex(null);
  }, []);

  // Compute hover date for tooltip
  const hoverDate = hoverPosition !== null
    ? positionToDate(hoverPosition, viewState.viewStart, viewState.viewEnd)
    : null;

  // Calculate handle positions
  const startHandlePos = selection ? percentToPosition(Math.min(selection.startPercent, selection.endPercent)) : 0;
  const endHandlePos = selection ? percentToPosition(Math.max(selection.startPercent, selection.endPercent)) : 0;
  const showHandles = selection && Math.abs(selection.endPercent - selection.startPercent) > 2 && !isDragging;

  return (
    <group>
      {/* Lighting - more dramatic setup */}
      <ambientLight intensity={0.4} color={COLORS.ambient} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-3, 4, 8]}
        intensity={0.4}
        color="#ffffff"
      />
      {/* Subtle rim light from below */}
      <directionalLight
        position={[0, -5, 3]}
        intensity={0.2}
        color={COLORS.cream}
      />

      {/* Interactive plane for mouse events */}
      <mesh
        position={[0, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[ROD_LENGTH + 2, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* The rod */}
      <Rod />

      {/* Blades (time markers) */}
      {markers.map((marker) => (
        <Blade
          key={marker.id}
          position={marker.position}
          isSelected={marker.isSelected}
          isHovered={marker.isHovered}
        />
      ))}

      {/* Selection handles */}
      {showHandles && (
        <>
          <SelectionHandle
            position={startHandlePos}
            isActive={activeHandle === 'start'}
            side="start"
          />
          <SelectionHandle
            position={endHandlePos}
            isActive={activeHandle === 'end'}
            side="end"
          />
        </>
      )}

      {/* Tooltip */}
      {hoverDate && hoverPosition !== null && !isDragging && (
        <Tooltip3D
          position={[hoverPosition, 0.6, 0]}
          visible={true}
          dateLabel={formatDateForZoom(hoverDate, viewState.zoomLevel)}
        />
      )}
    </group>
  );
}

Scene.displayName = 'Scene';
