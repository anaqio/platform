import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AtelierForm } from '@/components/sections/waitlist/atelier-form';

// Mock next-intl — component uses useTranslations for trigger label
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock @uidotdev/usehooks — useToggle drives drawer open state
vi.mock('@uidotdev/usehooks', () => ({
  useToggle: (initial: boolean) => [initial, vi.fn()] as const,
}));

// Mock DataManager — returns typed card content stub
vi.mock('@/lib/utils/data-manager', () => ({
  DataManager: () => ({
    eyebrow: 'Candidature',
    title: 'Atelier',
    footnote: 'By invitation',
  }),
}));

// Mock AtelierInvitationForm — unit test boundary: only test the Drawer shell
vi.mock('@/components/sections/atelier-invitation', () => ({
  AtelierInvitationForm: () => (
    <div data-testid="atelier-invitation-form">Form</div>
  ),
}));

// Mock vaul (shadcn Drawer) with a simple portal-less implementation
vi.mock('@/components/ui/drawer', () => ({
  Drawer: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (v: boolean) => void;
  }) => (
    <div data-testid="drawer" data-open={open}>
      {children}
    </div>
  ),
  DrawerTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="drawer-trigger">{children}</div>,
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-header">{children}</div>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="drawer-title">{children}</h2>
  ),
  DrawerDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="drawer-description">{children}</p>
  ),
  DrawerClose: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-close">{children}</div>
  ),
}));

describe('AtelierForm', () => {
  it('renders a trigger button by default', () => {
    render(<AtelierForm />);
    expect(screen.getByTestId('drawer-trigger')).toBeDefined();
  });

  it('renders drawer content with the invitation form', () => {
    render(<AtelierForm />);
    expect(screen.getByTestId('atelier-invitation-form')).toBeDefined();
  });

  it('renders a drawer header with title and description', () => {
    render(<AtelierForm />);
    expect(screen.getByTestId('drawer-title')).toBeDefined();
    expect(screen.getByTestId('drawer-description')).toBeDefined();
  });

  it('accepts a custom trigger node', () => {
    render(
      <AtelierForm
        trigger={<button data-testid="custom-trigger">Custom</button>}
      />
    );
    expect(screen.getByTestId('custom-trigger')).toBeDefined();
  });
});
