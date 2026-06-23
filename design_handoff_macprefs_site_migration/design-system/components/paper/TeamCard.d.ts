import React from 'react';

export interface TeamSocial {
  /** codicon name (host must load @vscode/codicons). */
  icon: string;
  href?: string;
}

export interface TeamCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Round avatar node (Avatar / image / placeholder). */
  avatar?: React.ReactNode;
  name?: React.ReactNode;
  role?: React.ReactNode;
  /** Catppuccin Latte accent for the role label + socials. */
  accent?: string;
  socials?: TeamSocial[];
  raised?: boolean;
  /** The quote / bio. */
  children?: React.ReactNode;
}

export function TeamCard(props: TeamCardProps): JSX.Element;
