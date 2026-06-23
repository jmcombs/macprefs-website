// Netservant × Paper Kit — tasteful pastel placeholders (no external photos).
// "Sugar-paper pastel" abstract art built from Catppuccin Latte radial blobs.

const PSL_PALETTES = {
  gallery:  ['teal', 'sky', 'sapphire', 'lavender'],
  ideas:    ['peach', 'yellow', 'rosewater', 'flamingo'],
  stats:    ['mauve', 'lavender', 'pink', 'blue'],
  design:   ['green', 'teal', 'sky', 'yellow'],
  product:  ['sapphire', 'lavender', 'mauve', 'sky'],
  hero:     ['mauve', 'sapphire', 'teal', 'peach'],
};

function blobBg(keys) {
  const v = (n) => `var(--latte-${n})`;
  const [a, b, c, d] = keys;
  return [
    `radial-gradient(40% 55% at 18% 28%, color-mix(in srgb, ${v(a)} 85%, transparent), transparent 70%)`,
    `radial-gradient(45% 60% at 82% 22%, color-mix(in srgb, ${v(b)} 80%, transparent), transparent 72%)`,
    `radial-gradient(50% 55% at 70% 82%, color-mix(in srgb, ${v(c)} 80%, transparent), transparent 70%)`,
    `radial-gradient(45% 50% at 25% 85%, color-mix(in srgb, ${v(d)} 75%, transparent), transparent 72%)`,
    `linear-gradient(135deg, var(--latte-crust), var(--latte-mantle))`,
  ].join(', ');
}

// Rectangular photo placeholder. `seed` picks a palette; `label` optional.
function Photo({ seed = 'product', radius = 'var(--radius-paper)', height = '100%', label, icon, style = {} }) {
  const keys = PSL_PALETTES[seed] || PSL_PALETTES.product;
  return (
    <div style={{
      position: 'relative', width: '100%', height, minHeight: 160, borderRadius: radius, overflow: 'hidden',
      background: blobBg(keys), ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 50% 0%, transparent 40%, color-mix(in srgb, var(--latte-text) 10%, transparent))' }} />
      {(label || icon) ? (
        <div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(76,79,105,0.4)' }}>
          {icon ? <i className={`codicon codicon-${icon}`} style={{ fontSize: 14 }} /> : null}{label}
        </div>
      ) : null}
    </div>
  );
}

// Circular avatar placeholder with initials.
function Avatar({ seed = 'product', initials = '' , style = {} }) {
  const keys = PSL_PALETTES[seed] || PSL_PALETTES.stats;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, var(--latte-${keys[0]}), var(--latte-${keys[2]}))`,
      color: 'rgba(255,255,255,0.95)', fontFamily: 'var(--font-serif)', fontSize: 36, letterSpacing: '0.02em',
      textShadow: '0 1px 6px rgba(76,79,105,0.35)', ...style,
    }}>{initials}</div>
  );
}

Object.assign(window, { Photo, Avatar, PSL_PALETTES });
