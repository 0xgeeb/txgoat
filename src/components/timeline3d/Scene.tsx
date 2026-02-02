'use client';

import { useRef, useState, useCallback } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Vector2, Vector3, Raycaster, Plane } from 'three';
import { Blade } from './Blade';
import { Tooltip3D } from './Tooltip3D';
import { ROD_LENGTH } from './constants';
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
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
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
  const markers = generateMarkers(viewState, selection, null);

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
    dragStartRef.current = null;
  }, [isDragging, selection, viewState, onSelectionChange]);

  const handlePointerLeave = useCallback(() => {
    setHoverPosition(null);
    // Cancel any in-progress selection when mouse leaves
    if (isDragging) {
      setIsDragging(false);
      setSelection(null);
      dragStartRef.current = null;
      onSelectionChange(null);
    }
  }, [isDragging, onSelectionChange]);

  // Compute hover date for tooltip
  const hoverDate = hoverPosition !== null
    ? positionToDate(hoverPosition, viewState.viewStart, viewState.viewEnd)
    : null;

  // Check if hovering over raised bars (within selection) or dragging
  const hoverPercent = hoverPosition !== null ? positionToPercent(hoverPosition) : null;
  const isOverRaisedBars = isDragging || (selection && hoverPercent !== null &&
    hoverPercent >= Math.min(selection.startPercent, selection.endPercent) &&
    hoverPercent <= Math.max(selection.startPercent, selection.endPercent));
  const tooltipY = isOverRaisedBars ? 0.9 : 0.5;

  // Calculate blade width - touching with tiny gap for edge visibility
  const bladeWidth = (ROD_LENGTH / markers.length) * 0.98;

  return (
    <group>
      {/* Simple lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <directionalLight position={[-5, 5, 5]} intensity={0.3} />

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

      {/* Blades (time markers) */}
      {markers.map((marker) => (
        <Blade
          key={marker.id}
          position={marker.position}
          width={bladeWidth}
          isSelected={marker.isSelected}
          isHovered={marker.isHovered}
        />
      ))}

      {/* Tooltip */}
      {hoverDate && hoverPosition !== null && (
        <Tooltip3D
          position={[hoverPosition, tooltipY, 0]}
          visible={true}
          dateLabel={formatDateForZoom(hoverDate, viewState.zoomLevel)}
        />
      )}
    </group>
  );
}

Scene.displayName = 'Scene';
