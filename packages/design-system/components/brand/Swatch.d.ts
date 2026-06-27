import React from 'react';

export type SwatchSize = 'sm' | 'md' | 'lg';
export type SwatchShape = 'rounded' | 'square' | 'circle';

export interface SwatchProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Any CSS color or var() (overrides hex for display). */
  color?: string;
  /** Display label. */
  name?: string;
  /** Hex string, shown in mono and copied on click when copyable. */
  hex?: string;
  size?: SwatchSize;
  shape?: SwatchShape;
  /** Copy hex to clipboard on click. */
  copyable?: boolean;
}

export function Swatch(props: SwatchProps): JSX.Element;
