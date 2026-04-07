export const COLORS = {
  bg: '#030712',
  bgSurface: '#0f172a',
  bgCard: '#1e293b',
  border: '#334155',
  blue: '#2563EB',
  purple: '#7C3AED',
  blueLight: '#3B82F6',
  purpleLight: '#8B5CF6',
  text: '#F8FAFC',
  muted: '#94A3B8',
  mutedLight: '#CBD5E1',
  success: '#10B981',
  white: '#FFFFFF',
} as const;

export const GRADIENT = `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.purple})`;
export const GRADIENT_SUBTLE = `linear-gradient(135deg, ${COLORS.blue}22, ${COLORS.purple}22)`;

export const FONTS = {
  display: '"Cormorant Garamond", Georgia, serif',
  body: '"DM Sans", system-ui, sans-serif',
} as const;
