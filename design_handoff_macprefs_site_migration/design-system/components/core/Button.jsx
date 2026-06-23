import React from 'react';

/**
 * Netservant — Button
 * Path-blue primary, surface secondary, ghost, and a "spice" accent variant.
 * Editor-grade: small radii, calm transitions, Path Blue focus ring.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  accent,
  iconLeft,
  iconRight,
  disabled = false,
  type = 'button',
  style = {},
  children,
  ...rest
}) {
  const sizes = {
    sm: { padding: '5px 11px', fontSize: 13, height: 28, gap: 6 },
    md: { padding: '8px 15px', fontSize: 14, height: 34, gap: 8 },
    lg: { padding: '11px 20px', fontSize: 15, height: 42, gap: 9 },
  };
  const s = sizes[size] || sizes.md;

  // "accent" optionally recolors primary/soft variants to any palette color.
  const accentColor = accent ? `var(--latte-${accent}, ${accent})` : 'var(--accent)';
  const accentHover = accent ? `var(--latte-${accent}, ${accent})` : 'var(--accent-hover)';

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: 'var(--font-ui)',
    fontWeight: 'var(--weight-semibold)',
    lineHeight: 1,
    letterSpacing: 'var(--tracking-snug)',
    border: '1px solid transparent',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  const variants = {
    primary: { background: accentColor, color: 'var(--accent-fg)', borderColor: accentColor },
    secondary: { background: 'var(--surface-raised)', color: 'var(--text-primary)', borderColor: 'var(--border)' },
    ghost: { background: 'transparent', color: accentColor, borderColor: 'transparent' },
    soft: { background: `color-mix(in srgb, ${accentColor} 14%, transparent)`, color: accentColor, borderColor: 'transparent' },
    outline: { background: 'transparent', color: accentColor, borderColor: accentColor },
  };

  const hover = {
    primary: { background: accentHover, borderColor: accentHover },
    secondary: { background: 'var(--surface-raised-1)' },
    ghost: { background: `color-mix(in srgb, ${accentColor} 12%, transparent)` },
    soft: { background: `color-mix(in srgb, ${accentColor} 22%, transparent)` },
    outline: { background: `color-mix(in srgb, ${accentColor} 10%, transparent)` },
  };

  const onEnter = (e) => { if (!disabled) Object.assign(e.currentTarget.style, hover[variant] || {}); };
  const onLeave = (e) => { if (!disabled) Object.assign(e.currentTarget.style, variants[variant] || {}); };
  const onDown = (e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(0.5px) scale(0.99)'; };
  const onUp = (e) => { if (!disabled) e.currentTarget.style.transform = 'none'; };
  const onFocus = (e) => { e.currentTarget.style.boxShadow = 'var(--ring)'; };
  const onBlur = (e) => { e.currentTarget.style.boxShadow = 'none'; };

  return (
    <button
      type={type}
      disabled={disabled}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onFocus={onFocus}
      onBlur={onBlur}
      {...rest}
    >
      {iconLeft ? <span style={{ display: 'inline-flex' }}>{iconLeft}</span> : null}
      {children}
      {iconRight ? <span style={{ display: 'inline-flex' }}>{iconRight}</span> : null}
    </button>
  );
}
