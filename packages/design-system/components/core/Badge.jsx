import React from 'react';

/**
 * Netservant — Badge
 * Compact status/label pill. Semantic presets map onto the Latte palette;
 * `dot` adds a leading status dot; `solid` fills, `soft` tints.
 */
export function Badge({
  tone = 'neutral',
  variant = 'soft',
  dot = false,
  size = 'md',
  style = {},
  children,
  ...rest
}) {
  const toneColor = {
    neutral: 'var(--text-tertiary)',
    accent: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
    info: 'var(--info)',
    mauve: 'var(--latte-mauve)',
    peach: 'var(--latte-peach)',
    pink: 'var(--latte-pink)',
    lavender: 'var(--latte-lavender)',
  }[tone] || 'var(--text-tertiary)';

  const sizes = {
    sm: { padding: dot ? '2px 8px 2px 7px' : '2px 8px', fontSize: 11, gap: 5, dotSize: 6 },
    md: { padding: dot ? '4px 11px 4px 9px' : '4px 11px', fontSize: 12, gap: 6, dotSize: 7 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    soft: { background: `color-mix(in srgb, ${toneColor} 14%, transparent)`, color: toneColor, border: '1px solid transparent' },
    solid: { background: toneColor, color: 'var(--text-on-accent)', border: '1px solid transparent' },
    outline: { background: 'transparent', color: toneColor, border: `1px solid color-mix(in srgb, ${toneColor} 45%, transparent)` },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        padding: s.padding,
        fontFamily: 'var(--font-ui)',
        fontSize: s.fontSize,
        fontWeight: 'var(--weight-semibold)',
        lineHeight: 1.2,
        borderRadius: 'var(--radius-full)',
        whiteSpace: 'nowrap',
        ...(variants[variant] || variants.soft),
        ...style,
      }}
      {...rest}
    >
      {dot ? (
        <span style={{ width: s.dotSize, height: s.dotSize, borderRadius: '50%', background: variant === 'solid' ? 'currentColor' : toneColor, flex: 'none' }} />
      ) : null}
      {children}
    </span>
  );
}
