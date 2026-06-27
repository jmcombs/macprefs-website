import React from 'react';

/**
 * Netservant — CodeBlock & Tok
 * A syntax-highlighted code surface with optional filename chrome,
 * line numbers, and a window-dot header. `Tok` colors a span by token kind.
 */

const KIND = {
  comment: 'var(--syntax-comment)',
  keyword: 'var(--syntax-keyword)',
  string: 'var(--syntax-string)',
  number: 'var(--syntax-number)',
  constant: 'var(--syntax-constant)',
  function: 'var(--syntax-function)',
  type: 'var(--syntax-type)',
  variable: 'var(--syntax-variable)',
  parameter: 'var(--syntax-parameter)',
  operator: 'var(--syntax-operator)',
  tag: 'var(--syntax-tag)',
  attribute: 'var(--syntax-attribute)',
  property: 'var(--syntax-property)',
  punctuation: 'var(--syntax-punctuation)',
  escape: 'var(--syntax-escape)',
  regexp: 'var(--syntax-regexp)',
  macro: 'var(--syntax-macro)',
};

export function Tok({ kind = 'variable', italic, bold, children, style = {} }) {
  return (
    <span style={{
      color: KIND[kind] || 'var(--text-primary)',
      fontStyle: italic || kind === 'comment' ? 'italic' : 'normal',
      fontWeight: bold ? 'var(--weight-bold)' : 'inherit',
      ...style,
    }}>{children}</span>
  );
}

export function CodeBlock({
  filename,
  language,
  windowDots = false,
  lineNumbers = true,
  startLine = 1,
  lines,
  style = {},
  children,
  ...rest
}) {
  // `lines` may be an array of React nodes (one per row); else use children.
  const rows = lines || (typeof children === 'string' ? children.split('\n') : children);
  const rowArr = Array.isArray(rows) ? rows : [rows];

  return (
    <div style={{
      background: 'var(--surface-page)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      ...style,
    }} {...rest}>
      {(filename || windowDots) ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: '9px 14px', background: 'var(--surface-chrome)',
          borderBottom: '1px solid var(--border)',
        }}>
          {windowDots ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--latte-red)' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--latte-yellow)' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--latte-green)' }} />
            </div>
          ) : null}
          {filename ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{filename}</span> : null}
          {language ? <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>{language}</span> : null}
        </div>
      ) : null}
      <pre style={{
        margin: 0, padding: '14px 0', overflowX: 'auto',
        fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 'var(--leading-code)',
        color: 'var(--text-primary)',
      }}>
        {rowArr.map((row, i) => (
          <div key={i} style={{ display: 'flex', padding: '0 16px', minHeight: '1.6em' }}>
            {lineNumbers ? (
              <span style={{
                flex: 'none', width: 30, marginRight: 16, textAlign: 'right',
                color: 'var(--latte-overlay1)', userSelect: 'none',
              }}>{startLine + i}</span>
            ) : null}
            <span style={{ whiteSpace: 'pre' }}>{row}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
