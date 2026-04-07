'use client';

import { useState, useTransition } from 'react';

import { Link, useRouter } from '@/i18n/routing';
import { verifyBrandAccess } from '@/lib/actions/brand';

export function BrandGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    startTransition(async () => {
      const result = await verifyBrandAccess(password);
      if (result.success) {
        router.refresh();
      } else {
        setError(true);
        setPassword('');
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a08] px-4 font-body text-[#f0ebe3] antialiased">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .gate-card {
            background: rgba(20, 20, 18, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(201, 169, 110, 0.2);
            padding: 48px;
            border-radius: 32px;
            width: 100%;
            max-width: 440px;
            text-align: center;
            box-shadow: 0 40px 100px rgba(0,0,0,0.8);
            position: relative;
            overflow: hidden;
          }
          .gate-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
            pointer-events: none;
          }
          .gate-logo {
            font-family: var(--font-instrument-serif), serif;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.14em;
            color: #c9a96e;
            text-transform: uppercase;
            margin-bottom: 32px;
          }
          .gate-title {
            font-family: var(--font-instrument-serif), serif;
            font-size: 20px;
            font-style: italic;
            color: #faf7f2;
            margin-bottom: 12px;
          }
          .gate-desc {
            font-family: var(--font-inter), sans-serif;
            font-size: 13px;
            color: #5a5950;
            margin-bottom: 32px;
            line-height: 1.6;
          }
          .gate-input {
            width: 100%;
            background: rgba(240,235,227,0.05);
            border: 1px solid rgba(201,169,110,0.2);
            border-radius: 12px;
            padding: 14px 18px;
            color: #faf7f2;
            font-family: var(--font-inter), sans-serif;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
            text-align: center;
            letter-spacing: 0.2em;
          }
          .gate-input:focus {
            border-color: #c9a96e;
            background: rgba(240,235,227,0.08);
          }
          .gate-btn {
            width: 100%;
            margin-top: 16px;
            background: #c9a96e;
            color: #0a0a08;
            border: none;
            padding: 14px;
            border-radius: 12px;
            font-family: var(--font-inter), sans-serif;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
          }
          .gate-btn:hover {
            background: #e8d5b0;
            transform: translateY(-1px);
          }
          .gate-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .error-msg {
            color: #EF4444;
            font-size: 12px;
            margin-top: 12px;
            font-family: var(--font-inter), sans-serif;
          }
        `,
        }}
      />
      <div className="gate-card">
        <div className="gate-logo">Anaqio</div>
        <h1 className="gate-title">Brand Identity Guidelines</h1>
        <p className="gate-desc">
          This document is confidential and contains proprietary brand assets.
          Please enter the access key to continue.
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            className="gate-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            disabled={isPending}
          />
          {error && <div className="error-msg">Invalid access key</div>}
          <button type="submit" className="gate-btn" disabled={isPending}>
            {isPending ? 'Unlocking...' : 'Unlock Guidelines'}
          </button>
        </form>
        <Link
          href="/"
          className="mt-8 inline-block text-[11px] uppercase tracking-[0.1em] text-[#5a5950] transition-colors hover:text-[#c9a96e]"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
