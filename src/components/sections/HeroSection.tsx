'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, TrendingUp, Shield, Zap } from 'lucide-react';
import { FEATURED_SKILLS, STATS } from '@/lib/data';

const FLOATING = [
  { label: '💻 Development', top: '12%', left: '-2%' },
  { label: '🎨 Design',      top: '12%', right: '-2%' },
  { label: '📣 Marketing',   bottom: '22%', left: '-4%' },
  { label: '🤖 Data & AI',   bottom: '22%', right: '-4%' },
];

export default function HeroSection() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 64 }}>
      {/* Background */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', top: '10%', right: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,125,210,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,184,130,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="container-brand" style={{ position: 'relative', zIndex: 1, paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 60, alignItems: 'center' }} className="hero-grid">

          {/* Left content */}
          <div style={{ maxWidth: 660 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(45,125,210,0.10)', border: '1px solid rgba(45,125,210,0.22)', borderRadius: 99, marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-ring 2s ease-out infinite' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                Africa's #1 Freelance Marketplace
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', color: 'var(--text-primary)' }}>Hire Top</span>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }} className="shimmer-text">Pioneers.</span>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', color: 'var(--text-primary)' }}>Get Hired.</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 36, maxWidth: 520 }}>
              Post any job, find skilled Pioneers, and pay securely with milestone-based escrow. From development to design, marketing to engineering — every skill, one platform.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 44 }}>
              <Link href="/post-job" className="btn-primary" style={{ fontSize: '0.95rem', padding: '13px 30px' }}>
                Post a Job <ArrowRight size={16} />
              </Link>
              <Link href="/jobs" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '13px 30px' }}>
                Browse Jobs
              </Link>
            </div>

            {/* Trust signals */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="var(--sand)" color="var(--sand)" />)}
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: 2 }}>4.9 / 5</span>
              </div>
              <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={13} style={{ color: 'var(--green)' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Escrow protected</span>
              </div>
              <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={13} style={{ color: 'var(--yellow)' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Hire in 24 hours</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {STATS.map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', minHeight: 360 }}>
            {/* Orbit rings */}
            <div className="animate-spin-slow" style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px dashed rgba(45,125,210,0.2)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
            <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: '1px dashed rgba(200,184,130,0.15)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'spin-slow 18s linear reverse infinite' }} />

            {/* Central logo */}
            <div className="animate-float" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 2 }}>
              <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--border)', boxShadow: 'var(--shadow-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Image src="/logo.png" alt="BF Blessy" width={120} height={120} style={{ borderRadius: '50%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Floating category chips */}
            {FLOATING.map((c, i) => (
              <div key={i} style={{ position: 'absolute', ...Object.fromEntries(Object.entries(c).filter(([k]) => !['label'].includes(k))), background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '7px 14px', fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-sm)', animation: `float ${4.5 + i * 0.5}s ease-in-out ${i * 0.3}s infinite` }}>
                {c.label}
              </div>
            ))}

            {/* Job count badge */}
            <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', borderRadius: 10, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.84rem', boxShadow: '0 4px 20px rgba(45,125,210,0.4)', whiteSpace: 'nowrap' }}>
              <TrendingUp size={15} /> 847 new jobs this week
            </div>
          </div>
        </div>

        {/* Skills marquee */}
        <div style={{ marginTop: 64, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Popular Skills</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, var(--bg-base), transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(-90deg, var(--bg-base), transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', gap: 8, animation: 'marquee 30s linear infinite', width: 'max-content' }}>
              {[...FEATURED_SKILLS, ...FEATURED_SKILLS].map((skill, i) => (
                <span key={i} style={{ padding: '5px 14px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 99, fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 900px) { .hero-grid { grid-template-columns: 1fr 1fr !important; } }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(76,175,80,0.6); }
          70%  { box-shadow: 0 0 0 8px rgba(76,175,80,0); }
          100% { box-shadow: 0 0 0 0 rgba(76,175,80,0); }
        }
      `}</style>
    </section>
  );
}
