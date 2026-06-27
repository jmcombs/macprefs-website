import React from 'react';

export type PaperButtonVariant = 'fill' | 'neutral' | 'outline' | 'link';
export type PaperButtonSize = 'sm' | 'md' | 'lg';
export type PaperAccent =
  | 'path' | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';

/**
 * Rounded "paper" pill button — Paper Kit shape, Netservant palette.
 * @startingPoint section="Paper Kit" subtitle="Rounded paper pill buttons in every variant" viewport="700x150"
 */
export interface PaperButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PaperButtonVariant;
  size?: PaperButtonSize;
  /** 'path' = Path Blue (default), or any Catppuccin Latte accent name. */
  accent?: PaperAccent;
  /** Full pill radius (default) vs paper radius. */
  round?: boolean;
  uppercase?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  block?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function PaperButton(props: PaperButtonProps): JSX.Element;
