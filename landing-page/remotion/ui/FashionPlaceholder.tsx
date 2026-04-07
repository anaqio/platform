import { COLORS } from '../lib/brand';

// Stylized fashion silhouette as SVG — avoids needing real images
export function FashionPlaceholder({
  width = 200,
  height = 280,
  style = 0,
  color: _color = COLORS.blue,
}: {
  width?: number;
  height?: number;
  style?: 0 | 1 | 2 | 3;
  color?: string;
}) {
  const fills = [
    { bg: '#1e293b', accent: COLORS.blue },
    { bg: '#1e293b', accent: COLORS.purple },
    { bg: '#1e293b', accent: COLORS.blueLight },
    { bg: '#1e293b', accent: COLORS.purpleLight },
  ];
  const { bg, accent } = fills[style];

  return (
    <div
      style={{
        width,
        height,
        background: bg,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${accent}30 0%, transparent 70%)`,
        }}
      />
      {/* Fashion garment silhouette (SVG) */}
      <svg
        viewBox="0 0 200 280"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        fill="none"
      >
        {/* Dress/garment body */}
        <path
          d="M70 60 L60 80 L40 90 L50 100 L55 200 L145 200 L150 100 L160 90 L140 80 L130 60 Q100 75 70 60Z"
          fill={`${accent}50`}
          stroke={`${accent}80`}
          strokeWidth="1.5"
        />
        {/* Neckline */}
        <path
          d="M70 60 Q100 50 130 60"
          fill="none"
          stroke={`${accent}`}
          strokeWidth="1.5"
        />
        {/* Sleeve left */}
        <path
          d="M60 80 L35 110 L50 115 L55 100 L60 90Z"
          fill={`${accent}40`}
          stroke={`${accent}80`}
          strokeWidth="1"
        />
        {/* Sleeve right */}
        <path
          d="M140 80 L165 110 L150 115 L145 100 L140 90Z"
          fill={`${accent}40`}
          stroke={`${accent}80`}
          strokeWidth="1"
        />
        {/* Highlight */}
        <path
          d="M80 90 Q90 120 85 180"
          fill="none"
          stroke={`${accent}`}
          strokeWidth="0.8"
          opacity={0.5}
        />
        {/* Label/tag detail */}
        <rect
          x="93"
          y="198"
          width="14"
          height="10"
          rx="1"
          fill={`${accent}60`}
          stroke={`${accent}`}
          strokeWidth="0.8"
        />
      </svg>
      {/* "Studio generated" badge for results screens */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          background: `${accent}22`,
          border: `1px solid ${accent}44`,
          borderRadius: 4,
          padding: '2px 6px',
          fontSize: 9,
          color: accent,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}
      >
        AI Generated
      </div>
    </div>
  );
}

// Before image (plain white bg studio product photo simulation)
export function ProductOnWhite({
  width = 200,
  height = 280,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        background: '#F1F5F9',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        border: `1px solid #E2E8F0`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox="0 0 200 280"
        style={{ width: '75%', height: '75%' }}
        fill="none"
      >
        <path
          d="M70 60 L60 80 L40 90 L50 100 L55 200 L145 200 L150 100 L160 90 L140 80 L130 60 Q100 75 70 60Z"
          fill="#94A3B8"
          stroke="#64748B"
          strokeWidth="1.5"
        />
        <path
          d="M70 60 Q100 50 130 60"
          fill="none"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <path
          d="M60 80 L35 110 L50 115 L55 100 L60 90Z"
          fill="#94A3B8"
          stroke="#64748B"
          strokeWidth="1"
        />
        <path
          d="M140 80 L165 110 L150 115 L145 100 L140 90Z"
          fill="#94A3B8"
          stroke="#64748B"
          strokeWidth="1"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          fontSize: 9,
          color: '#94A3B8',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        Original upload
      </div>
    </div>
  );
}
