import type { ElementType } from 'react';

/** A content item pairing display text with an icon component. */
export type IconItem = {
  readonly text: string;
  readonly icon: ElementType;
};

/** A feature/benefit card entry used in FeatureCard grids. */
export type FeatureItem = {
  readonly title: string;
  readonly body: string;
  readonly icon: ElementType;
};
