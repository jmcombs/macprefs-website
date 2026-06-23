// Netservant × Paper Kit — landing sections (composes DS components + placeholders)
const NS = window.BluePSL10KDesignSystem_ff9c76;
const { PaperButton, PaperCard, FeatureItem, TeamCard, ContactForm } = NS;
const { Photo, Avatar } = window;

const WRAP = { maxWidth: 1120, margin: '0 auto', padding: '0 32px' };

const NET_E = '../../assets/netservant-e.png';
const NET_E_WHITE = '../../assets/netservant-e-white.png';
function NetLogo({ u = 26, inverted = false }) {
  const dark = inverted ? '#fff' : 'var(--latte-text)';
  const slate = inverted ? 'color-mix(in srgb, #fff 76%, var(--psl-path-blue))' : 'var(--latte-subtext1)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: u, fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em', lineHeight: 1 }}>
      <span style={{ fontWeight: 700, color: dark }}>N</span>
      <img src={inverted ? NET_E_WHITE : NET_E} alt="e" style={{ height: '1.55em', margin: '0 -0.06em', display: 'block' }} />
      <span style={{ fontWeight: 700, color: dark }}>t</span>
      <span style={{ fontWeight: 700, color: dark }}>servant</span>
    </span>
  );
}

function Eyebrow({ accent = 'path', children }) {
  const c = accent === 'path' ? 'var(--accent)' : `var(--latte-${accent})`;
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: c, marginBottom: 16 }}>{children}</div>;
}

function Nav() {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 30, background: 'color-mix(in srgb, var(--surface-page) 80%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ ...WRAP, height: 72, display: 'flex', alignItems: 'center', gap: 14 }}>
        <NetLogo u={26} />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
          <a href="#product" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>What we do</a>
          <a href="#team" style={{ color: 'inherit', textDecoration: 'none' }}>Team</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
        </div>
        <PaperButton size="sm">Contact us</PaperButton>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header style={{ position: 'relative', minHeight: 560, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Photo seed="hero" radius="0" height="100%" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, color-mix(in srgb, var(--latte-text) 30%, transparent), color-mix(in srgb, var(--latte-text) 55%, transparent))' }} />
      </div>
      <div style={{ ...WRAP, position: 'relative', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', opacity: 0.92, marginBottom: 18 }}>Netservant, LLC · Since 1998</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 72, lineHeight: 1.04, margin: '0 auto', maxWidth: 820, textShadow: '0 2px 20px rgba(76,79,105,0.35)' }}>
          At your network’s service
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.6, maxWidth: 560, margin: '22px auto 32px', opacity: 0.95 }}>
          Netservant is your partner for dependable IT, infrastructure, and the kind of support that actually answers the phone. Tell us what you need.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <PaperButton size="lg">Get in touch</PaperButton>
          <PaperButton size="lg" variant="neutral" iconLeft={<i className="codicon codicon-list-unordered" />}>Our services</PaperButton>
        </div>
      </div>
    </header>
  );
}

function TalkProduct() {
  return (
    <section id="product" style={{ ...WRAP, padding: '96px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
      <Photo seed="product" height={360} label="Your network" icon="server" style={{ boxShadow: 'var(--shadow-paper)' }} />
      <div>
        <Eyebrow>Let’s talk service</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 44, lineHeight: 1.08, margin: '0 0 18px', color: 'var(--text-primary)' }}>Service that actually answers</h2>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--text-tertiary)', margin: '0 0 28px', maxWidth: 460 }}>
          Since 1998 we’ve treated every network like it’s our own. No ticket black holes, no jargon — just steady hands keeping your systems online and a real person who knows your setup.
        </p>
        <PaperButton variant="outline" accent="path" iconRight={<i className="codicon codicon-arrow-right" />}>See details</PaperButton>
      </div>
    </section>
  );
}

const FEATURES = [
  ['server', 'teal', 'Managed infrastructure', 'Servers, networks, and the boring-but-critical things — monitored and handled.'],
  ['cloud', 'peach', 'Cloud & DevOps', 'Provisioning, pipelines, and infrastructure-as-code that scales with you.'],
  ['shield', 'mauve', 'Security & backup', 'Patching, monitoring, and backups you never have to think about.'],
  ['comment-discussion', 'green', 'Real human support', 'When something breaks, a person who knows your setup picks up.'],
];

function Features() {
  return (
    <section id="features" style={{ background: 'var(--surface-panel)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ ...WRAP, padding: '88px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow accent="teal">What we do</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 46, margin: 0, color: 'var(--text-primary)' }}>Built to keep you running</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {FEATURES.map(([icon, accent, title, body]) => (
            <PaperCard key={title} tint={accent} interactive align="center">
              <FeatureItem icon={icon} accent={accent} title={title} align="center">{body}</FeatureItem>
            </PaperCard>
          ))}
        </div>
      </div>
    </section>
  );
}

const TEAM = [
  ['HF', 'Henry Ford', 'Product Manager', 'mauve', 'stats', 'Teamwork is so important that it is virtually impossible to reach the heights of your capabilities without becoming very good at it.'],
  ['SW', 'Sophie West', 'Designer', 'teal', 'gallery', 'A group becomes a team when each member is sure enough of themselves to praise the skill of the others. It takes an orchestra to play a symphony.'],
  ['RO', 'Robert Orben', 'Developer', 'peach', 'ideas', 'The strength of the team is each member. The strength of each member is the team. If you can laugh together, you can work together.'],
];

function Team() {
  return (
    <section id="team" style={{ ...WRAP, padding: '96px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Eyebrow accent="mauve">Let’s talk about us</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 46, margin: 0, color: 'var(--text-primary)' }}>The people behind the service</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {TEAM.map(([initials, name, role, accent, seed, quote]) => (
          <TeamCard key={name} name={name} role={role} accent={accent}
            avatar={<Avatar seed={seed} initials={initials} />}
            socials={[{ icon: 'github' }, { icon: 'twitter' }, { icon: 'link' }]}>
            {quote}
          </TeamCard>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" style={{ background: 'color-mix(in srgb, var(--accent) 7%, var(--surface-page))', borderTop: '1px solid var(--border)' }}>
      <div style={{ ...WRAP, padding: '88px 32px' }}>
        <ContactForm title="How may we help you?" blurb="Tell us what you need — we read every message." />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--surface-chrome)', borderTop: '1px solid var(--border)' }}>
      <div style={{ ...WRAP, padding: '40px 32px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <NetLogo u={20} />
        <div style={{ display: 'flex', gap: 22, marginLeft: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
          <a href="#product" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>What we do</a>
          <a href="#team" style={{ color: 'inherit', textDecoration: 'none' }}>Team</a>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Netservant, LLC · How may we help you?</span>
      </div>
    </footer>
  );
}

function PaperLanding() {
  return <div><Nav /><Hero /><TalkProduct /><Features /><Team /><Contact /><Footer /></div>;
}

Object.assign(window, { PaperLanding });
