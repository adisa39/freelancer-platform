'use client';
import { STATS, TESTIMONIALS } from '@/lib/data';
import { Star, Quote } from 'lucide-react';

export function StatsSection() {
  return (
    <section style={{ padding: '60px 0', background: 'var(--bg-base)', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
      <div className="container-brand">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: '8px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text-primary)', lineHeight: 1 }} className="grad-warm">{s.value}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-surface)' }}>
      <div className="container-brand">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label">— Success Stories —</span>
          <h2 className="section-title">
            Trusted by <span className="grad-warm">Thousands</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card" style={{ padding: 26 }}>
              {/* Category tag */}
              <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--accent)', background: 'rgba(45,125,210,0.1)', border: '1px solid rgba(45,125,210,0.2)', padding: '2px 9px', borderRadius: 99 }}>
                  {t.category}
                </span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={12} fill="var(--sand)" color="var(--sand)" />)}
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 22 }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-dark), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{t.flag}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
