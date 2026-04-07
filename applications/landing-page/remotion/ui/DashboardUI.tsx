import { COLORS, FONTS, GRADIENT } from '../lib/brand';

const projects = [
  { name: 'Batoul Collection', count: 24, color: COLORS.blue },
  { name: 'Riad SS26', count: 18, color: COLORS.purple },
  { name: 'Medina Nights', count: 31, color: COLORS.blueLight },
];

export function DashboardUI({ scale = 1 }: { scale?: number }) {
  return (
    <div
      style={{
        width: 900,
        height: 560,
        background: COLORS.bgSurface,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        display: 'flex',
        flexDirection: 'row',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        fontFamily: FONTS.body,
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          background: COLORS.bg,
          borderRight: `1px solid ${COLORS.border}`,
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 20,
              fontWeight: 700,
              background: GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.1em',
            }}
          >
            ANAQIO
          </div>
          <div
            style={{
              fontSize: 10,
              color: COLORS.muted,
              letterSpacing: '0.12em',
              marginTop: 2,
            }}
          >
            AI VIRTUAL STUDIO
          </div>
        </div>
        {['Dashboard', 'Projects', 'Library', 'Settings'].map((item, i) => (
          <div
            key={item}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 13,
              color: i === 0 ? COLORS.text : COLORS.muted,
              background: i === 0 ? `${COLORS.blue}20` : 'transparent',
              border:
                i === 0
                  ? `1px solid ${COLORS.blue}40`
                  : '1px solid transparent',
              cursor: 'pointer',
            }}
          >
            {item}
          </div>
        ))}
        {/* Usage badge */}
        <div
          style={{
            marginTop: 'auto',
            padding: '12px',
            background: COLORS.bgCard,
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 6 }}>
            Credits Used
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
              style={{ width: '62%', height: '100%', background: GRADIENT }}
            />
          </div>
          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4 }}>
            62 / 100
          </div>
        </div>
      </div>
      {/* Main content */}
      <div style={{ flex: 1, padding: 28 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.text }}>
              Dashboard
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
              Welcome back, Nour
            </div>
          </div>
          <div
            style={{
              padding: '8px 18px',
              background: GRADIENT,
              borderRadius: 8,
              fontSize: 13,
              color: COLORS.white,
              fontWeight: 600,
            }}
          >
            + New Project
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Outputs', value: '73' },
            { label: 'This Week', value: '12' },
            { label: 'Exports', value: '38' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: '14px 16px',
              }}
            >
              <div
                style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}
              >
                {value}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        {/* Recent projects */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: COLORS.muted,
            marginBottom: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Recent Projects
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {projects.map((p) => (
            <div
              key={p.name}
              style={{
                width: 180,
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: 110,
                  background: `linear-gradient(135deg, ${p.color}30, ${COLORS.bg})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 60 80" width={48} height={64} fill="none">
                  <path
                    d="M20 18L16 24L8 28L12 32L14 60L46 60L48 32L52 28L44 24L40 18Q30 24 20 18Z"
                    fill={`${p.color}50`}
                    stroke={p.color}
                    strokeWidth="1.2"
                  />
                </svg>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div
                  style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}
                >
                  {p.name}
                </div>
                <div
                  style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}
                >
                  {p.count} outputs
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
