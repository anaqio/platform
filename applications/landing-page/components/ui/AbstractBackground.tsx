'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AbstractBlobs } from './AbstractBlobs';
import { NoisyBackground } from './NoisyBackground';

/**
 * AbstractBackground — CSS-based animated blob system
 *
 * Features:
 * - 6 GPU-composited blobs using transform3d (no canvas, no layout thrash)
 * - Mouse-follow parallax via CSS custom properties
 * - Device gyroscope support (DeviceOrientationEvent)
 * - Scroll-triggered morph (blob shape/scale/opacity transitions)
 * - Noise overlay via SVG feTurbulence
 * - Full prefers-reduced-motion support
 */

const AbstractBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // Normalized [0,1]
  const gyroRef = useRef({ x: 0, y: 0 }); // Degrees mapped to [-1,1]
  const [scrollMorph, setScrollMorph] = useState(false);

  // Reduced motion support
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Use requestAnimationFrame to avoid setState in render
    requestAnimationFrame(() => {
      setReducedMotion(mediaQuery.matches);
    });
    const handleChange = () => {
      requestAnimationFrame(() => {
        setReducedMotion(mediaQuery.matches);
      });
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Throttled mousemove → CSS custom properties
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    };

    if (rafRef.current) return; // Already scheduled

    rafRef.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        const el = containerRef.current;
        el.style.setProperty('--mouse-x', String(mouseRef.current.x));
        el.style.setProperty('--mouse-y', String(mouseRef.current.y));
        // Gravitate offsets in normalized [-1,1]
        const gx = mouseRef.current.x * 2 - 1;
        const gy = mouseRef.current.y * 2 - 1;
        el.style.setProperty('--grav-x', String(gx));
        el.style.setProperty('--grav-y', String(gy));
        // Blend gyro when available
        el.style.setProperty('--gyro-x', String(gyroRef.current.x));
        el.style.setProperty('--gyro-y', String(gyroRef.current.y));
      }
      rafRef.current = 0;
    });
  }, []);

  // Device orientation → gyro CSS vars
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const gamma = e.gamma ?? 0; // left-right tilt [-90,90]
    const beta = e.beta ?? 0; // front-back tilt [-180,180]
    gyroRef.current = {
      x: Math.max(-1, Math.min(1, gamma / 45)), // Normalize to [-1,1]
      y: Math.max(-1, Math.min(1, (beta - 45) / 45)),
    };
  }, []);

  // Scroll-triggered morph
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    // Morph blobs once scrolled past first viewport
    setScrollMorph(scrollTop > window.innerHeight * 0.4);
  }, []);

  useEffect(() => {
    // Mouse tracking
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Device orientation (gyroscope)
    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation, {
        passive: true,
      });
    }

    // Scroll tracking
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize CSS vars
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', '0.5');
      containerRef.current.style.setProperty('--mouse-y', '0.5');
      containerRef.current.style.setProperty('--grav-x', '0');
      containerRef.current.style.setProperty('--grav-y', '0');
      containerRef.current.style.setProperty('--gyro-x', '0');
      containerRef.current.style.setProperty('--gyro-y', '0');
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleOrientation, handleScroll]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={
        {
          '--mouse-x': '0.5',
          '--mouse-y': '0.5',
          '--grav-x': '0',
          '--grav-y': '0',
          '--gyro-x': '0',
          '--gyro-y': '0',
        } as React.CSSProperties
      }
    >
      {!reducedMotion && (
        <>
          <AbstractBlobs scrollMorph={scrollMorph} />
        </>
      )}
      <NoisyBackground />
    </div>
  );
};

export default AbstractBackground;
