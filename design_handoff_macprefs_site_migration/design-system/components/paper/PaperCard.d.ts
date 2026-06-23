import React from 'react';

export interface PaperCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Catppuccin Latte accent name for a soft pastel tint background. */
  tint?: string;
  /** Node rendered flush at the top (image / placeholder). */
  media?: React.ReactNode;
  /** Soft paper shadow (default) vs flat bordered. */
  raised?: boolean;
  interactive?: boolean;
  align?: 'left' | 'center' | 'right';
  padding?: string;
  children?: React.ReactNode;
}

export function PaperCard(props: PaperCardProps): JSX.Element;
