/**
 * Analytics utility for Google Analytics (GA4) and GTM
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Domain allow-list for cross-domain tracking (Linker)
 * Matches:
 * - ^([a-z0-9-]+\.)?vusercontent\.net$
 * - ^([a-z0-9-]+\.)?vercel\.app$
 * - anaqio.com and *.anaqio.com
 */
export const ALLOWED_DOMAINS = ['anaqio.com', 'vercel.app', 'vusercontent.net'];

export const DOMAIN_REGEX = {
  vusercontent: /^([a-z0-9-]+\.)?vusercontent\.net$/,
  vercel: /^([a-z0-9-]+\.)?vercel\.app$/,
  anaqio: /^([a-z0-9-]+\.)?anaqio\.com$/,
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      linker: {
        domains: ALLOWED_DOMAINS,
      },
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (action: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

/**
 * Helper to mask PII (Personally Identifiable Information) before sending to GA
 * It's generally against GA Terms of Service to send raw emails/names.
 */
const maskPII = (value: string) => {
  if (!value) return '';
  // Simple "masking" for GA - you might want to use a real SHA-256 hash if needed
  // For now, we'll just send a placeholder or "hashed" version if it looks like an email
  if (value.includes('@')) {
    const [local, domain] = value.split('@');
    return `${local.substring(0, 1)}***@${domain}`;
  }
  return value.length > 2 ? `${value.substring(0, 2)}***` : '***';
};

// Common tracking methods for user behavior
export const trackUserBehavior = {
  // Track button clicks
  trackClick: (label: string, category: string = 'engagement') => {
    event('click', {
      event_category: category,
      event_label: label,
    });
  },

  // Track form submissions with details
  trackFormSubmit: (formName: string, formData?: Record<string, string>) => {
    const trackingData: Record<string, unknown> = {
      event_category: 'conversion',
      event_label: formName,
    };

    if (formData) {
      // Map form fields to GA parameters (masking PII)
      Object.entries(formData).forEach(([key, value]) => {
        if (['email', 'full_name', 'name'].includes(key)) {
          trackingData[`form_field_${key}`] = maskPII(value);
        } else {
          trackingData[`form_field_${key}`] = value;
        }
      });
    }

    event('form_submission', trackingData);
  },

  // Track sections viewed
  trackSectionView: (sectionId: string) => {
    event('section_view', {
      event_category: 'engagement',
      event_label: sectionId,
    });
  },
};

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: ControlParams | EventParams | ConfigParams | CustomParams
    ) => void;
  }
}

// Minimal types for gtag
interface ControlParams {
  groups?: string | string[];
  send_to?: string | string[];
  event_callback?: () => void;
  event_timeout?: number;
}

interface EventParams {
  checkout_option?: string;
  checkout_step?: number;
  content_id?: string;
  content_type?: string;
  coupon?: string;
  currency?: string;
  description?: string;
  fatal?: boolean;
  items?: unknown[];
  method?: string;
  number?: string;
  page_title?: string;
  page_location?: string;
  page_path?: string;
  promotion_id?: string;
  promotion_name?: string;
  screen_name?: string;
  search_term?: string;
  shipping?: number;
  tax?: number;
  transaction_id?: string;
  value?: number;
  event_category?: string;
  event_label?: string;
  non_interaction?: boolean;
  [key: string]: unknown;
}

interface ConfigParams {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  send_page_view?: boolean;
  [key: string]: unknown;
}

interface CustomParams {
  [key: string]: unknown;
}
