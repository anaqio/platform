import * as React from 'react'

import { cn } from '@/lib/utils'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string
  ref?: React.Ref<HTMLElement>
}

/** Full-viewport section with standard horizontal padding and vertical centering. */
export function Section({ id, className, children, ref, ...props }: SectionProps) {
  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        'flex min-h-screen w-full flex-col justify-center px-4 py-24 sm:px-8 lg:px-12',
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}
Section.displayName = 'Section'

/** Centered max-width content container used inside Section. */
export function SectionContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mx-auto w-full max-w-[1200px]', className)} {...props}>
      {children}
    </div>
  )
}
