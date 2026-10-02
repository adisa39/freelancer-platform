'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Moon, Sun, ChevronDown, Briefcase, Users, PlusCircle, LayoutDashboard } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { href: '/jobs',      label: 'Find Jobs',    icon: Briefcase },
  { href: '/linkers',   label: 'Linkers',      icon: Users     },
  { href: '/post-job',  label: 'Post a Job',   icon: PlusCircle },
  { href: '/test-flows',  label: 'Test app flow',   icon: PlusCircle },
  { href: '/services',  label: 'Services',     icon: null      },
  { href: '/about',     label: 'About',        icon: null      },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle, isDark } = useTheme();
  const { user, status, signOut } = useAuth();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div className="container-brand" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border)', flexShrink: 0 }}>
              <Image src="/logo.png" alt="BF Blessy" width={36} height={36} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', lineHeight: 1.1, color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--sand)' }}>BF</span>
                {' '}
                <span style={{ color: 'var(--accent-bright)' }}>Blessy</span>
              </div>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Linker Marketplace
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'none', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }} className="desk-nav">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} style={{ padding: '7px 13px', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.86rem', borderRadius: 8, transition: 'color 0.15s, background 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.background = 'rgba(45,125,210,0.07)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >{label}</Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div style={{ display: 'none', alignItems: 'center', gap: 8, flexShrink: 0 }} className="desk-cta">
            <button onClick={toggle} className="theme-toggle" aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {status === 'authenticated' && user ? <>
              <Link href="/dashboard" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button type="button" className="btn-secondary" onClick={() => void signOut()} style={{ padding: '8px 18px', fontSize: '0.84rem' }}>Sign out</button>
            </> : status === 'unauthenticated' ? <>
              <Link href="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.84rem' }}>Login</Link>
              <Link href="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.84rem' }}>Register</Link>
            </> : null}
          </div>

          {/* Mobile controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="mob-ctrls">
            <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => setOpen(!open)} style={{ width: 40, height: 40, borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }} aria-label="Menu">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div style={{ maxHeight: open ? '520px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease', background: 'var(--bg-surface)', borderBottom: open ? '1px solid var(--border)' : 'none' }}>
          <div style={{ padding: '16px 20px 24px' }}>
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 4px', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', borderBottom: '1px solid var(--border)', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {Icon && <Icon size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                {label}
              </Link>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {status === 'authenticated' ? <>
                <Link href="/dashboard" className="btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setOpen(false)}>Dashboard</Link>
                <button type="button" className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => { setOpen(false); void signOut(); }}>Sign out</button>
              </> : status === 'unauthenticated' ? <>
                <Link href="/login" className="btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setOpen(false)}>Sign in with InterLink</Link>
                <Link href="/register" className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => setOpen(false)}>Join as Linker →</Link>
              </> : null}
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        @media (min-width: 768px) {
          .desk-nav  { display: flex !important; }
          .desk-cta  { display: flex !important; }
          .mob-ctrls { display: none !important; }
        }
        @media (max-width: 767px) {
          .mob-ctrls { display: flex !important; }
        }
      `}</style>
    </>
  );
}
