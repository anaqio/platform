// Core types for multi-step waitlist form

export interface SelectOption {
  value: string
  label: string
}

export interface FormField {
  name: string
  type: 'text' | 'email' | 'select'
  label: string
  placeholder?: string
  required: boolean
  options?: SelectOption[]
}

export interface FormStep {
  id: number
  title: string
  description: string
  fields: FormField[]
}

export interface FormState {
  currentStep: number
  totalSteps: number
  formData: Record<string, string>
  errors: Record<string, string>
  touched: Record<string, boolean>
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface WaitlistFormProps {
  source: string
  variant?: 'simple' | 'full'
  className?: string
}

export interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  onStepClick?: (step: number) => void
}

export interface FormStepProps {
  step: FormStep
  formData: Record<string, string>
  errors: Record<string, string>
  onChange: (name: string, value: string) => void
  onBlur: (name: string) => void
  disabled: boolean
}

// Step configurations for full variant (3 steps)
export const FULL_VARIANT_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Identity',
    description: "Let's start with the basics",
    fields: [
      {
        name: 'full_name',
        type: 'text',
        label: 'Name',
        placeholder: 'Your name',
        required: true,
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'professional@email.com',
        required: true,
      },
    ],
  },
  {
    id: 2,
    title: 'Profile',
    description: 'Tell us about yourself',
    fields: [
      {
        name: 'role',
        type: 'select',
        label: 'What Best Describes You?',
        placeholder: 'Select your role',
        required: true,
        options: [
          { value: 'Brand', label: 'Fashion Brand / Retailer' },
          { value: 'Stylist', label: 'Stylist / Creative' },
          { value: 'Seller', label: 'E-Commerce Seller' },
          { value: 'Other', label: 'Other' },
        ],
      },
      {
        name: 'company',
        type: 'text',
        label: 'Company (Optional)',
        placeholder: 'Brand or Studio name',
        required: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Preferences',
    description: 'Help us personalize your experience',
    fields: [
      {
        name: 'revenue_range',
        type: 'select',
        label: 'Revenue (Optional)',
        placeholder: 'Monthly Revenue Range',
        required: false,
        options: [
          { value: '0-10k', label: '0 - 10k DH' },
          { value: '10k-50k', label: '10k - 50k DH' },
          { value: '50k-250k', label: '50k - 250k DH' },
          { value: '250k+', label: '250k DH+' },
        ],
      },
      {
        name: 'aesthetic',
        type: 'select',
        label: 'Desired Aesthetic (Optional)',
        placeholder: 'Select Aesthetic Preference',
        required: false,
        options: [
          { value: 'Modern Minimalist', label: 'Modern Minimalist' },
          { value: 'Traditional Moroccan', label: 'Traditional Moroccan' },
          { value: 'Luxury Editorial', label: 'Luxury Editorial' },
          { value: 'Streetwear', label: 'Streetwear' },
          { value: 'Avant-Garde', label: 'Avant-Garde' },
        ],
      },
    ],
  },
]

// Step configuration for simple variant (1 step)
export const SIMPLE_VARIANT_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Join Waitlist',
    description: 'Get early access',
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'professional@email.com',
        required: true,
      },
    ],
  },
]
