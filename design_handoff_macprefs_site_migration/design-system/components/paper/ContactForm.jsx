import React from 'react';
import { PaperButton } from './PaperButton';

function PaperField({ label, type = 'text', textarea, value, onChange, placeholder, name }) {
  const [focus, setFocus] = React.useState(false);
  const shared = {
    width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)', color: 'var(--text-primary)',
    background: 'var(--surface-page)',
    border: `1px solid ${focus ? 'var(--border-active)' : 'var(--border)'}`,
    boxShadow: focus ? 'var(--ring)' : 'var(--shadow-xs)',
    outline: 'none', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
  };
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {label ? <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 'var(--weight-semibold)', color: 'var(--text-secondary)' }}>{label}</span> : null}
      {textarea ? (
        <textarea name={name} rows={4} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...shared, padding: '13px 18px', borderRadius: 'var(--radius-paper)', resize: 'vertical', minHeight: 96 }} />
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...shared, padding: '12px 20px', borderRadius: 'var(--radius-full)' }} />
      )}
    </label>
  );
}

/**
 * Netservant × Paper Kit — ContactForm
 * "Keep in touch?" form: rounded paper fields + a pill submit.
 * Controlled internally; `onSubmit` receives { name, email, message }.
 */
export function ContactForm({
  title = 'Keep in touch?',
  blurb,
  submitLabel = 'Send message',
  accent = 'path',
  onSubmit,
  align = 'center',
  style = {},
  ...rest
}) {
  const [data, setData] = React.useState({ name: '', email: '', message: '' });
  const [sent, setSent] = React.useState(false);
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const submit = (e) => { e.preventDefault(); setSent(true); if (onSubmit) onSubmit(data); };

  return (
    <form onSubmit={submit} style={{ width: '100%', maxWidth: 540, margin: align === 'center' ? '0 auto' : 0, textAlign: align, ...style }} {...rest}>
      {title ? <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-3xl)', color: 'var(--text-primary)' }}>{title}</h3> : null}
      {blurb ? <p style={{ margin: '0 0 26px', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-normal)', color: 'var(--text-tertiary)' }}>{blurb}</p> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}><PaperField label="Name" name="name" value={data.name} onChange={set('name')} placeholder="Jane Latte" /></div>
          <div style={{ flex: 1, minWidth: 180 }}><PaperField label="Email" name="email" type="email" value={data.email} onChange={set('email')} placeholder="jane@brew.dev" /></div>
        </div>
        <PaperField label="Message" name="message" textarea value={data.message} onChange={set('message')} placeholder="Tell us how you take your coffee…" />
        <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', marginTop: 6 }}>
          <PaperButton type="submit" size="lg" accent={accent === 'path' ? 'path' : accent}>
            {sent ? 'Sent ✓' : submitLabel}
          </PaperButton>
        </div>
      </div>
    </form>
  );
}
