import React from 'react';

/**
 * Netservant × Paper Kit — TeamCard
 * A person card: round avatar (photo node), name, role, quote, social row.
 * Paper "paper" surface + pastel accent role.
 */
export function TeamCard({
  avatar,                 // node (Avatar / image / placeholder)
  name,
  role,
  accent = 'mauve',       // Catppuccin Latte accent name for the role label
  socials = [],           // [{ icon: 'github', href: '#' }] — codicon names
  raised = true,
  style = {},
  children,
  ...rest
}) {
  const color = `var(--latte-${accent}, ${accent})`;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      gap: 14, padding: 'var(--space-8) var(--space-6)',
      background: 'var(--surface-page)', borderRadius: 'var(--radius-paper)',
      boxShadow: raised ? 'var(--shadow-paper)' : 'none', border: raised ? 'none' : '1px solid var(--border)',
      ...style,
    }} {...rest}>
      <div style={{ width: 110, height: 110, borderRadius: 'var(--radius-full)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>{avatar}</div>
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 'var(--weight-medium)', color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{role}</div>
      </div>
      <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)', color: 'var(--text-tertiary)', maxWidth: 320 }}>{children}</p>
      {socials.length ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {socials.map((s, i) => (
            <a key={i} href={s.href || '#'} aria-label={s.icon} style={{
              width: 36, height: 36, borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `color-mix(in srgb, ${color} 12%, transparent)`, color,
              textDecoration: 'none', transition: 'background var(--dur-fast) var(--ease-out)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `color-mix(in srgb, ${color} 22%, transparent)`}
            onMouseLeave={(e) => e.currentTarget.style.background = `color-mix(in srgb, ${color} 12%, transparent)`}>
              <i className={`codicon codicon-${s.icon}`} style={{ fontSize: 16 }} />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
