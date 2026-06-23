import React from 'react';

/**
 * Netservant — CommandBox
 * A "Terminal window" CLI box for docs/marketing (e.g. install pages).
 * Authentic dark terminal regardless of page theme. Copy button included.
 *
 * `commands` is an array of lines:
 *   - normal line            → rendered as a command with a Path-Blue `$` prompt
 *   - line starting with `#` → rendered as a dimmed comment
 *   - line indented (2+ spaces / tab) → rendered as dimmed command output
 * Or pass `children` for full control.
 */
export function CommandBox({
  title = 'Terminal window',
  commands = [],
  copyable = true,
  prompt = '$',
  style = {},
  children,
  ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const copyText = commands
    .filter((c) => !c.trim().startsWith('#') && !/^(\s)/.test(c))
    .join('\n');
  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };
  const dot = (c) => ({ width: 11, height: 11, borderRadius: '50%', background: c, flex: 'none' });

  return (
    <div style={{
      background: '#1e1e2e', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      boxShadow: 'var(--shadow-md)', border: '1px solid rgba(205,214,244,0.08)',
      fontFamily: 'var(--font-mono)', ...style,
    }} {...rest}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#181825', borderBottom: '1px solid rgba(205,214,244,0.07)' }}>
        <span style={dot('#f38ba8')} /><span style={dot('#f9e2af')} /><span style={dot('#a6e3a1')} />
        <span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 12, color: '#9399b2', pointerEvents: 'none' }}>{title}</span>
        {copyable ? (
          <button onClick={copy} style={{ marginLeft: 'auto', zIndex: 1, background: 'transparent', border: 0, color: copied ? '#a6e3a1' : '#9399b2', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <i className={`codicon codicon-${copied ? 'check' : 'copy'}`} style={{ fontSize: 13 }} />{copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div style={{ padding: '14px 16px', fontSize: 13.5, lineHeight: 1.7, color: '#cdd6f4', overflowX: 'auto' }}>
        {children || commands.map((c, i) => {
          if (c.trim().startsWith('#')) return <div key={i} style={{ color: '#6c7086', whiteSpace: 'pre' }}>{c}</div>;
          if (/^(\s)/.test(c)) return <div key={i} style={{ color: '#9399b2', whiteSpace: 'pre' }}>{c}</div>;
          return <div key={i} style={{ whiteSpace: 'pre' }}><span style={{ color: '#7aa2d6', userSelect: 'none' }}>{prompt} </span>{c}</div>;
        })}
      </div>
    </div>
  );
}
