import React from 'react';

/**
 * Netservant — Swatch
 * A palette color chip. On-brand atom for docs, pickers, and the theme's
 * own marketing. Shows color, name, hex; optional copy-on-click.
 */
export function Swatch({
  color,
  name,
  hex,
  size = 'md',
  shape = 'rounded',
  copyable = false,
  style = {},
  ...rest
}) {
  const resolved = color || (hex ? hex : 'var(--accent)');
  const sizes = {
    sm: { sw: 32, font: 11, hexFont: 10 },
    md: { sw: 44, font: 12, hexFont: 11 },
    lg: { sw: 64, font: 13, hexFont: 12 },
  };
  const s = sizes[size] || sizes.md;
  const radius = shape === 'circle' ? '50%' : shape === 'square' ? 'var(--radius-xs)' : 'var(--radius-sm)';

  const onClick = (e) => {
    if (copyable && hex && navigator.clipboard) navigator.clipboard.writeText(hex);
    if (rest.onClick) rest.onClick(e);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 6, cursor: copyable ? 'pointer' : 'default', ...style }}
      {...rest}
      onClick={onClick}
    >
      <div style={{
        width: '100%', minWidth: s.sw, height: s.sw,
        background: resolved, borderRadius: radius,
        boxShadow: 'var(--shadow-xs)', border: '1px solid rgba(76,79,105,0.08)',
      }} />
      {(name || hex) ? (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
          {name ? <span style={{ fontFamily: 'var(--font-ui)', fontSize: s.font, fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>{name}</span> : null}
          {hex ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: s.hexFont, color: 'var(--text-tertiary)' }}>{hex}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
