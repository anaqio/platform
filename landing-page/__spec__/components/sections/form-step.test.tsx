import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { FormStep as FormStepType } from '@/lib/types/waitlist-form';

import { FormStep } from '@/components/sections/form-step';

const textStep: FormStepType = {
  id: 1,
  title: 'Step',
  description: 'desc',
  fields: [
    {
      name: 'full_name',
      type: 'text',
      label: 'Name',
      placeholder: 'Your name',
      required: true,
    },
  ],
};

const emailStep: FormStepType = {
  id: 1,
  title: 'Step',
  description: 'desc',
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'you@example.com',
      required: true,
    },
  ],
};

const selectStep: FormStepType = {
  id: 2,
  title: 'Step',
  description: 'desc',
  fields: [
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      placeholder: 'Pick one',
      required: true,
      options: [
        { value: 'Brand', label: 'Fashion Brand' },
        { value: 'Stylist', label: 'Stylist' },
      ],
    },
  ],
};

const baseProps = {
  formData: {},
  errors: {},
  onChange: vi.fn(),
  onBlur: vi.fn(),
  disabled: false,
};

describe('FormStep', () => {
  it('renders text input for field.type === "text"', () => {
    render(<FormStep step={textStep} {...baseProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('renders email input for field.type === "email"', () => {
    render(<FormStep step={emailStep} {...baseProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders select for field.type === "select"', () => {
    render(<FormStep step={selectStep} {...baseProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('passes correct options to select field', () => {
    render(<FormStep step={selectStep} {...baseProps} />);
    // placeholder option + 2 real options = 3
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(
      screen.getByRole('option', { name: 'Fashion Brand' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Stylist' })).toBeInTheDocument();
  });

  it('calls onChange with field name and new value on input change', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<FormStep step={textStep} {...baseProps} onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'A');
    expect(onChange).toHaveBeenCalledWith('full_name', expect.any(String));
  });

  it('calls onBlur with field name on blur', async () => {
    const onBlur = vi.fn();
    const user = userEvent.setup();
    render(<FormStep step={textStep} {...baseProps} onBlur={onBlur} />);
    await user.click(screen.getByRole('textbox'));
    await user.tab();
    expect(onBlur).toHaveBeenCalledWith('full_name');
  });

  it('displays error message when error prop is set', () => {
    render(
      <FormStep
        step={textStep}
        {...baseProps}
        errors={{ full_name: 'Name is required' }}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
  });

  it('does not display error message when errors is empty', () => {
    render(<FormStep step={textStep} {...baseProps} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('all inputs are disabled when disabled prop is true', () => {
    render(<FormStep step={textStep} {...baseProps} disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
