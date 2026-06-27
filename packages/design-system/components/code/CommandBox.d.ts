import React from 'react';

export interface CommandBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title (Starlight-style). Default "Terminal window". */
  title?: string;
  /**
   * CLI lines. Normal line → command with `$` prompt; line starting with `#`
   * → dimmed comment; indented line → dimmed output.
   * @startingPoint section="Docs" subtitle="Terminal-window CLI box for install/docs pages" viewport="700x220"
   */
  commands?: string[];
  /** Show the copy button. */
  copyable?: boolean;
  /** Prompt glyph (default "$"). */
  prompt?: string;
  children?: React.ReactNode;
}

export function CommandBox(props: CommandBoxProps): JSX.Element;
