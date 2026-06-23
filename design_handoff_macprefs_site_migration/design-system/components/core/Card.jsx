import React from 'react';

/**
 * Netservant — Card
 * A surface container. Light, border-led elevation (not heavy shadow).
 * Optional header (crust chrome bar) and accent top-rail.
 */
export function Card({
  title,
  subtitle,
  headerRight,
  accentRail = false,
  accent = 'var(--accent)',
  padding = 'var(--space-5)',
  interactive = false,
  style = {},
  children,
  ...rest
}) {
  const onEnter = (e) => { if (interactive) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; } };
  const onLeave = (e) => { if (interactive) { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; } };

  return (
    <div
      style={{
        background: 'var(--surface-page)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      {accentRail ? <div style={{ height: 3, background: accent }} /> : null}
      {title ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-5)',
          background: 'var(--surface-chrome)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', letterSpacing: 'var(--tracking-snug)' }}>{title}</span>
            {subtitle ? <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{subtitle}</span> : null}
          </div>
          {headerRight ? <div style={{ flex: 'none' }}>{headerRight}</div> : null}
        </div>
      ) : null}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
