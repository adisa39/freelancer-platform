'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Target, Eye, Heart, Globe, ArrowRight } from 'lucide-react';

const TEAM = [
  { name: 'Blessy Founder', role: 'Founder & CEO', languages: ['Swahili', 'English', 'French'], emoji: '👨‍💼' },
  { name: 'Amina Hassan', role: 'Head of Legal Translation', languages: ['Arabic', 'Swahili', 'English'], emoji: '👩‍⚖️' },
  { name: 'Chen Wei', role: 'Chinese-Swahili Specialist', languages: ['Chinese', 'Swahili', 'English'], emoji: '👨‍🏫' },
  { name: 'Dr. Fatuma Ally', role: 'Medical Translation Lead', languages: ['Swahili', 'English', 'French'], emoji: '👩‍⚕️' },
];

const MILESTONES = [
  { year: '2018', event: 'BF Blessy founded in Dar es Salaam', color: 'var(--accent)' },
  { year: '2019', event: 'First 1,000 documents translated', color: 'var(--sand)' },
  { year: '2020', event: 'Expanded to legal and medical specializations', color: '#4CAF50' },
  { year: '2022', event: 'Reached 50+ language pairs', color: '#8B5CF6' },
  { year: '2023', event: 'Launched digital platform and 10,000th translation', color: '#F59E0B' },
  { year: '2024', event: 'Extended operations to 12 African countries', color: '#EC4899' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 72, background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        <div className="container-brand" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gap: 56, alignItems: 'center' }} className="about-hero-grid">
            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: 14 }}>
                — Our Story —
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 20 }}>
                We Are BF Blessy —<br />
                <span style={{ background: 'linear-gradient(135deg, var(--sand), var(--accent-bright))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Africa's Translation Partner
                </span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 16 }}>
                Founded in Dar es Salaam, Tanzania, BF Blessy was built on a simple belief: that language should never be a barrier to opportunity. Our tagline, <em style={{ color: 'var(--sand)' }}>Tunatafsiri kwa ubora</em> — "We translate with quality" — is not a slogan. It is our daily commitment.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 32 }}>
                Since 2018, we have helped businesses, NGOs, legal professionals, and individuals communicate across languages — from Swahili to Chinese, Arabic to Yoruba, and across 50+ language pairs.
              </p>
              <Link href="/contact#quote" className="btn-primary">
                Work With Us <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 280, height: 280 }}>
                <div className="animate-spin-slow" style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '1px dashed rgba(45,125,210,0.3)',
                }} />
                <div className="animate-pulse-glow" style={{
                  position: 'absolute', inset: 20, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(45,125,210,0.1) 0%, transparent 70%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Image src="/logo.png" alt="BF Blessy" width={160} height={160} style={{ borderRadius: '50%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section-pad" style={{ background: 'var(--bg-base)' }}>
        <div className="container-brand">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { icon: Target, color: 'var(--accent)', title: 'Our Mission', titleSw: 'Dhamira Yetu', text: 'To provide world-class translation services that empower African businesses, communities, and individuals to communicate confidently across languages and cultures.' },
              { icon: Eye, color: 'var(--sand)', title: 'Our Vision', titleSw: 'Maono Yetu', text: 'To be the leading translation and localization partner for African and international businesses, making quality communication accessible to all.' },
              { icon: Heart, color: '#E84C4C', title: 'Our Values', titleSw: 'Maadili Yetu', text: 'Accuracy, integrity, cultural respect, and client-first service. Every word we translate carries the weight of human understanding.' },
            ].map(({ icon: Icon, color, title, titleSw, text }, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 20 }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 4 }}>{title}</h3>
                <p style={{ fontSize: '0.75rem', color, fontStyle: 'italic', marginBottom: 14 }}>{titleSw}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad" style={{ background: 'var(--bg-surface)' }}>
        <div className="container-brand">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text-primary)' }}>
              Our Journey
            </h2>
          </div>
          <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 64, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, marginBottom: 32, position: 'relative' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                  background: `${m.color}15`, border: `2px solid ${m.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.72rem',
                  color: m.color, zIndex: 1,
                }}>
                  {m.year}
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 20px', flex: 1, marginTop: 8 }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section-pad" style={{ background: 'var(--bg-base)' }}>
        <div className="container-brand">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text-primary)', marginBottom: 14 }}>
              Our <span className="gradient-blue">Expert Team</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Native speakers and domain specialists committed to translation excellence.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {TEAM.map((member, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, textAlign: 'center', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: 14, lineHeight: 1 }}>{member.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 6 }}>{member.name}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--accent)', marginBottom: 14 }}>{member.role}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {member.languages.map(lang => (
                    <span key={lang} style={{ padding: '3px 10px', borderRadius: 99, background: 'var(--bg-surface)', border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{lang}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (min-width: 900px) { .about-hero-grid { grid-template-columns: 1fr 380px !important; } }
      `}</style>
    </>
  );
}
