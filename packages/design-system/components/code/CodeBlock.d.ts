import React from 'react';

export type TokenKind =
  | 'comment' | 'keyword' | 'string' | 'number' | 'constant' | 'function'
  | 'type' | 'variable' | 'parameter' | 'operator' | 'tag' | 'attribute'
  | 'property' | 'punctuation' | 'escape' | 'regexp' | 'macro';

export interface TokProps {
  /** Syntax kind → color from the theme. */
  kind?: TokenKind;
  italic?: boolean;
  bold?: boolean;
  children?: React.ReactNode;
}

/**
 * Syntax-highlighted code surface with optional filename chrome.
 * @startingPoint section="Code" subtitle="Code block with Netservant syntax colors" viewport="700x260"
 */
export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Filename shown in the chrome header. */
  filename?: string;
  /** Language label (top-right of header). */
  language?: string;
  /** Show macOS-style window dots. */
  windowDots?: boolean;
  lineNumbers?: boolean;
  startLine?: number;
  /** Array of rows (each a node). Falls back to children. */
  lines?: React.ReactNode[];
  children?: React.ReactNode;
}

/** Color a code span by token kind. */
export function Tok(props: TokProps): JSX.Element;

export function CodeBlock(props: CodeBlockProps): JSX.Element;
