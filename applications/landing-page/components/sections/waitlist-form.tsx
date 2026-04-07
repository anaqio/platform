'use client';

import { motion } from 'framer-motion';
import { useState, useTransition, useMemo } from 'react';

import { FormStep } from '@/components/sections/form-step';
import { StepTransition } from '@/components/sections/step-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { useMultiStepForm } from '@/hooks/use-multi-step-form';
import { joinWaitlist } from '@/lib/actions/waitlist';
import { trackUserBehavior } from '@/lib/analytics';
import { FULL_VARIANT_STEPS } from '@/lib/types/waitlist-form';
import { cn } from '@/lib/utils';
import { sanitizeEmail } from '@/lib/utils/form-validation';

interface WaitlistFormProps {
  source: string;
  variant?: 'simple' | 'full';
  className?: string;
}

export function WaitlistForm({
  source,
  variant = 'full',
  className,
}: WaitlistFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Memoize step configurations for performance
  const steps = useMemo(() => FULL_VARIANT_STEPS, []);

  // Multi-step form state (only for full variant)
  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    isAnimating,
    next,
    previous,
    updateField,
    markFieldTouched,
    validateCurrentStep,
    setIsAnimating,
    resetForm,
  } = useMultiStepForm(steps);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rawFormData = new FormData(e.currentTarget);
    const data = Object.fromEntries(rawFormData.entries()) as Record<
      string,
      string
    >;

    startTransition(async () => {
      try {
        const result = await joinWaitlist(rawFormData);
        if (result.success) {
          trackUserBehavior.trackFormSubmit(`waitlist_simple_${source}`, data);
          setStatus('success');
          setMessage(result.message);
          resetForm();
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    });
  };

  // Clear server error when user modifies any field
  const handleFieldChange = (name: string, value: string) => {
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
    updateField(name, value);
  };

  const handleMultiStepSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }

    // If not on final step, advance to next step
    if (currentStep < totalSteps) {
      setDirection('forward');
      setIsAnimating(true);
      setTimeout(() => {
        trackUserBehavior.trackClick(
          `waitlist_next_step_${currentStep}`,
          'form_navigation'
        );
        next();
        setIsAnimating(false);
      }, 400);
      return;
    }

    // Final step - submit form
    const submitFormData = new FormData();
    submitFormData.append('source', source);

    // Add all form data with email sanitization
    // Optimization: Directly handle email and use a standard for loop for other fields
    submitFormData.append('email', sanitizeEmail(formData.email || ''));

    const formKeys = Object.keys(formData);
    const formKeysLen = formKeys.length;
    for (let i = 0; i < formKeysLen; i++) {
      const key = formKeys[i];
      if (key !== 'email') {
        submitFormData.append(key, formData[key as keyof typeof formData]);
      }
    }

    startTransition(async () => {
      try {
        const result = await joinWaitlist(submitFormData);
        if (result.success) {
          trackUserBehavior.trackFormSubmit(`waitlist_full_${source}`, {
            ...formData,
            source,
          });
          setStatus('success');
          setMessage(result.message);
          resetForm();
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    });
  };

  const handlePrevious = () => {
    setDirection('backward');
    setIsAnimating(true);
    setTimeout(() => {
      previous();
      setIsAnimating(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Handle Enter key to submit/continue
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      const form = e.currentTarget;
      const submitButton = form.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      submitButton?.click();
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4 py-8 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-xl font-bold text-foreground">
            You&apos;re on the list!
          </p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'simple') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <input type="hidden" name="source" value={source} />
        {/* Simple variant still needs role for validation, but we can default it or hide it if needed. 
            Actually the schema REQUIRES role. So simple variant might need to be more clever or we update schema.
            For now, let's keep simple variant minimal but compliant. */}
        <input type="hidden" name="full_name" value="Early Access User" />
        <input type="hidden" name="role" value="Other" />
        <Input
          type="email"
          name="email"
          placeholder="professional@email.com"
          required
          disabled={isPending}
          className="h-14 rounded-xl border-border/40 bg-background/50 px-6"
        />
        <Button
          variant="brand"
          className="h-14 shrink-0 rounded-xl px-8"
          disabled={isPending}
        >
          {isPending ? 'Joining...' : 'Get Access'}
        </Button>
        {status === 'error' && (
          <p className="absolute -bottom-6 left-0 text-xs text-destructive">
            {message}
          </p>
        )}
      </form>
    );
  }

  // Full variant with multi-step form
  return (
    <form
      onSubmit={handleMultiStepSubmit}
      onKeyDown={handleKeyDown}
      className={cn('relative z-10 space-y-6', className)}
    >
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {/* Step Content with Transition */}
      <StepTransition currentStep={currentStep} direction={direction}>
        <FormStep
          step={steps[currentStep - 1]}
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
          onBlur={markFieldTouched}
          disabled={isPending || isAnimating}
        />
      </StepTransition>

      {/* Server Error Message */}
      {status === 'error' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-medium text-destructive"
        >
          {message}
        </motion.p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isPending || isAnimating}
            className="h-14 rounded-xl px-6"
          >
            ← Back
          </Button>
        )}
        <Button
          type="submit"
          variant="brand"
          disabled={isPending || isAnimating}
          className="h-14 flex-1 rounded-xl text-base font-bold shadow-lg shadow-aq-blue/20"
        >
          {isPending
            ? 'Securing your spot...'
            : currentStep < totalSteps
              ? 'Continue →'
              : 'Secure Beta Access →'}
        </Button>
      </div>
    </form>
  );
}
