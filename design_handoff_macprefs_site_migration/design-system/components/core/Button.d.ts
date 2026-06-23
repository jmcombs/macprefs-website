import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Catppuccin Latte accent name (recolors primary/soft/ghost/outline) */
export type AccentName =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

/**
 * Path-blue action button in every variant & size.
 * @startingPoint section="Core" subtitle="Path-blue buttons in every variant & size" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual treatment.
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional palette accent override (defaults to Path Blue). */
  accent?: AccentName;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
