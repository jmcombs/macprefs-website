import React from 'react';

export interface FeatureItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** codicon name (host must load @vscode/codicons). */
  icon?: string;
  /** Catppuccin Latte accent name for the icon medallion. */
  accent?: string;
  title?: React.ReactNode;
  /** "See more"-style link label; omit to hide. */
  linkText?: string;
  linkHref?: string;
  align?: 'left' | 'center';
  children?: React.ReactNode;
}

export function FeatureItem(props: FeatureItemProps): JSX.Element;
