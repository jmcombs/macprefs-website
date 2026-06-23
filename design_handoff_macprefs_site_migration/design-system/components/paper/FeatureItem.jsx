import React from 'react';

/**
 * Netservant × Paper Kit — FeatureItem
 * A feature block: pastel icon medallion + title + body + optional "see more" link.
 * `icon` is a codicon name (load @vscode/codicons in the host).
 */
export function FeatureItem({
  icon = 'sparkle',
  accent = 'teal',          // Catppuccin Latte accent name
  title,
  children,
  linkText,
  linkHref = '#',
  align = 'left',
  style = {},
  ...rest
}) {
  const color = `var(--latte-${accent}, ${accent})`;
  const centered = align === 'center';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: centered ? 'center' : 'flex-start', textAlign: align, gap: 12, ...style }} {...rest}>
      <div style={{
        width: 60, height: 60, borderRadius: 'var(--radius-full)', flex: 'none',
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={`codicon codicon-${icon}`} style={{ fontSize: 26 }} />
      </div>
      <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', letterSpacing: 'var(--tracking-snug)' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)', color: 'var(--text-tertiary)' }}>{children}</p>
      {linkText ? (
        <a href={linkHref} style={{ marginTop: 2, fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 'var(--weight-semibold)', color, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {linkText} →
        </a>
      ) : null}
    </div>
  );
}
