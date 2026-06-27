import React from 'react';

/**
 * Netservant × Paper Kit — PaperButton
 * The rounded "paper" pill button: full-radius by default, soft lift on hover.
 * Paper Kit shapes (pill, uppercase, tracking) + Netservant palette.
 */
export function PaperButton({
  variant = 'fill',
  size = 'md',
  accent = 'path',            // 'path' = Path Blue, or any Catppuccin Latte name
  round = true,
  uppercase = true,
  iconLeft,
  iconRight,
  block = false,
  disabled = false,
  type = 'button',
  style = {},
  children,
  ...rest
}) {
  const color = accent === 'path' ? 'var(--accent)' : `var(--latte-${accent}, ${accent})`;
  const colorHover = accent === 'path' ? 'var(--accent-hover)' : `color-mix(in srgb, ${color} 82%, black)`;

  const sizes = {
    sm: { padding: '7px 18px', fontSize: 12, gap: 7 },
    md: { padding: '11px 26px', fontSize: 13.5, gap: 8 },
    lg: { padding: '15px 36px', fontSize: 15, gap: 10 },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    fontFamily: 'var(--font-ui)',
    fontSize: s.fontSize,
    fontWeight: 'var(--weight-semibold)',
    lineHeight: 1.2,
    textTransform: uppercase ? 'uppercase' : 'none',
    letterSpacing: uppercase ? '0.06em' : '0',
    border: '2px solid transparent',
    borderRadius: round ? 'var(--radius-full)' : 'var(--radius-paper)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const variants = {
    fill:    { background: color, color: 'var(--accent-fg)', borderColor: color, boxShadow: 'var(--shadow-sm)' },
    neutral: { background: 'var(--surface-page)', color, borderColor: 'transparent', boxShadow: 'var(--shadow-paper)' },
    outline: { background: 'transparent', color, borderColor: color, boxShadow: 'none' },
    link:    { background: 'transparent', color, borderColor: 'transparent', boxShadow: 'none', padding: s.padding.replace(/\d+px$/, '6px') },
  };

  const hovers = {
    fill:    { background: colorHover, borderColor: colorHover, boxShadow: 'var(--shadow-paper)', transform: 'translateY(-2px)' },
    neutral: { boxShadow: 'var(--shadow-paper-hover)', transform: 'translateY(-2px)' },
    outline: { background: `color-mix(in srgb, ${color} 10%, transparent)`, transform: 'translateY(-1px)' },
    link:    { color: colorHover, transform: 'none' },
  };

  const v = variants[variant] || variants.fill;
  const enter = (e) => { if (!disabled) Object.assign(e.currentTarget.style, hovers[variant] || {}); };
  const leave = (e) => { if (!disabled) Object.assign(e.currentTarget.style, v); };
  const down = (e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(0) scale(0.98)'; };
  const up = (e) => { if (!disabled) e.currentTarget.style.transform = (hovers[variant] || {}).transform || 'none'; };

  return (
    <button type={type} disabled={disabled} style={{ ...base, ...v, ...style }}
      onMouseEnter={enter} onMouseLeave={leave} onMouseDown={down} onMouseUp={up} {...rest}>
      {iconLeft ? <span style={{ display: 'inline-flex' }}>{iconLeft}</span> : null}
      {children}
      {iconRight ? <span style={{ display: 'inline-flex' }}>{iconRight}</span> : null}
    </button>
  );
}
