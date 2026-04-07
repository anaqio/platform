'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

import type { StepIndicatorProps } from '@/lib/types/waitlist-form';

import { cn } from '@/lib/utils';

export const ProgressIndicator = memo(function ProgressIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div
      className="mb-8 flex items-center justify-center gap-2"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step dot */}
            <button
              type="button"
              onClick={() => onStepClick?.(stepNumber)}
              disabled={!onStepClick}
              className={cn(
                'relative h-3 w-3 rounded-full transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-aq-blue/50 focus:ring-offset-2',
                isCurrent && 'h-4 w-4',
                isCompleted && 'cursor-pointer bg-aq-blue hover:scale-110',
                isCurrent && 'bg-aq-blue shadow-lg shadow-aq-blue/50',
                isUpcoming && 'bg-muted-foreground/20',
                !onStepClick && 'cursor-default'
              )}
              aria-label={`Step ${stepNumber} of ${totalSteps}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Glow effect for current step */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-aq-blue"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}
            </button>

            {/* Connecting line */}
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  'mx-1 h-0.5 w-8 transition-all duration-300',
                  isCompleted && 'bg-aq-blue',
                  !isCompleted && 'bg-muted-foreground/20'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});
