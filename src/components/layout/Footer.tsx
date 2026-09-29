'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const LINKS = {
  Platform: [
    { label: 'Find Jobs',       href: '/jobs'       },
    { label: 'Browse Linkers',  href: '/linkers'    },
    { label: 'Post a Job',      href: '/post-job'   },
    { label: 'Services',        href: '/services'   },
    { label: 'Dashboard',       href: '/dashboard'  },
  ],
  Company: [
    { label: 'About Us',        href: '/about'      },
    { label: 'How It Works',    href: '/about#how'  },
    { label: 'Blog',            href: '#'           },
    { label: 'Careers',         href: '#'           },
    { label: 'Contact',         href: '/contact'    },
  ],
  Legal: [
    { label: 'Privacy Policy',  href: '#' },
    { label: 'Terms of Service',href: '#' },
    { label: 'Cookie Policy',   href: '#' },
    { label: 'Escrow Policy',   href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1.5px solid var(--border)', paddingTop: 56, paddingBottom: 32 }}>
      <div className="container-brand">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, overflow: 'hidden', border: '1.5px solid var(--border)', flexShrink: 0 }}>
                <Image src="/logo.png" alt="BF Blessy" width={36} height={36} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--sand)' }}>BF</span>{' '}<span style={{ color: 'var(--accent-bright)' }}>Blessy</span>
                </div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Linker Marketplace</div>
              </div>
            </Link>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 18 }}>
              Connecting skilled Linkers with paid opportunities across every industry.
            </p>
            {[
              { icon: Mail, t: 'info@bfblessy.com', h: 'mailto:info@bfblessy.com' },
              { icon: MapPin, t: 'Dar es Salaam, Tanzania', h: '#' },
            ].map(({ icon: Icon, t, h }, i) => (
              <a key={i} href={h} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.84rem', marginBottom: 8, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Icon size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                {t}
              </a>
            ))}
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</h4>
              {links.map(({ label, href }) => (
                <Link key={label} href={href} style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.86rem', marginBottom: 9, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >{label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: 22, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} BF Blessy Linker Marketplace. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Tunatafsiri kwa ubora — We deliver with quality.
          </p>
        </div>
      </div>
    </footer>
  );
}
