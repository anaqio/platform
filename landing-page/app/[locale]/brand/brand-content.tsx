import { Link } from '@/i18n/routing';

export function BrandIdentityContent() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          /* ─── PRIMARY PALETTE (OMPIC Registered) ─── */
          --aq-blue:          #2563EB;
          --aq-purple:        #7C3AED;
          --aq-white:         #F8FAFC;

          /* ─── GRADIENT SPECTRUM (from SVG) ─── */
          --aq-grad-start:    #3F57AF;
          --aq-grad-mid1:     #484DA9;
          --aq-grad-mid2:     #6049A8;
          --aq-grad-end:      #6F47A7;

          /* ─── EXTENDED PALETTE ─── */
          --aq-blue-light:    #DBEAFE;
          --aq-blue-dark:     #1D4ED8;
          --aq-purple-light:  #EDE9FE;
          --aq-purple-dark:   #5B21B6;
          --aq-ink:           #0F172A;
          --aq-slate:         #334155;
          --aq-muted:         #94A3B8;
          --aq-border:        #E2E8F0;
          --aq-surface:       #F1F5F9;

          /* ─── GRADIENTS ─── */
          --aq-gradient:        linear-gradient(90deg, #3F57AF 0%, #484DA9 32%, #6049A8 67%, #6F47A7 100%);
          --aq-gradient-diag:   linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
          --aq-gradient-radial: radial-gradient(ellipse at 30% 50%, #2563EB 0%, #7C3AED 100%);
          --aq-gradient-light:  linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%);

          /* ─── TYPOGRAPHY ─── */
          --font-display: var(--font-space-grotesk), sans-serif;
          --font-body:    var(--font-inter), sans-serif;
          --font-mono:    var(--font-mono), monospace;

          /* ─── SPACING ─── */
          --sp-xs: 4px; --sp-sm: 8px; --sp-md: 16px;
          --sp-lg: 24px; --sp-xl: 32px; --sp-2xl: 48px;
          --sp-3xl: 64px; --sp-4xl: 96px;

          /* ─── RADIUS ─── */
          --r-sm: 4px; --r-md: 8px; --r-lg: 12px; --r-xl: 16px; --r-full: 999px;

          /* ─── SHADOW ─── */
          --shadow-sm:  0 1px 3px rgba(37,99,235,0.08), 0 1px 2px rgba(37,99,235,0.06);
          --shadow-md:  0 4px 16px rgba(37,99,235,0.12), 0 2px 6px rgba(124,58,237,0.08);
          --shadow-lg:  0 16px 40px rgba(37,99,235,0.16), 0 4px 12px rgba(124,58,237,0.12);
          --shadow-glow: 0 0 40px rgba(124,58,237,0.25);
        }

        .brand-body-wrap {
          background: var(--aq-white);
          color: var(--aq-ink);
          font-family: var(--font-body);
          font-weight: 400;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .brand-page { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        .brand-section { padding: 80px 0; border-bottom: 1px solid var(--aq-border); }
        .brand-section:last-child { border-bottom: none; }
        .section-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--aq-blue);
          margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
        }
        .section-label::after { content: ''; flex: 1; max-width: 40px; height: 1px; background: var(--aq-blue); }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 700; line-height: 1.1;
          color: var(--aq-ink); margin-bottom: 12px;
        }
        .section-desc { font-size: 16px; color: var(--aq-slate); max-width: 560px; line-height: 1.7; margin-bottom: 48px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

        .cover {
          background: var(--aq-ink);
          color: var(--aq-white);
          padding: 0;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          position: relative;
        }
        .cover::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 70% 40%, rgba(124,58,237,0.35) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, rgba(37,99,235,0.2) 0%, transparent 50%);
          pointer-events: none;
        }
        .cover::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }
        .cover-left {
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }
        .cover-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          overflow: hidden;
        }
        .cover-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(37,99,235,0.06);
          border-left: 1px solid rgba(255,255,255,0.06);
        }

        .cover-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(255,255,255,0.45);
          margin-bottom: 8px;
        }
        .cover-brand {
          font-family: var(--font-display);
          font-size: 72px; font-weight: 800; line-height: 1;
          background: var(--aq-gradient);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        .cover-tagline {
          font-size: 18px; font-weight: 300;
          color: rgba(255,255,255,0.6);
          margin-top: 16px; line-height: 1.5;
        }
        .cover-meta {
          font-size: 12px; color: rgba(255,255,255,0.3);
          letter-spacing: 0.06em; line-height: 1.9;
        }
        .cover-meta strong { color: rgba(255,255,255,0.5); font-weight: 500; }

        .logo-hero-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }
        .logo-hero-wrap svg { width: 100%; max-width: 480px; }

        .doc-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(248,250,252,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--aq-border);
          padding: 0 40px;
        }
        .doc-nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center;
          gap: 4px; height: 56px;
          overflow-x: auto;
        }
        .doc-nav a {
          font-size: 13px; font-weight: 500;
          color: var(--aq-muted); text-decoration: none;
          white-space: nowrap; padding: 6px 14px;
          border-radius: var(--r-full);
          transition: all 0.2s;
        }
        .doc-nav a:hover { color: var(--aq-blue); background: var(--aq-blue-light); }
        .doc-nav .brand { font-family: var(--font-display); font-weight: 800; font-size: 16px; background: var(--aq-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-right: 16px; padding: 0; }

        .logo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .logo-cell {
          border-radius: var(--r-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          min-height: 220px;
          gap: 20px;
          position: relative;
        }
        .logo-cell.light { background: var(--aq-white); border: 1px solid var(--aq-border); }
        .logo-cell.surface { background: var(--aq-surface); }
        .logo-cell.dark { background: var(--aq-ink); }
        .logo-cell.gradient-bg { background: var(--aq-gradient-diag); }
        .logo-cell svg { width: 100%; max-width: 200px; }
        .logo-cell-label {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--aq-muted); font-weight: 500;
        }
        .logo-cell.dark .logo-cell-label,
        .logo-cell.gradient-bg .logo-cell-label { color: rgba(255,255,255,0.5); }

        .logo-clearspace {
          background: var(--aq-surface);
          border: 1px solid var(--aq-border);
          border-radius: var(--r-lg);
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 64px;
        }
        .clearspace-diagram {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .clearspace-diagram .logo-box {
          border: 1.5px dashed var(--aq-blue);
          padding: 20px;
          position: relative;
        }
        .clearspace-diagram .x-mark {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--aq-blue);
          font-weight: 500;
        }
        .x-top { top: -20px; left: 50%; transform: translateX(-50%); }
        .x-bottom { bottom: -20px; left: 50%; transform: translateX(-50%); }
        .x-left { left: -24px; top: 50%; transform: translateY(-50%); }
        .x-right { right: -24px; top: 50%; transform: translateY(-50%); }

        .dont-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 32px;
        }
        .dont-card {
          background: var(--aq-surface);
          border: 1px solid var(--aq-border);
          border-radius: var(--r-md);
          padding: 24px;
          text-align: center;
        }
        .dont-visual {
          height: 80px; display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
        }
        .dont-label {
          font-size: 12px; color: #EF4444; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .dont-desc { font-size: 12px; color: var(--aq-muted); margin-top: 6px; line-height: 1.5; }

        .color-palette-main {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .color-swatch {
          border-radius: var(--r-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .color-swatch-block {
          height: 160px;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 16px;
        }
        .color-swatch-block.tall { height: 220px; }
        .ompic-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: var(--r-full);
          padding: 4px 10px;
          font-size: 10px; letter-spacing: 0.08em; color: white;
          font-weight: 500;
        }
        .color-swatch-info {
          background: white;
          padding: 16px 20px;
          border-top: 1px solid var(--aq-border);
        }
        .color-name { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--aq-ink); margin-bottom: 6px; }
        .color-values { display: flex; flex-direction: column; gap: 3px; }
        .color-value { font-family: var(--font-mono); font-size: 11px; color: var(--aq-muted); }
        .color-value strong { color: var(--aq-slate); }

        .gradient-strip {
          height: 96px;
          border-radius: var(--r-lg);
          background: var(--aq-gradient);
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .gradient-stops {
          display: flex;
          justify-content: space-between;
          padding: 0 4px;
        }
        .gradient-stop { text-align: center; }
        .gradient-stop-color { width: 32px; height: 32px; border-radius: 50%; margin: 0 auto 6px; border: 2px solid white; box-shadow: var(--shadow-sm); }
        .gradient-stop-hex { font-family: var(--font-mono); font-size: 11px; color: var(--aq-slate); }
        .gradient-stop-pos { font-size: 10px; color: var(--aq-muted); margin-top: 2px; }

        .gradient-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 24px; }
        .gradient-card { border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-sm); }
        .gradient-card-vis { height: 80px; }
        .gradient-card-info { background: white; padding: 12px 16px; border-top: 1px solid var(--aq-border); }
        .gradient-card-name { font-size: 12px; font-weight: 600; color: var(--aq-ink); margin-bottom: 3px; }
        .gradient-card-code { font-family: var(--font-mono); font-size: 10px; color: var(--aq-muted); line-height: 1.6; }

        .extended-palette { display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; margin-top: 32px; }
        .ext-swatch { border-radius: var(--r-md); overflow: hidden; }
        .ext-color { height: 64px; }
        .ext-info { padding: 8px; background: white; border: 1px solid var(--aq-border); border-top: none; border-radius: 0 0 var(--r-md) var(--r-md); }
        .ext-name { font-size: 10px; font-weight: 600; color: var(--aq-ink); }
        .ext-hex { font-family: var(--font-mono); font-size: 10px; color: var(--aq-muted); }

        .type-specimen {
          background: var(--aq-surface);
          border: 1px solid var(--aq-border);
          border-radius: var(--r-xl);
          padding: 48px;
          margin-bottom: 24px;
        }
        .type-family-name {
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--aq-blue); font-weight: 600; margin-bottom: 24px;
          padding-bottom: 16px; border-bottom: 1px solid var(--aq-border);
        }
        .type-display-sample {
          font-family: var(--font-display);
          font-size: 56px; font-weight: 800; line-height: 1.05;
          letter-spacing: -0.02em; color: var(--aq-ink);
          margin-bottom: 16px;
          background: var(--aq-gradient);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .type-body-sample {
          font-family: var(--font-body);
          font-size: 17px; color: var(--aq-slate); line-height: 1.75;
          max-width: 560px;
        }
        .type-weights { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 24px; }
        .type-weight { text-align: center; }
        .type-weight-sample { font-size: 32px; color: var(--aq-ink); line-height: 1; margin-bottom: 8px; }
        .type-weight-label { font-size: 11px; color: var(--aq-muted); letter-spacing: 0.1em; text-transform: uppercase; }

        .type-scale {
          display: flex; flex-direction: column; gap: 0;
        }
        .type-scale-row {
          display: grid; grid-template-columns: 80px 1fr 120px;
          align-items: center; gap: 24px;
          padding: 16px 0; border-bottom: 1px solid var(--aq-border);
        }
        .type-scale-token { font-family: var(--font-mono); font-size: 11px; color: var(--aq-muted); }
        .type-scale-sample { font-family: var(--font-display); color: var(--aq-ink); }
        .type-scale-meta { font-size: 11px; color: var(--aq-muted); text-align: right; }

        .mono-sample {
          background: var(--aq-ink);
          border-radius: var(--r-lg);
          padding: 28px 32px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--aq-white);
          line-height: 1.8;
        }
        .mono-sample .kw { color: #7C3AED; }
        .mono-sample .str { color: #10B981; }
        .mono-sample .prop { color: #2563EB; }
        .mono-sample .val { color: #F59E0B; }
        .mono-sample .cmt { color: #475569; font-style: italic; }

        .spacing-row {
          display: flex; align-items: center; gap: 20px;
          padding: 12px 0; border-bottom: 1px solid var(--aq-border);
        }
        .spacing-token { font-family: var(--font-mono); font-size: 12px; color: var(--aq-blue); width: 120px; }
        .spacing-bar-wrap { flex: 1; display: flex; align-items: center; gap: 12px; }
        .spacing-bar { height: 16px; background: var(--aq-gradient-diag); border-radius: 2px; }
        .spacing-value { font-size: 12px; color: var(--aq-muted); font-family: var(--font-mono); width: 48px; }
        .spacing-usage { font-size: 12px; color: var(--aq-slate); }

        .comp-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
        .btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: var(--r-full);
          font-family: var(--font-body); font-size: 14px; font-weight: 600;
          letter-spacing: 0.01em; cursor: pointer; border: none;
          text-decoration: none; transition: all 0.2s;
        }
        .btn-primary {
          background: var(--aq-gradient-diag);
          color: white; box-shadow: var(--shadow-md);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: var(--shadow-lg); }
        .btn-secondary {
          background: white; color: var(--aq-blue);
          border: 1.5px solid var(--aq-blue);
        }
        .btn-secondary:hover { background: var(--aq-blue-light); }
        .btn-ghost { background: var(--aq-surface); color: var(--aq-slate); }
        .btn-ghost:hover { background: var(--aq-border); }
        .btn-sm { padding: 7px 16px; font-size: 13px; }
        .btn-lg { padding: 14px 32px; font-size: 16px; }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: var(--r-full);
          font-size: 12px; font-weight: 600;
        }
        .badge-blue { background: var(--aq-blue-light); color: var(--aq-blue-dark); }
        .badge-purple { background: var(--aq-purple-light); color: var(--aq-purple-dark); }
        .badge-gradient { background: var(--aq-gradient); color: white; }

        .input-demo {
          display: flex; flex-direction: column; gap: 12px; max-width: 400px;
        }
        .input-field {
          padding: 11px 16px; border: 1.5px solid var(--aq-border);
          border-radius: var(--r-md); font-family: var(--font-body); font-size: 14px;
          color: var(--aq-ink); background: white; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: var(--aq-blue);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }
        .input-field::placeholder { color: var(--aq-muted); }
        .input-label { font-size: 13px; font-weight: 600; color: var(--aq-slate); margin-bottom: -6px; }

        .card-demo {
          background: white; border-radius: var(--r-xl);
          border: 1px solid var(--aq-border); overflow: hidden;
          box-shadow: var(--shadow-sm); max-width: 320px;
        }
        .card-top { height: 120px; background: var(--aq-gradient-diag); position: relative; }
        .card-top-label {
          position: absolute; bottom: 16px; left: 20px;
          font-family: var(--font-display); font-size: 20px; font-weight: 700;
          color: white;
        }
        .card-body { padding: 20px; }
        .card-body p { font-size: 14px; color: var(--aq-slate); margin-bottom: 16px; line-height: 1.6; }

        .token-table { width: 100%; border-collapse: collapse; }
        .token-table th { background: var(--aq-surface); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; color: var(--aq-slate); padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--aq-border); }
        .token-table td { padding: 12px 16px; border-bottom: 1px solid rgba(226,232,240,0.5); font-size: 13px; vertical-align: middle; }
        .token-table tr:hover td { background: rgba(241,245,249,0.5); }
        .token-chip { display: inline-flex; align-items: center; gap: 8px; }
        .token-dot { width: 16px; height: 16px; border-radius: 3px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.08); }

        .trademark-notice {
          background: linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.06));
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: var(--r-xl);
          padding: 32px 40px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: start;
        }
        .tm-icon {
          width: 48px; height: 48px;
          background: var(--aq-gradient-diag);
          border-radius: var(--r-md);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: var(--font-display); font-size: 20px; font-weight: 800;
          color: white;
        }
        .tm-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--aq-ink); margin-bottom: 10px; }
        .tm-details { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
        .tm-row { display: flex; gap: 8px; font-size: 13px; }
        .tm-key { color: var(--aq-muted); min-width: 100px; font-weight: 500; }
        .tm-val { color: var(--aq-slate); font-family: var(--font-mono); font-size: 12px; }

        .brand-footer {
          background: var(--aq-ink);
          padding: 48px 40px;
          text-align: center;
        }
        .brand-footer-logo {
          font-family: var(--font-display); font-size: 36px; font-weight: 800;
          background: var(--aq-gradient);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 12px;
        }
        .brand-footer-copy { font-size: 13px; color: rgba(255,255,255,0.3); }

        .icon-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .icon-cell {
          border-radius: var(--r-lg); overflow: hidden;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 12px; padding: 24px 16px;
        }
        .icon-cell svg { display: block; }
        .icon-cell-label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--aq-muted); font-weight: 500; }
        .icon-cell.dark .icon-cell-label { color: rgba(255,255,255,0.4); }

        .usage-do-dont {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .usage-card {
          border-radius: var(--r-xl); overflow: hidden;
          border: 1.5px solid var(--aq-border);
        }
        .usage-card.do-card { border-color: #10B981; }
        .usage-card.dont-card { border-color: #EF4444; }
        .usage-header {
          padding: 12px 20px; display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .usage-header.do { background: #ECFDF5; color: #065F46; }
        .usage-header.dont { background: #FEF2F2; color: #991B1B; }
        .usage-body { padding: 32px; background: var(--aq-surface); display: flex; align-items: center; justify-content: center; min-height: 160px; }
        .usage-desc { padding: 16px 20px; font-size: 13px; color: var(--aq-slate); border-top: 1px solid var(--aq-border); background: white; line-height: 1.6; }

        @media (max-width: 900px) {
          .brand-page { padding: 0 20px; }
          .cover { grid-template-columns: 1fr; }
          .cover-right { display: none; }
          .cover-brand { font-size: 52px; }
          .color-palette-main { grid-template-columns: 1fr 1fr; }
          .logo-grid { grid-template-columns: 1fr 1fr; }
          .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
          .extended-palette { grid-template-columns: repeat(4, 1fr); }
          .tm-details { grid-template-columns: 1fr; }
          .gradient-cards { grid-template-columns: 1fr; }
          .icon-grid { grid-template-columns: repeat(3, 1fr); }
          .dont-grid { grid-template-columns: 1fr; }
          .usage-do-dont { grid-template-columns: 1fr; }
        }
      `,
        }}
      />
      <div className="brand-body-wrap">
        {/* COVER */}
        <div className="cover">
          <div className="cover-left">
            <div>
              <div className="cover-eyebrow">Visual Brand Identity — v1.0</div>
              <div className="cover-brand">ANAQIO</div>
              <div className="cover-tagline">
                AI-Driven Virtual Studio
                <br />
                for Fashion Commerce
              </div>
            </div>
            <div className="cover-meta">
              <strong>Owner</strong> Amal Ait Oukharaz
              <br />
              <strong>Trademark Filing</strong> OMPIC PR-237456
              <br />
              <strong>Class</strong> 42 — Logiciel-service [SaaS]
              <br />
              <strong>Filed</strong> 17 February 2026 · Casablanca, Morocco
              <br />
              <strong>Document</strong> Brand Identity Guidelines · 2026
            </div>
          </div>
          <div className="cover-right">
            <div className="logo-hero-wrap">
              <svg
                viewBox="0 0 800 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3F57AF" />
                    <stop offset="32%" stopColor="#484DA9" />
                    <stop offset="67%" stopColor="#6049A8" />
                    <stop offset="100%" stopColor="#6F47A7" />
                  </linearGradient>
                  <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <g transform="translate(320,30)">
                  <path
                    d="M60 0 C60 0 60 18 40 18"
                    stroke="url(#cg2)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M0 60 L120 60"
                    stroke="url(#cg2)"
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 18 C20 18 0 35 0 60"
                    stroke="url(#cg2)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M40 18 C60 18 120 35 120 60"
                    stroke="url(#cg2)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M20 60 L20 120 L100 120 L100 60"
                    stroke="url(#cg2)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(37,99,235,0.06)"
                  />
                  <line
                    x1="35"
                    y1="75"
                    x2="85"
                    y2="75"
                    stroke="url(#cg2)"
                    strokeWidth={2}
                    strokeOpacity="0.4"
                  />
                  <line
                    x1="35"
                    y1="88"
                    x2="85"
                    y2="88"
                    stroke="url(#cg2)"
                    strokeWidth={2}
                    strokeOpacity="0.4"
                  />
                  <line
                    x1="35"
                    y1="101"
                    x2="65"
                    y2="101"
                    stroke="url(#cg2)"
                    strokeWidth={2}
                    strokeOpacity="0.4"
                  />
                </g>
                <text
                  x="400"
                  y="220"
                  fontFamily="Space Grotesk, sans-serif"
                  fontSize="72"
                  fontWeight="700"
                  fill="url(#cg)"
                  textAnchor="middle"
                  letterSpacing="-1"
                >
                  ANAQIO
                </text>
                <text
                  x="400"
                  y="252"
                  fontFamily="Inter, sans-serif"
                  fontSize="14"
                  fontWeight="400"
                  fill="rgba(255,255,255,0.4)"
                  textAnchor="middle"
                  letterSpacing="3"
                >
                  AI VIRTUAL STUDIO
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* DOC NAV */}
        <nav className="doc-nav">
          <div className="doc-nav-inner">
            <Link href="/" className="brand">
              Anaqio
            </Link>
            <a href="#logo">Logo</a>
            <a href="#colors">Colors</a>
            <a href="#typography">Typography</a>
            <a href="#gradients">Gradients</a>
            <a href="#spacing">Spacing</a>
            <a href="#components">Components</a>
            <a href="#tokens">Tokens</a>
            <a href="#trademark">Trademark</a>
          </div>
        </nav>

        <div className="brand-page">
          <section className="brand-section" id="logo">
            <div className="section-label">01 · Logo System</div>
            <h2 className="section-title">The Anaqio Mark</h2>
            <p className="section-desc">
              The Anaqio logo is a mixed mark composed of a fashion icon and a
              geometric wordmark, unified by a blue-to-violet gradient. The icon
              references a clothing hanger — a direct nod to fashion commerce.
            </p>

            <div className="logo-grid" style={{ marginBottom: '24px' }}>
              <div className="logo-cell light">
                <svg
                  viewBox="0 0 300 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: '220px' }}
                >
                  <defs>
                    <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3F57AF" />
                      <stop offset="32%" stopColor="#484DA9" />
                      <stop offset="67%" stopColor="#6049A8" />
                      <stop offset="100%" stopColor="#6F47A7" />
                    </linearGradient>
                  </defs>
                  <text
                    x="150"
                    y="75"
                    fontFamily="Syne,sans-serif"
                    fontSize="48"
                    fontWeight="800"
                    fill="url(#lg1)"
                    textAnchor="middle"
                    letterSpacing="-1"
                  >
                    ANAQIO
                  </text>
                  <text
                    x="150"
                    y="100"
                    fontFamily="Plus Jakarta Sans,sans-serif"
                    fontSize="10"
                    fontWeight="400"
                    fill="#94A3B8"
                    textAnchor="middle"
                    letterSpacing="3"
                  >
                    AI VIRTUAL STUDIO
                  </text>
                </svg>
                <span className="logo-cell-label">On White</span>
              </div>
              <div className="logo-cell surface">
                <svg
                  viewBox="0 0 300 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: '220px' }}
                >
                  <defs>
                    <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3F57AF" />
                      <stop offset="100%" stopColor="#6F47A7" />
                    </linearGradient>
                  </defs>
                  <text
                    x="150"
                    y="75"
                    fontFamily="Syne,sans-serif"
                    fontSize="48"
                    fontWeight="800"
                    fill="url(#lg2)"
                    textAnchor="middle"
                    letterSpacing="-1"
                  >
                    ANAQIO
                  </text>
                  <text
                    x="150"
                    y="100"
                    fontFamily="Plus Jakarta Sans,sans-serif"
                    fontSize="10"
                    fontWeight="400"
                    fill="#94A3B8"
                    textAnchor="middle"
                    letterSpacing="3"
                  >
                    AI VIRTUAL STUDIO
                  </text>
                </svg>
                <span className="logo-cell-label">On Surface</span>
              </div>
              <div className="logo-cell dark">
                <svg
                  viewBox="0 0 300 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: '220px' }}
                >
                  <defs>
                    <linearGradient id="lg3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3F57AF" />
                      <stop offset="100%" stopColor="#6F47A7" />
                    </linearGradient>
                  </defs>
                  <text
                    x="150"
                    y="75"
                    fontFamily="Syne,sans-serif"
                    fontSize="48"
                    fontWeight="800"
                    fill="url(#lg3)"
                    textAnchor="middle"
                    letterSpacing="-1"
                  >
                    ANAQIO
                  </text>
                  <text
                    x="150"
                    y="100"
                    fontFamily="Plus Jakarta Sans,sans-serif"
                    fontSize="10"
                    fontWeight="400"
                    fill="rgba(255,255,255,0.35)"
                    textAnchor="middle"
                    letterSpacing="3"
                  >
                    AI VIRTUAL STUDIO
                  </text>
                </svg>
                <span className="logo-cell-label">On Dark</span>
              </div>
              <div className="logo-cell gradient-bg">
                <svg
                  viewBox="0 0 300 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: '220px' }}
                >
                  <text
                    x="150"
                    y="75"
                    fontFamily="Syne,sans-serif"
                    fontSize="48"
                    fontWeight="800"
                    fill="white"
                    textAnchor="middle"
                    letterSpacing="-1"
                  >
                    ANAQIO
                  </text>
                  <text
                    x="150"
                    y="100"
                    fontFamily="Plus Jakarta Sans,sans-serif"
                    fontSize="10"
                    fontWeight="400"
                    fill="rgba(255,255,255,0.55)"
                    textAnchor="middle"
                    letterSpacing="3"
                  >
                    AI VIRTUAL STUDIO
                  </text>
                </svg>
                <span className="logo-cell-label">On Gradient</span>
              </div>
              <div className="logo-cell light">
                <svg
                  viewBox="0 0 120 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: '80px' }}
                >
                  <defs>
                    <linearGradient id="ig1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M60 4 C60 4 60 22 40 22"
                    stroke="url(#ig1)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M0 64 L120 64"
                    stroke="url(#ig1)"
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 22 C20 22 0 39 0 64"
                    stroke="url(#ig1)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M40 22 C60 22 120 39 120 64"
                    stroke="url(#ig1)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M18 64 L18 128 L102 128 L102 64"
                    stroke="url(#ig1)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(37,99,235,0.05)"
                  />
                  <line
                    x1="32"
                    y1="80"
                    x2="88"
                    y2="80"
                    stroke="url(#ig1)"
                    strokeWidth={2.5}
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="32"
                    y1="95"
                    x2="88"
                    y2="95"
                    stroke="url(#ig1)"
                    strokeWidth={2.5}
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="32"
                    y1="110"
                    x2="64"
                    y2="110"
                    stroke="url(#ig1)"
                    strokeWidth={2.5}
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="logo-cell-label">Icon Mark</span>
              </div>
              <div className="logo-cell dark">
                <svg
                  viewBox="0 0 120 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: '80px' }}
                >
                  <defs>
                    <linearGradient id="ig2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M60 4 C60 4 60 22 40 22"
                    stroke="url(#ig2)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M0 64 L120 64"
                    stroke="url(#ig2)"
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 22 C20 22 0 39 0 64"
                    stroke="url(#ig2)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M40 22 C60 22 120 39 120 64"
                    stroke="url(#ig2)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M18 64 L18 128 L102 128 L102 64"
                    stroke="url(#ig2)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(37,99,235,0.12)"
                  />
                  <line
                    x1="32"
                    y1="80"
                    x2="88"
                    y2="80"
                    stroke="url(#ig2)"
                    strokeWidth={2.5}
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="32"
                    y1="95"
                    x2="88"
                    y2="95"
                    stroke="url(#ig2)"
                    strokeWidth={2.5}
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="32"
                    y1="110"
                    x2="64"
                    y2="110"
                    stroke="url(#ig2)"
                    strokeWidth={2.5}
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="logo-cell-label">Icon on Dark</span>
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                margin: '40px 0 16px',
                color: 'var(--aq-ink)',
              }}
            >
              Clear Space
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--aq-slate)',
                marginBottom: '24px',
              }}
            >
              Always maintain a minimum clear space equal to the height of the
              letter "A" in the wordmark (value:{' '}
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--aq-surface)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                x
              </code>
              ) on all sides.
            </p>
            <div className="logo-clearspace">
              <div className="clearspace-diagram">
                <div style={{ width: '60px', height: '60px' }} />
                <div
                  className="logo-box"
                  style={{ borderColor: 'var(--aq-blue)' }}
                >
                  <svg
                    viewBox="0 0 200 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '160px' }}
                  >
                    <defs>
                      <linearGradient
                        id="cls"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3F57AF" />
                        <stop offset="100%" stopColor="#6F47A7" />
                      </linearGradient>
                    </defs>
                    <text
                      x="100"
                      y="46"
                      fontFamily="Syne,sans-serif"
                      fontSize="48"
                      fontWeight="800"
                      fill="url(#cls)"
                      textAnchor="middle"
                      letterSpacing="-1"
                    >
                      ANAQIO
                    </text>
                  </svg>
                  <span className="x-mark x-top">x</span>
                  <span className="x-mark x-bottom">x</span>
                  <span className="x-mark x-left">x</span>
                  <span className="x-mark x-right">x</span>
                </div>
                <div style={{ width: '60px', height: '60px' }} />
              </div>
              <div style={{ maxWidth: '280px' }}>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--aq-slate)',
                    lineHeight: 1.7,
                  }}
                >
                  <strong style={{ color: 'var(--aq-ink)' }}>
                    Minimum clear space
                  </strong>{' '}
                  is the height of the capital "A" in the wordmark. This zone
                  must remain free of all other graphic elements, text, or
                  imagery. Never compromise the logo's breathing room.
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--aq-slate)',
                    lineHeight: 1.7,
                    marginTop: '12px',
                  }}
                >
                  <strong style={{ color: 'var(--aq-ink)' }}>
                    Minimum size:
                  </strong>{' '}
                  120px wide on digital, 30mm wide in print.
                </p>
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                margin: '40px 0 8px',
                color: 'var(--aq-ink)',
              }}
            >
              Logo Don'ts
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--aq-slate)',
                marginBottom: '16px',
              }}
            >
              Never modify the logo in the following ways:
            </p>
            <div className="dont-grid">
              <div className="dont-card">
                <div className="dont-visual">
                  <span
                    style={{
                      fontFamily: 'Syne,sans-serif',
                      fontSize: '28px',
                      fontWeight: 800,
                      color: '#EF4444',
                      opacity: 0.6,
                    }}
                  >
                    ANAQIO
                  </span>
                </div>
                <div className="dont-label">✕ Wrong Color</div>
                <div className="dont-desc">
                  Never apply solid non-brand colors. The wordmark must always
                  use the gradient or approved mono versions.
                </div>
              </div>
              <div className="dont-card">
                <div className="dont-visual">
                  <span
                    style={{
                      fontFamily: 'Syne,sans-serif',
                      fontSize: '28px',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg,#3F57AF,#6F47A7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transform: 'skewX(-12deg)',
                      display: 'block',
                    }}
                  >
                    ANAQIO
                  </span>
                </div>
                <div className="dont-label">✕ Skew / Distort</div>
                <div className="dont-desc">
                  Never stretch, skew, rotate, or otherwise distort the
                  proportions of the logo.
                </div>
              </div>
              <div className="dont-card">
                <div
                  className="dont-visual"
                  style={{
                    background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
                    borderRadius: '8px',
                    width: '100%',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Syne,sans-serif',
                      fontSize: '28px',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg,#3F57AF,#6F47A7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ANAQIO
                  </span>
                </div>
                <div className="dont-label">✕ Gradient on Gradient</div>
                <div className="dont-desc">
                  Never place the gradient wordmark on a gradient background.
                  Use the white version instead.
                </div>
              </div>
            </div>
          </section>

          <section className="brand-section" id="colors">
            <div className="section-label">02 · Color System</div>
            <h2 className="section-title">Brand Palette</h2>
            <p className="section-desc">
              Three primary colors registered with OMPIC as part of the
              trademark filing, extended into a full spectrum including
              gradients, surface tones, and semantic states.
            </p>

            <div className="color-palette-main">
              <div className="color-swatch">
                <div
                  className="color-swatch-block tall"
                  style={{ background: '#2563EB' }}
                >
                  <span className="ompic-badge">
                    <svg viewBox="0 0 12 12" fill="currentColor">
                      <circle cx={6} cy={6} r={5} fill="white" opacity="0.3" />
                      <path
                        d="M4 6l2 2 4-4"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    OMPIC Registered
                  </span>
                </div>
                <div className="color-swatch-info">
                  <div className="color-name">Anaqio Blue</div>
                  <div className="color-values">
                    <div className="color-value">
                      <strong>HEX</strong> #2563EB
                    </div>
                    <div className="color-value">
                      <strong>RGB</strong> 37, 99, 235
                    </div>
                    <div className="color-value">
                      <strong>HSL</strong> 221°, 83%, 53%
                    </div>
                    <div className="color-value">
                      <strong>CMYK</strong> 84, 58, 0, 8
                    </div>
                    <div className="color-value">
                      <strong>Pantone</strong> 2728 C (approx.)
                    </div>
                  </div>
                </div>
              </div>
              <div className="color-swatch">
                <div
                  className="color-swatch-block tall"
                  style={{ background: '#7C3AED' }}
                >
                  <span className="ompic-badge">
                    <svg viewBox="0 0 12 12" fill="currentColor">
                      <circle cx={6} cy={6} r={5} fill="white" opacity="0.3" />
                      <path
                        d="M4 6l2 2 4-4"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    OMPIC Registered
                  </span>
                </div>
                <div className="color-swatch-info">
                  <div className="color-name">Anaqio Violet</div>
                  <div className="color-values">
                    <div className="color-value">
                      <strong>HEX</strong> #7C3AED
                    </div>
                    <div className="color-value">
                      <strong>RGB</strong> 124, 58, 237
                    </div>
                    <div className="color-value">
                      <strong>HSL</strong> 263°, 83%, 58%
                    </div>
                    <div className="color-value">
                      <strong>CMYK</strong> 48, 76, 0, 7
                    </div>
                    <div className="color-value">
                      <strong>Pantone</strong> 2665 C (approx.)
                    </div>
                  </div>
                </div>
              </div>
              <div className="color-swatch">
                <div
                  className="color-swatch-block tall"
                  style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
                >
                  <span
                    className="ompic-badge"
                    style={{
                      color: 'var(--aq-slate)',
                      background: 'rgba(0,0,0,0.06)',
                      borderColor: 'rgba(0,0,0,0.1)',
                    }}
                  >
                    <svg viewBox="0 0 12 12" fill="currentColor">
                      <circle cx={6} cy={6} r={5} fill="black" opacity="0.15" />
                      <path
                        d="M4 6l2 2 4-4"
                        stroke="var(--aq-slate)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    OMPIC Registered
                  </span>
                </div>
                <div className="color-swatch-info">
                  <div className="color-name">Anaqio White</div>
                  <div className="color-values">
                    <div className="color-value">
                      <strong>HEX</strong> #F8FAFC
                    </div>
                    <div className="color-value">
                      <strong>RGB</strong> 248, 250, 252
                    </div>
                    <div className="color-value">
                      <strong>HSL</strong> 210°, 40%, 98%
                    </div>
                    <div className="color-value">
                      <strong>CMYK</strong> 2, 1, 0, 1
                    </div>
                    <div className="color-value">
                      <strong>Use</strong> Backgrounds, text on dark
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                margin: '40px 0 16px',
                color: 'var(--aq-ink)',
              }}
            >
              Extended Palette
            </h3>
            <div className="extended-palette">
              <div className="ext-swatch">
                <div
                  className="ext-color"
                  style={{ background: '#DBEAFE', border: '1px solid #BFDBFE' }}
                />
                <div className="ext-info">
                  <div className="ext-name">Blue 100</div>
                  <div className="ext-hex">#DBEAFE</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#93C5FD' }} />
                <div className="ext-info">
                  <div className="ext-name">Blue 300</div>
                  <div className="ext-hex">#93C5FD</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#2563EB' }} />
                <div className="ext-info">
                  <div className="ext-name">Blue 600 ★</div>
                  <div className="ext-hex">#2563EB</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#1D4ED8' }} />
                <div className="ext-info">
                  <div className="ext-name">Blue 700</div>
                  <div className="ext-hex">#1D4ED8</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div
                  className="ext-color"
                  style={{ background: '#EDE9FE', border: '1px solid #DDD6FE' }}
                />
                <div className="ext-info">
                  <div className="ext-name">Violet 100</div>
                  <div className="ext-hex">#EDE9FE</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#A78BFA' }} />
                <div className="ext-info">
                  <div className="ext-name">Violet 400</div>
                  <div className="ext-hex">#A78BFA</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#7C3AED' }} />
                <div className="ext-info">
                  <div className="ext-name">Violet 600 ★</div>
                  <div className="ext-hex">#7C3AED</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#5B21B6' }} />
                <div className="ext-info">
                  <div className="ext-name">Violet 800</div>
                  <div className="ext-hex">#5B21B6</div>
                </div>
              </div>
            </div>

            <div className="extended-palette" style={{ marginTop: '8px' }}>
              <div className="ext-swatch">
                <div
                  className="ext-color"
                  style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
                />
                <div className="ext-info">
                  <div className="ext-name">White ★</div>
                  <div className="ext-hex">#F8FAFC</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#F1F5F9' }} />
                <div className="ext-info">
                  <div className="ext-name">Surface</div>
                  <div className="ext-hex">#F1F5F9</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#E2E8F0' }} />
                <div className="ext-info">
                  <div className="ext-name">Border</div>
                  <div className="ext-hex">#E2E8F0</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#94A3B8' }} />
                <div className="ext-info">
                  <div className="ext-name">Muted</div>
                  <div className="ext-hex">#94A3B8</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#334155' }} />
                <div className="ext-info">
                  <div className="ext-name">Slate</div>
                  <div className="ext-hex">#334155</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#0F172A' }} />
                <div className="ext-info">
                  <div className="ext-name">Ink</div>
                  <div className="ext-hex">#0F172A</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#10B981' }} />
                <div className="ext-info">
                  <div className="ext-name">Success</div>
                  <div className="ext-hex">#10B981</div>
                </div>
              </div>
              <div className="ext-swatch">
                <div className="ext-color" style={{ background: '#EF4444' }} />
                <div className="ext-info">
                  <div className="ext-name">Error</div>
                  <div className="ext-hex">#EF4444</div>
                </div>
              </div>
            </div>
          </section>

          <section className="brand-section" id="gradients">
            <div className="section-label">03 · Gradient System</div>
            <h2 className="section-title">The Brand Gradient</h2>
            <p className="section-desc">
              The signature gradient flows from Anaqio Blue through a rich
              mid-spectrum to Anaqio Violet. It is the most distinctive visual
              element of the brand.
            </p>

            <div className="gradient-strip" />
            <div className="gradient-stops">
              <div className="gradient-stop">
                <div
                  className="gradient-stop-color"
                  style={{ background: '#3F57AF' }}
                />
                <div className="gradient-stop-hex">#3F57AF</div>
                <div className="gradient-stop-pos">0%</div>
              </div>
              <div className="gradient-stop">
                <div
                  className="gradient-stop-color"
                  style={{ background: '#484DA9' }}
                />
                <div className="gradient-stop-hex">#484DA9</div>
                <div className="gradient-stop-pos">32%</div>
              </div>
              <div className="gradient-stop">
                <div
                  className="gradient-stop-color"
                  style={{ background: '#6049A8' }}
                />
                <div className="gradient-stop-hex">#6049A8</div>
                <div className="gradient-stop-pos">67%</div>
              </div>
              <div className="gradient-stop">
                <div
                  className="gradient-stop-color"
                  style={{ background: '#6F47A7' }}
                />
                <div className="gradient-stop-hex">#6F47A7</div>
                <div className="gradient-stop-pos">100%</div>
              </div>
            </div>

            <div className="gradient-cards">
              <div className="gradient-card">
                <div
                  className="gradient-card-vis"
                  style={{
                    background:
                      'linear-gradient(90deg,#3F57AF,#484DA9,#6049A8,#6F47A7)',
                  }}
                />
                <div className="gradient-card-info">
                  <div className="gradient-card-name">Horizontal (Primary)</div>
                  <div className="gradient-card-code">
                    linear-gradient(90deg,
                    <br />
                    #3F57AF, #484DA9,
                    <br />
                    #6049A8, #6F47A7)
                  </div>
                </div>
              </div>
              <div className="gradient-card">
                <div
                  className="gradient-card-vis"
                  style={{
                    background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
                  }}
                />
                <div className="gradient-card-info">
                  <div className="gradient-card-name">Diagonal (Vivid)</div>
                  <div className="gradient-card-code">
                    linear-gradient(135deg,
                    <br />
                    #2563EB,
                    <br />
                    #7C3AED)
                  </div>
                </div>
              </div>
              <div className="gradient-card">
                <div
                  className="gradient-card-vis"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 50%,#2563EB,#7C3AED)',
                  }}
                />
                <div className="gradient-card-info">
                  <div className="gradient-card-name">Radial (Glow)</div>
                  <div className="gradient-card-code">
                    radial-gradient(ellipse
                    <br />
                    at 30% 50%,
                    <br />
                    #2563EB, #7C3AED)
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="brand-section" id="typography">
            <div className="section-label">04 · Typography</div>
            <h2 className="section-title">Type System</h2>
            <p className="section-desc">
              Two fonts, one purpose: to feel both technically precise and
              creatively expressive — like Anaqio itself.
            </p>

            <div className="type-specimen">
              <div className="type-family-name">
                Display — Syne · Google Fonts (Free)
              </div>
              <div className="type-display-sample">
                Fashion meets
                <br />
                Intelligence.
              </div>
              <div
                className="type-body-sample"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: '16px',
                  color: 'var(--aq-slate)',
                  marginTop: '16px',
                }}
              >
                Syne is a geometric sans-serif with distinctive character —
                designed for editorial contexts. Its strong weight contrast and
                optical precision make it ideal for Anaqio's headings, wordmark
                weight, and display contexts.
              </div>
              <div
                className="type-weights"
                style={{ marginTop: '32px', flexWrap: 'wrap', gap: '16px' }}
              >
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 400,
                    }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">Regular 400</div>
                </div>
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                    }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">Medium 500</div>
                </div>
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                    }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">SemiBold 600</div>
                </div>
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                    }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">Bold 700</div>
                </div>
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                    }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">ExtraBold 800 ★</div>
                </div>
              </div>
            </div>

            <div className="type-specimen">
              <div className="type-family-name">
                Body — Plus Jakarta Sans · Google Fonts (Free)
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '40px',
                  fontWeight: 600,
                  color: 'var(--aq-ink)',
                  lineHeight: 1.1,
                  marginBottom: '16px',
                }}
              >
                The studio where
                <br />
                fashion is made.
              </div>
              <div className="type-body-sample">
                Plus Jakarta Sans is a contemporary grotesk typeface optimized
                for screens and UI. Its wide optical range — from 300 to 800
                weight — makes it versatile for body copy, labels, captions,
                interface text, and subheadings. It pairs with Syne's editorial
                weight without competing.
              </div>
              <div className="type-weights" style={{ marginTop: '32px' }}>
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">Light 300</div>
                </div>
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">Regular 400 ★</div>
                </div>
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">Medium 500</div>
                </div>
                <div className="type-weight">
                  <div
                    className="type-weight-sample"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
                  >
                    Aa
                  </div>
                  <div className="type-weight-label">SemiBold 600 ★</div>
                </div>
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                margin: '40px 0 16px',
                color: 'var(--aq-ink)',
              }}
            >
              Type Scale
            </h3>
            <div className="type-scale">
              <div className="type-scale-row">
                <div className="type-scale-token">--text-5xl</div>
                <div
                  className="type-scale-sample"
                  style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Display
                </div>
                <div className="type-scale-meta">48px / 800 / −0.02em</div>
              </div>
              <div className="type-scale-row">
                <div className="type-scale-token">--text-4xl</div>
                <div
                  className="type-scale-sample"
                  style={{ fontSize: '36px', fontWeight: 700 }}
                >
                  Heading 1
                </div>
                <div className="type-scale-meta">36px / 700 / −0.01em</div>
              </div>
              <div className="type-scale-row">
                <div className="type-scale-token">--text-3xl</div>
                <div
                  className="type-scale-sample"
                  style={{ fontSize: '28px', fontWeight: 700 }}
                >
                  Heading 2
                </div>
                <div className="type-scale-meta">28px / 700</div>
              </div>
              <div className="type-scale-row">
                <div className="type-scale-token">--text-2xl</div>
                <div
                  className="type-scale-sample"
                  style={{ fontSize: '22px', fontWeight: 600 }}
                >
                  Heading 3
                </div>
                <div className="type-scale-meta">22px / 600</div>
              </div>
              <div className="type-scale-row">
                <div className="type-scale-token">--text-xl</div>
                <div
                  className="type-scale-sample"
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Large Body
                </div>
                <div className="type-scale-meta">18px / 600</div>
              </div>
              <div className="type-scale-row">
                <div className="type-scale-token">--text-base</div>
                <div
                  className="type-scale-sample"
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Body text — readable and comfortable for longer content.
                </div>
                <div className="type-scale-meta">16px / 400 / 1.7</div>
              </div>
              <div className="type-scale-row">
                <div className="type-scale-token">--text-sm</div>
                <div
                  className="type-scale-sample"
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Small text for captions and secondary information.
                </div>
                <div className="type-scale-meta">14px / 400</div>
              </div>
              <div className="type-scale-row">
                <div className="type-scale-token">--text-xs</div>
                <div
                  className="type-scale-sample"
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  LABEL · CAPTION · TAG
                </div>
                <div className="type-scale-meta">12px / 500 / +0.12em</div>
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                margin: '40px 0 16px',
                color: 'var(--aq-ink)',
              }}
            >
              Monospace — JetBrains Mono
            </h3>
            <div className="mono-sample">
              <span className="cmt">{'/* Anaqio Design Tokens — CSS */'}</span>
              <br />
              <span className="kw">:root</span> {'{'}
              <br />
              &nbsp;&nbsp;<span className="prop">--aq-blue:</span>{' '}
              <span className="val">#2563EB</span>;{' '}
              <span className="cmt">{'/* OMPIC Colour 1 */'}</span>
              <br />
              &nbsp;&nbsp;<span className="prop">--aq-purple:</span>{' '}
              <span className="val">#7C3AED</span>;{' '}
              <span className="cmt">{'/* OMPIC Colour 2 */'}</span>
              <br />
              &nbsp;&nbsp;<span className="prop">--aq-white:</span>{' '}
              <span className="val">#F8FAFC</span>;{' '}
              <span className="cmt">{'/* OMPIC Colour 3 */'}</span>
              <br />
              &nbsp;&nbsp;<span className="prop">--font-display:</span>{' '}
              <span className="str">'Syne'</span>, sans-serif;
              <br />
              &nbsp;&nbsp;<span className="prop">--font-body:</span>{' '}
              <span className="str">'Plus Jakarta Sans'</span>, sans-serif;
              <br />
              {'}'}
            </div>
          </section>

          <section className="brand-section" id="spacing">
            <div className="section-label">05 · Spacing &amp; Grid</div>
            <h2 className="section-title">Spatial System</h2>
            <p className="section-desc">
              An 8-point base grid. All spacing values are multiples of 4px. The
              base unit is 8px — use it consistently to create rhythm and visual
              coherence.
            </p>

            <div className="spacing-row">
              <div className="spacing-token">--sp-xs</div>
              <div className="spacing-bar-wrap">
                <div className="spacing-bar" style={{ width: '4px' }} />
                <div className="spacing-value">4px</div>
              </div>
              <div className="spacing-usage">Icon padding, micro gaps</div>
            </div>
            <div className="spacing-row">
              <div className="spacing-token">--sp-sm</div>
              <div className="spacing-bar-wrap">
                <div className="spacing-bar" style={{ width: '8px' }} />
                <div className="spacing-value">8px</div>
              </div>
              <div className="spacing-usage">
                Between label and input, badge padding
              </div>
            </div>
            <div className="spacing-row">
              <div className="spacing-token">--sp-md</div>
              <div className="spacing-bar-wrap">
                <div className="spacing-bar" style={{ width: '16px' }} />
                <div className="spacing-value">16px</div>
              </div>
              <div className="spacing-usage">
                Card padding (sm), element gap
              </div>
            </div>
            <div className="spacing-row">
              <div className="spacing-token">--sp-lg</div>
              <div className="spacing-bar-wrap">
                <div className="spacing-bar" style={{ width: '24px' }} />
                <div className="spacing-value">24px</div>
              </div>
              <div className="spacing-usage">
                Card padding, section inner gap
              </div>
            </div>
            <div className="spacing-row">
              <div className="spacing-token">--sp-xl</div>
              <div className="spacing-bar-wrap">
                <div className="spacing-bar" style={{ width: '32px' }} />
                <div className="spacing-value">32px</div>
              </div>
              <div className="spacing-usage">
                Section header gap, grid column gap
              </div>
            </div>
            <div className="spacing-row">
              <div className="spacing-token">--sp-2xl</div>
              <div className="spacing-bar-wrap">
                <div className="spacing-bar" style={{ width: '48px' }} />
                <div className="spacing-value">48px</div>
              </div>
              <div className="spacing-usage">
                Intra-section spacing, card groups
              </div>
            </div>
            <div className="spacing-row">
              <div className="spacing-token">--sp-3xl</div>
              <div className="spacing-bar-wrap">
                <div className="spacing-bar" style={{ width: '64px' }} />
                <div className="spacing-value">64px</div>
              </div>
              <div className="spacing-usage">Between major sections</div>
            </div>
            <div className="spacing-row">
              <div className="spacing-token">--sp-4xl</div>
              <div className="spacing-bar-wrap">
                <div className="spacing-bar" style={{ width: '96px' }} />
                <div className="spacing-value">96px</div>
              </div>
              <div className="spacing-usage">
                Hero and section vertical padding
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                margin: '40px 0 16px',
                color: 'var(--aq-ink)',
              }}
            >
              Border Radius
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--aq-gradient-diag)',
                    borderRadius: '4px',
                    margin: '0 auto 8px',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--aq-muted)',
                  }}
                >
                  --r-sm
                  <br />
                  4px
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    background: 'var(--aq-gradient-diag)',
                    borderRadius: '8px',
                    margin: '0 auto 8px',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--aq-muted)',
                  }}
                >
                  --r-md
                  <br />
                  8px
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--aq-gradient-diag)',
                    borderRadius: '12px',
                    margin: '0 auto 8px',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--aq-muted)',
                  }}
                >
                  --r-lg
                  <br />
                  12px
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '88px',
                    height: '88px',
                    background: 'var(--aq-gradient-diag)',
                    borderRadius: '16px',
                    margin: '0 auto 8px',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--aq-muted)',
                  }}
                >
                  --r-xl
                  <br />
                  16px
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '80px',
                    height: '40px',
                    background: 'var(--aq-gradient-diag)',
                    borderRadius: '999px',
                    margin: '0 auto 8px',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--aq-muted)',
                  }}
                >
                  --r-full
                  <br />
                  999px
                </div>
              </div>
            </div>
          </section>

          <section className="brand-section" id="components">
            <div className="section-label">06 · Components</div>
            <h2 className="section-title">UI Building Blocks</h2>
            <p className="section-desc">
              Core interface components showing how the Anaqio brand system
              translates into product UI elements.
            </p>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '16px',
                color: 'var(--aq-ink)',
              }}
            >
              Buttons
            </h3>
            <div className="comp-row">
              <a className="btn btn-primary">Join Waitlist</a>
              <a className="btn btn-secondary">Learn More</a>
              <a className="btn btn-ghost">Cancel</a>
              <a className="btn btn-primary btn-sm">Small CTA</a>
              <a className="btn btn-primary btn-lg">Get Early Access →</a>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                margin: '32px 0 16px',
                color: 'var(--aq-ink)',
              }}
            >
              Badges &amp; Tags
            </h3>
            <div className="comp-row">
              <span className="badge badge-blue">AI Studio</span>
              <span className="badge badge-purple">Fashion Tech</span>
              <span className="badge badge-gradient">Early Access</span>
              <span className="badge badge-blue">SaaS · Classe 42</span>
              <span
                className="badge"
                style={{ background: '#ECFDF5', color: '#065F46' }}
              >
                Active
              </span>
              <span
                className="badge"
                style={{ background: '#FEF2F2', color: '#991B1B' }}
              >
                Beta
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                margin: '32px 0 16px',
                color: 'var(--aq-ink)',
              }}
            >
              Form Inputs
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '32px',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
              }}
            >
              <div className="input-demo">
                <div className="input-label">Email Address</div>
                <input
                  className="input-field"
                  type="email"
                  placeholder="your@email.com"
                />
                <div className="input-label">Brand Name</div>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Your Fashion Brand"
                />
                <a
                  className="btn btn-primary"
                  style={{ justifyContent: 'center' }}
                >
                  Request Access
                </a>
              </div>
              <div className="card-demo">
                <div className="card-top">
                  <div className="card-top-label">AI Lookbook</div>
                </div>
                <div className="card-body">
                  <p>
                    Generate editorial-quality lookbooks in minutes using
                    Anaqio's AI virtual studio.
                  </p>
                  <a className="btn btn-primary btn-sm">Generate Now</a>
                </div>
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                margin: '40px 0 16px',
                color: 'var(--aq-ink)',
              }}
            >
              Gradient Text Usage
            </h3>
            <div
              style={{
                background: 'var(--aq-surface)',
                border: '1px solid var(--aq-border)',
                borderRadius: 'var(--r-xl)',
                padding: '40px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '48px',
                  fontWeight: 800,
                  background: 'var(--aq-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.1,
                  marginBottom: '12px',
                }}
              >
                Virtual Studio.
                <br />
                Real Commerce.
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: 'var(--aq-slate)',
                  maxWidth: '400px',
                }}
              >
                Anaqio's gradient text is reserved for{' '}
                <strong style={{ color: 'var(--aq-ink)' }}>
                  hero headings, brand moments, and key CTAs
                </strong>
                . Use sparingly — maximum one gradient text element per screen.
              </div>
            </div>
          </section>

          <section className="brand-section" id="tokens">
            <div className="section-label">07 · Design Tokens</div>
            <h2 className="section-title">CSS Token Reference</h2>
            <p className="section-desc">
              Copy these CSS variables into your project's root stylesheet. All
              components and styles in Anaqio's system are built from these
              tokens.
            </p>

            <table className="token-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      --aq-blue
                    </code>
                  </td>
                  <td>
                    <div className="token-chip">
                      <div
                        className="token-dot"
                        style={{ background: '#2563EB' }}
                      />
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                        }}
                      >
                        #2563EB
                      </code>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--aq-slate)' }}>
                    Primary actions, links, focus states
                  </td>
                </tr>
                <tr>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      --aq-purple
                    </code>
                  </td>
                  <td>
                    <div className="token-chip">
                      <div
                        className="token-dot"
                        style={{ background: '#7C3AED' }}
                      />
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                        }}
                      >
                        #7C3AED
                      </code>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--aq-slate)' }}>
                    Gradient endpoint, accents, highlights
                  </td>
                </tr>
                <tr>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      --aq-white
                    </code>
                  </td>
                  <td>
                    <div className="token-chip">
                      <div
                        className="token-dot"
                        style={{
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                        }}
                      />
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                        }}
                      >
                        #F8FAFC
                      </code>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--aq-slate)' }}>
                    Page background, text on dark
                  </td>
                </tr>
                <tr>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      --aq-ink
                    </code>
                  </td>
                  <td>
                    <div className="token-chip">
                      <div
                        className="token-dot"
                        style={{ background: '#0F172A' }}
                      />
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                        }}
                      >
                        #0F172A
                      </code>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--aq-slate)' }}>
                    Primary text, dark backgrounds
                  </td>
                </tr>
                <tr>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      --aq-slate
                    </code>
                  </td>
                  <td>
                    <div className="token-chip">
                      <div
                        className="token-dot"
                        style={{ background: '#334155' }}
                      />
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                        }}
                      >
                        #334155
                      </code>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--aq-slate)' }}>
                    Secondary text, body copy
                  </td>
                </tr>
                <tr>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      --aq-muted
                    </code>
                  </td>
                  <td>
                    <div className="token-chip">
                      <div
                        className="token-dot"
                        style={{ background: '#94A3B8' }}
                      />
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                        }}
                      >
                        #94A3B8
                      </code>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--aq-slate)' }}>
                    Placeholders, labels, metadata
                  </td>
                </tr>
                <tr>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      --aq-border
                    </code>
                  </td>
                  <td>
                    <div className="token-chip">
                      <div
                        className="token-dot"
                        style={{ background: '#E2E8F0' }}
                      />
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                        }}
                      >
                        #E2E8F0
                      </code>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--aq-slate)' }}>
                    Card borders, dividers, separators
                  </td>
                </tr>
                <tr>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      --aq-surface
                    </code>
                  </td>
                  <td>
                    <div className="token-chip">
                      <div
                        className="token-dot"
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                        }}
                      />
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                        }}
                      >
                        #F1F5F9
                      </code>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--aq-slate)' }}>
                    Card backgrounds, input fills
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="brand-section" id="trademark">
            <div className="section-label">08 · Trademark &amp; Legal</div>
            <h2 className="section-title">Trademark Status</h2>
            <p className="section-desc">
              The Anaqio name and mark are filed with OMPIC under Moroccan
              trademark law. The following details must appear in all legal
              documents referencing the brand.
            </p>

            <div className="trademark-notice">
              <div className="tm-icon">™</div>
              <div>
                <div className="tm-title">OMPIC Trademark Filing — ANAQIO</div>
                <div className="tm-details">
                  <div className="tm-row">
                    <span className="tm-key">Filing Ref.</span>
                    <span className="tm-val">PR-237456</span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Procedure</span>
                    <span className="tm-val">Récapitulatif de Démarche</span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Mark Type</span>
                    <span className="tm-val">Mixte (verbal + figurative)</span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Verbal Element</span>
                    <span className="tm-val">ANAQIO</span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Nice Class</span>
                    <span className="tm-val">42 — Logiciel-service [SaaS]</span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Filed</span>
                    <span className="tm-val">17 February 2026</span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Owner</span>
                    <span className="tm-val">
                      Amal Ait Oukharaz (physique, CIN KB152795)
                    </span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Country</span>
                    <span className="tm-val">Morocco (MAROC)</span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Filing Fee</span>
                    <span className="tm-val">1 250 DH TTC</span>
                  </div>
                  <div className="tm-row">
                    <span className="tm-key">Reg. Colors</span>
                    <span className="tm-val">#2563EB · #7C3AED · #F8FAFC</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '24px',
                background: 'rgba(37,99,235,0.04)',
                border: '1px solid var(--aq-border)',
                borderRadius: 'var(--r-lg)',
                padding: '24px 28px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--aq-ink)',
                  marginBottom: '10px',
                }}
              >
                Usage of ™ symbol
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--aq-slate)',
                  lineHeight: 1.7,
                }}
              >
                While the trademark application is pending with OMPIC, use{' '}
                <strong style={{ color: 'var(--aq-ink)' }}>™</strong> after the
                wordmark. Once registration is confirmed, upgrade to{' '}
                <strong style={{ color: 'var(--aq-ink)' }}>®</strong>. The ™
                symbol should appear in superscript at 60% opacity in brand
                contexts, at full size in legal and footer contexts.
              </p>
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  gap: '32px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--aq-muted)',
                      marginBottom: '8px',
                    }}
                  >
                    Pending registration
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '28px',
                      fontWeight: 800,
                      background: 'var(--aq-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    ANAQIO
                    <sup
                      style={{
                        WebkitTextFillColor: 'var(--aq-muted)',
                        fontSize: '14px',
                        background: 'none',
                        WebkitBackgroundClip: 'unset',
                      }}
                    >
                      ™
                    </sup>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--aq-muted)',
                      marginBottom: '8px',
                    }}
                  >
                    After registration
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '28px',
                      fontWeight: 800,
                      background: 'var(--aq-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    ANAQIO
                    <sup
                      style={{
                        WebkitTextFillColor: 'var(--aq-muted)',
                        fontSize: '14px',
                        background: 'none',
                        WebkitBackgroundClip: 'unset',
                      }}
                    >
                      ®
                    </sup>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="brand-footer">
          <div className="brand-footer-logo">ANAQIO™</div>
          <div className="brand-footer-copy">
            Visual Brand Identity Guidelines v1.0 · 2026 · Confidential
            <br />
            Trademark filed with OMPIC — PR-237456 · Class 42 SaaS · Casablanca,
            Morocco
          </div>
        </div>
      </div>
    </>
  );
}
