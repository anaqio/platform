// Static (non-translatable) configuration for the atelier invitation form.
// Text content (questions, hints, labels) lives in messages/*.json under
// the `atelierInvitation` namespace.

export type AtelierIconName = 'Mail' | 'Building2' | 'Phone' | 'User' | 'TrendingUp' | 'Compass'

export type AtelierFieldType = 'email' | 'tel' | 'text' | 'select'

export interface AtelierStepConfig {
  /** Matches both the form field name and the translation key under `steps.*` */
  id: string
  iconName: AtelierIconName
  type: AtelierFieldType
  required: boolean
  /** Stable option values sent to the server — labels come from translations */
  optionValues?: string[]
}

export const ATELIER_STEP_CONFIGS: AtelierStepConfig[] = [
  { id: 'email', iconName: 'Mail', type: 'email', required: true },
  { id: 'entity_name', iconName: 'Building2', type: 'text', required: true },
  { id: 'whatsapp', iconName: 'Phone', type: 'tel', required: false },
  {
    id: 'role',
    iconName: 'User',
    type: 'select',
    required: true,
    optionValues: ['Brand', 'Designer', 'Stylist', 'Ecommerce', 'Photographer', 'Other'],
  },
  {
    id: 'revenue_range',
    iconName: 'TrendingUp',
    type: 'select',
    required: false,
    optionValues: ['pre-revenue', '0-10k', '10k-50k', '50k-250k', '250k+'],
  },
  {
    id: 'referral_source',
    iconName: 'Compass',
    type: 'select',
    required: false,
    optionValues: ['Instagram', 'LinkedIn', 'Word of mouth', 'Press / Media', 'Search', 'Other'],
  },
]
