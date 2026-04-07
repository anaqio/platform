/**
 * Network Information API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
export interface NetworkInformation extends EventTarget {
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g' | string;
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  onchange?: EventListener;
}

/**
 * Extended Navigator interface to include non-standard/experimental properties
 * used for device capability detection.
 */
export interface NavigatorWithCapabilities extends Navigator {
  readonly deviceMemory?: number;
  readonly connection?: NetworkInformation;
}
