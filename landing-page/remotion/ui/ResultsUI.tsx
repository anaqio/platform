import { interpolate } from 'remotion';

import { FashionPlaceholder } from './FashionPlaceholder';
import { COLORS, FONTS, GRADIENT } from '../lib/brand';

export function ResultsUI({
  revealProgress = 1,
  scale = 1,
}: {
  revealProgress?: number;
  scale?: number;
}) {
  const outputs = [
    { label: 'Studio White', style: 0 as const },
    { label: 'Moroccan Riad', style: 1 as const },
    { label: 'Golden Hour', style: 2 as const },
    { label: 'Dark Editorial', style: 3 as const },
  ];

  return (
    <div
      style={{
        width: 920,
        height: 560,
        background: COLORS.bgSurface,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        padding: 28,
        fontFamily: FONTS.body,
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.text }}>
            Generated Outputs
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
            4 variations · Studio White, Moroccan Riad, Golden Hour, Dark
            Editorial
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              padding: '8px 16px',
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              fontSize: 13,
              color: COLORS.text,
            }}
          >
            Select All
          </div>
          <div
            style={{
              padding: '8px 18px',
              background: GRADIENT,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.white,
              boxShadow: `0 4px 16px ${COLORS.blue}40`,
            }}
          >
            Export All →
          </div>
        </div>
      </div>

      {/* Output grid */}
      <div style={{ display: 'flex', gap: 16 }}>
        {outputs.map(({ label, style }, i) => {
          const cardReveal = interpolate(
            revealProgress,
            [i * 0.18, i * 0.18 + 0.4],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );
          return (
            <div
              key={label}
              style={{
                flex: 1,
                opacity: cardReveal,
                transform: `translateY(${interpolate(cardReveal, [0, 1], [24, 0])}px)`,
              }}
            >
              <div
                style={{
                  background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <FashionPlaceholder width={192} height={220} style={style} />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.muted,
                  textAlign: 'center',
                  marginTop: 6,
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
