import React from 'react';

/**
 * Netservant × Paper Kit — PaperCard
 * Soft, rounded "paper" surface (rounder + softer shadow than the core Card).
 * Optional pastel tint, media slot, and hover lift.
 */
export function PaperCard({
  tint,                 // Catppuccin Latte accent name → soft pastel fill
  media,                // node rendered flush at the top (image/placeholder)
  raised = true,        // paper shadow
  interactive = false,
  align = 'left',
  padding = 'var(--space-6)',
  style = {},
  children,
  ...rest
}) {
  const tintBg = tint ? `color-mix(in srgb, var(--latte-${tint}, ${tint}) 10%, var(--surface-page))` : 'var(--surface-page)';

  const enter = (e) => { if (interactive) { e.currentTarget.style.boxShadow = 'var(--shadow-paper-hover)'; e.currentTarget.style.transform = 'translateY(-4px)'; } };
  const leave = (e) => { if (interactive) { e.currentTarget.style.boxShadow = raised ? 'var(--shadow-paper)' : 'none'; e.currentTarget.style.transform = 'none'; } };

  return (
    <div
      style={{
        background: tintBg,
        borderRadius: 'var(--radius-paper)',
        boxShadow: raised ? 'var(--shadow-paper)' : 'none',
        border: raised ? 'none' : '1px solid var(--border)',
        overflow: 'hidden',
        textAlign: align,
        transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      {...rest}
    >
      {media ? <div style={{ width: '100%' }}>{media}</div> : null}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
