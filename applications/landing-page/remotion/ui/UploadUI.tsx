import { interpolate } from 'remotion'

import { COLORS, FONTS, GRADIENT } from '../lib/brand'

export function UploadUI({ progress = 0, scale = 1 }: { progress?: number; scale?: number }) {
  // progress 0 = empty dropzone, 0.5 = uploading, 1 = complete
  const showFile = progress > 0.2
  const uploadProgress = interpolate(progress, [0.3, 0.9], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const isDone = progress > 0.9

  return (
    <div
      style={{
        width: 740,
        height: 480,
        background: COLORS.bgSurface,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        padding: 32,
        fontFamily: FONTS.body,
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: COLORS.text,
          marginBottom: 6,
        }}
      >
        Upload Product Image
      </div>
      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 24 }}>
        Start by uploading a product photo — garment on any background works.
      </div>

      {!showFile ? (
        /* Drop zone */
        <div
          style={{
            height: 280,
            border: `2px dashed ${COLORS.blue}60`,
            borderRadius: 12,
            background: `${COLORS.blue}08`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          {/* Upload arrow icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: `${COLORS.blue}20`,
              border: `1px solid ${COLORS.blue}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4v12m0-12-4 4m4-4 4 4M4 20h16"
                stroke={COLORS.blue}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.text }}>
              Drag & drop your product image
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
              or click to browse
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.muted,
                marginTop: 8,
                opacity: 0.7,
              }}
            >
              PNG, JPG, WEBP — up to 50MB
            </div>
          </div>
        </div>
      ) : (
        /* File uploading / done state */
        <div
          style={{
            height: 280,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            background: COLORS.bgCard,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* File thumbnail */}
            <div
              style={{
                width: 80,
                height: 100,
                background: '#1e293b',
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 60 80" width={44} height={58} fill="none">
                <path
                  d="M18 16L14 22L7 26L11 30L13 58L47 58L49 30L53 26L46 22L42 16Q30 22 18 16Z"
                  fill={`${COLORS.blue}50`}
                  stroke={COLORS.blue}
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>
                robe-kaftane-marrakech.jpg
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                4.2 MB · 2400 × 3200px
              </div>
              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontSize: 11, color: COLORS.muted }}>
                    {isDone ? 'Ready to generate' : 'Uploading...'}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.blue }}>
                    {Math.round(uploadProgress)}%
                  </div>
                </div>
                <div
                  style={{
                    height: 4,
                    background: COLORS.border,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: isDone ? '#10B981' : GRADIENT,
                      transition: 'width 0.1s ease',
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {isDone && (
            <div
              style={{
                padding: '10px 16px',
                background: `${COLORS.success}15`,
                border: `1px solid ${COLORS.success}40`,
                borderRadius: 8,
                fontSize: 13,
                color: COLORS.success,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#10B981" strokeWidth="1.5" />
                <path
                  d="M5 8l2 2 4-4"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Upload complete — ready to configure your scene
            </div>
          )}
        </div>
      )}

      {isDone && (
        <div
          style={{
            marginTop: 20,
            padding: '12px 24px',
            background: GRADIENT,
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.white,
            textAlign: 'center',
            display: 'inline-block',
          }}
        >
          Continue to Studio →
        </div>
      )}
    </div>
  )
}
