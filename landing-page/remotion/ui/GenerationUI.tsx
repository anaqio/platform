import { interpolate } from 'remotion';

import { COLORS, FONTS, GRADIENT } from '../lib/brand';

const BACKGROUNDS = [
  'Studio White',
  'Moroccan Riad',
  'Paris Rooftop',
  'Dark Editorial',
  'Natural Outdoor',
];
const LIGHTING = [
  'Natural Soft',
  'Studio Flash',
  'Golden Hour',
  'Dramatic Spot',
];
const STYLES = ['Editorial', 'E-commerce Clean', 'Lookbook', 'Cinematic'];

export function GenerationUI({
  generationProgress = 0,
  scale = 1,
}: {
  generationProgress?: number;
  scale?: number;
}) {
  const isGenerating = generationProgress > 0;
  const progressPct = interpolate(generationProgress, [0, 1], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isDone = generationProgress >= 1;

  return (
    <div
      style={{
        width: 920,
        height: 560,
        background: COLORS.bgSurface,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        display: 'flex',
        fontFamily: FONTS.body,
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Left — source image */}
      <div
        style={{
          width: 280,
          background: COLORS.bg,
          borderRight: `1px solid ${COLORS.border}`,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.muted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Source Image
        </div>
        <div
          style={{
            flex: 1,
            background: '#0f172a',
            borderRadius: 10,
            border: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 240,
          }}
        >
          <svg viewBox="0 0 100 140" width={80} height={112} fill="none">
            <path
              d="M32 28L26 40L14 48L22 56L26 112L74 112L78 56L86 48L74 40L68 28Q50 38 32 28Z"
              fill="#94A3B820"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
            <path
              d="M32 28Q50 22 68 28"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
            <path
              d="M26 40L10 60L22 64L26 56L28 48Z"
              fill="#94A3B815"
              stroke="#94A3B840"
              strokeWidth="1"
            />
            <path
              d="M74 40L90 60L78 64L74 56L72 48Z"
              fill="#94A3B815"
              stroke="#94A3B840"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div style={{ fontSize: 11, color: COLORS.muted, textAlign: 'center' }}>
          robe-kaftane-marrakech.jpg
        </div>
      </div>

      {/* Right — settings + generation */}
      <div
        style={{
          flex: 1,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.text }}>
          Scene Configuration
        </div>

        {/* Settings grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        >
          {[
            { label: 'Background', options: BACKGROUNDS, selected: 0 },
            { label: 'Lighting', options: LIGHTING, selected: 0 },
            { label: 'Style', options: STYLES, selected: 0 },
            {
              label: 'Outputs',
              options: ['1', '2', '4', '6', '8'],
              selected: 2,
            },
          ].map(({ label, options, selected }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: COLORS.muted,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  padding: '9px 12px',
                  background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  fontSize: 13,
                  color: COLORS.text,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {options[selected]}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4.5l3 3 3-3"
                    stroke={COLORS.muted}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Generate button + progress */}
        <div style={{ marginTop: 'auto' }}>
          {!isGenerating ? (
            <div
              style={{
                padding: '14px 28px',
                background: GRADIENT,
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                color: COLORS.white,
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: `0 8px 30px ${COLORS.blue}40`,
              }}
            >
              ✦ Generate with AI
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}
                >
                  {isDone ? '✓ Generation Complete' : 'Generating 4 outputs...'}
                </div>
                <div style={{ fontSize: 13, color: COLORS.blue }}>
                  {Math.round(progressPct)}%
                </div>
              </div>
              <div
                style={{
                  height: 6,
                  background: COLORS.bgCard,
                  borderRadius: 3,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    background: isDone ? '#10B981' : GRADIENT,
                    borderRadius: 3,
                    boxShadow: isDone ? 'none' : `0 0 12px ${COLORS.blue}60`,
                  }}
                />
              </div>
              {!isDone && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    'Removing background',
                    'Rendering scene',
                    'Adjusting lighting',
                    'Final compositing',
                  ].map((step, i) => (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        background:
                          progressPct > i * 25 + 10
                            ? `${COLORS.blue}20`
                            : COLORS.bgCard,
                        border: `1px solid ${progressPct > i * 25 + 10 ? COLORS.blue + '40' : COLORS.border}`,
                        borderRadius: 6,
                        fontSize: 9,
                        color:
                          progressPct > i * 25 + 10
                            ? COLORS.blueLight
                            : COLORS.muted,
                        textAlign: 'center',
                      }}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
