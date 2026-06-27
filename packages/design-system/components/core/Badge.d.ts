import React from 'react';

export type BadgeTone =
  | 'neutral' | 'accent' | 'success' | 'warning' | 'error' | 'info'
  | 'mauve' | 'peach' | 'pink' | 'lavender';
export type BadgeVariant = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic / palette color. */
  tone?: BadgeTone;
  /** Fill treatment. */
  variant?: BadgeVariant;
  /** Leading status dot. */
  dot?: boolean;
  size?: BadgeSize;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
