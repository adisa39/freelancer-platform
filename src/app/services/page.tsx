'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { JOB_CATEGORIES } from '@/lib/data';

const CATEGORY_COLORS: Record<string, string> = {
  'Document Translation': 'var(--accent)',
  'Legal Translation': 'var(--sand)',
  'Medical Translation': '#E84C4C',
  'Website Localization': '#4CAF50',
  'Technical Translation': '#8B5CF6',
  'Audio & Video': '#F59E0B',
  'Interpretation': '#EC4899',
  'Software Localization': '#06B6D4',
};

const SERVICES = [
  { category: 'Document Translation', icon: '📄', shortDesc: 'Professional translation of all document types with certified accuracy.', priceFrom: 0.08, unit: '/word', deliveryDays: 2, features: ['Certified translators', 'Quality assurance', 'Multiple formats', 'Express delivery'] },
  { category: 'Legal Translation', icon: '⚖️', shortDesc: 'Precise legal translations for contracts, court documents, and more.', priceFrom: 0.15, unit: '/word', deliveryDays: 3, features: ['Certified legal translators', 'Court-accepted', 'Confidential', 'Notarization available'] },
  { category: 'Medical Translation', icon: '🏥', shortDesc: 'Accurate medical and pharmaceutical translations by specialists.', priceFrom: 0.18, unit: '/word', deliveryDays: 3, features: ['Medical specialists', 'Clinical accuracy', 'HIPAA-aware', 'FDA-compliant'] },
  { category: 'Website Localization', icon: '🌐', shortDesc: 'Complete localization of websites for African and global markets.', priceFrom: 199, unit: '/project', deliveryDays: 7, features: ['SEO optimization', 'Cultural adaptation', 'CMS integration', 'Ongoing maintenance'] },
  { category: 'Technical Translation', icon: '⚙️', shortDesc: 'Engineering, IT, and technical manuals translated with precision.', priceFrom: 0.12, unit: '/word', deliveryDays: 4, features: ['Technical specialists', 'Terminology management', 'DTP services', 'CAT tools'] },
  { category: 'Audio & Video', icon: '🎬', shortDesc: 'Subtitling, dubbing, and transcription for all media content.', priceFrom: 3, unit: '/min', deliveryDays: 5, features: ['Subtitling & captioning', 'Voice-over', 'Transcription', 'Time-coding'] },
  { category: 'Interpretation', icon: '🎙️', shortDesc: 'Real-time consecutive and simultaneous interpretation services.', priceFrom: 80, unit: '/hr', deliveryDays: 1, features: ['Consecutive interpretation', 'Simultaneous remote', 'Conference support', 'Medical & legal'] },
  { category: 'Software Localization', icon: '💻', shortDesc: 'Full software and app localization for African and global markets.', priceFrom: 0.10, unit: '/word', deliveryDays: 5, features: ['UI/UX localization', 'String extraction', 'QA testing', 'OTA updates'] },
];

export default function ServicesPage() {
  const [active, setActive] = useState('all');

  const displayed = active === 'all' ? SERVICES : SERVICES.filter(s => s.category === active);

  return (
    <>
      <section style={{ paddingTop: 116, paddingBottom: 48, background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .45 }} />
        <div className="container-brand" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: '.75rem', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: 12 }}>— What We Offer —</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,5vw,3rem)', color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 14 }}>
            Translation Services <span style={{ background: 'linear-gradient(135deg,var(--sand),var(--accent-bright))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Tailored for You</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 520, margin: '0 auto 32px' }}>Every speciality covered — post a job, choose a skilled Linker, and agree on clear project terms.</p>
          <Link href="/post-job" className="btn-primary" style={{ fontSize: '.95rem' }}>Post a Translation Job <ArrowRight size={15} /></Link>
        </div>
      </section>

      {/* Sticky filter */}
      <div style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)', padding: '14px 0', position: 'sticky', top: 68, zIndex: 10 }}>
        <div className="container-brand">
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            <button onClick={() => setActive('all')} style={{ padding: '7px 16px', borderRadius: 99, border: '1px solid', cursor: 'pointer', transition: 'all .18s', fontSize: '.8rem', fontFamily: 'var(--font-display)', fontWeight: 500, whiteSpace: 'nowrap', borderColor: active === 'all' ? 'var(--accent)' : 'var(--border)', background: active === 'all' ? 'rgba(45,125,210,.14)' : 'transparent', color: active === 'all' ? 'var(--accent-bright)' : 'var(--text-secondary)' }}>
              All Services
            </button>
            {JOB_CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setActive(c.id)} style={{ padding: '7px 16px', borderRadius: 99, border: '1px solid', cursor: 'pointer', transition: 'all .18s', fontSize: '.8rem', fontFamily: 'var(--font-display)', fontWeight: 500, whiteSpace: 'nowrap', borderColor: active === c.id ? c.color : 'var(--border)', background: active === c.id ? `${c.color}14` : 'transparent', color: active === c.id ? c.color : 'var(--text-secondary)' }}>
                {c.icon} {c.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section style={{ background: 'var(--bg-base)', padding: '32px 0 72px' }}>
        <div className="container-brand">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {displayed.map(svc => {
              const color = CATEGORY_COLORS[svc.category] || 'var(--accent)';
              return (
                <div key={svc.category} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, transition: 'all .22s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,.3)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${color},transparent)` }} />
                  <div style={{ fontSize: '1.9rem', marginBottom: 16 }}>{svc.icon}</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 10 }}>{svc.category}</h2>
                  <p style={{ fontSize: '.87rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{svc.shortDesc}</p>
                  <div style={{ marginBottom: 22 }}>
                    {svc.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                        <Check size={12} style={{ color, flexShrink: 0 }} />
                        <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ fontSize: '.74rem', color: 'var(--text-muted)' }}>From </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color, fontSize: '1.05rem' }}>${svc.priceFrom}</span>
                      <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{svc.unit}</span>
                    </div>
                    <Link href="/post-job" className="btn-primary" style={{ padding: '7px 16px', fontSize: '.78rem' }}>Post Job</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
