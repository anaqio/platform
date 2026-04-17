'use client'

import React from 'react'

// Blob configuration: position offset %, size, color, drift speed, parallax factor
const BLOBS = [
  {
    id: 0,
    x: 1,
    y: 1.618,
    size: 420,
    color: '#2563EB',
    driftDur: 22,
    parallax: 0.04,
  },
  {
    id: 1,
    x: 70,
    y: 15,
    size: 380,
    color: '#7C3AED',
    driftDur: 28,
    parallax: 0.03,
  },
  {
    id: 2,
    x: 40,
    y: 60,
    size: 350,
    color: '#3F57AF',
    driftDur: 25,
    parallax: 0.05,
  },
  {
    id: 3,
    x: 80,
    y: 70,
    size: 300,
    color: '#6049A8',
    driftDur: 30,
    parallax: 0.02,
  },
  {
    id: 4,
    x: 25,
    y: 80,
    size: 280,
    color: '#6F47A7',
    driftDur: 26,
    parallax: 0.035,
  },
  {
    id: 5,
    x: 55,
    y: 35,
    size: 320,
    color: '#2563EB',
    driftDur: 24,
    parallax: 0.045,
  },
] as const

interface AbstractBlobsProps {
  scrollMorph?: boolean
}

/**
 * AbstractBlobs component — The large, blurred background drifts.
 * Supports scroll-triggered morphing and mouse/gyro parallax via CSS vars.
 */
export const AbstractBlobs: React.FC<AbstractBlobsProps> = ({ scrollMorph = false }) => {
  return (
    <div className="gravitate pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          filter: 'blur(80px)',
          rotate: '0.01deg',
          willChange: 'transform',
        }}
      >
        {BLOBS.map((blob) => (
          <div
            key={blob.id}
            className={`abstract-blob ${scrollMorph ? 'abstract-blob--morphed' : ''}`}
            style={
              {
                '--blob-x': `${blob.x}%`,
                '--blob-y': `${blob.y}%`,
                '--blob-size': `${blob.size}px`,
                '--blob-color': blob.color,
                '--blob-drift-dur': `${blob.driftDur}s`,
                '--blob-parallax': blob.parallax,
                animationDelay: `${-blob.id * 3.5}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
