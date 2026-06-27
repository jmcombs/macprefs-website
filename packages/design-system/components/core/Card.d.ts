import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Chrome header title (renders a crust header bar). */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned node in the header. */
  headerRight?: React.ReactNode;
  /** Show a 3px accent rail across the top. */
  accentRail?: boolean;
  /** Rail / accent color (any CSS color or var). Default Path Blue. */
  accent?: string;
  /** Body padding (CSS value). */
  padding?: string;
  /** Hover elevation for clickable cards. */
  interactive?: boolean;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
