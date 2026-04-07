import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex justify-center items-center gap-2 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:size-4 text-sm whitespace-nowrap transition-colors [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        brand:
          'bg-aq-gold text-aq-navy hover:bg-aq-gold/90 hover:shadow-lg font-semibold',
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',

        destructive: 'bg-destructive hover:bg-destructive/90',

        ghost: 'hover:bg-accent hover:text-accent-foreground',
        hero: 'bg-aq-gold text-aq-navy hover:bg-aq-gold/90 hover:scale-[1.04] shadow-[0_0_40px_rgba(212,175,55,0.25)] font-semibold tracking-wide transition-transform',
        heroOutline: 'border bg-transparent hover:bg-primary/10 tracking-wide',
        link: 'text-primary underline-offset-4 hover:underline',

        outline: 'border border-input hover:text-accent-foreground',

        secondary: 'bg-secondary hover:bg-secondary/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-12 text-base',
        xl: 'h-14 rounded-lg text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
