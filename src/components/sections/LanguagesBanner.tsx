'use client';
import { FEATURED_SKILLS } from '@/lib/data';

export default function SkillsBanner() {
  const doubled = [...FEATURED_SKILLS, ...FEATURED_SKILLS];
  return (
    <section style={{ padding: '48px 0', background: 'var(--bg-base)', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)', overflow: 'hidden' }}>
      <p style={{ textAlign: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 24 }}>
        In-Demand Skills on the Platform
      </p>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(90deg, var(--bg-base), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(-90deg, var(--bg-base), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', gap: 8, animation: 'marquee 32s linear infinite', width: 'max-content' }}>
          {doubled.map((skill, i) => (
            <span key={i} style={{ padding: '7px 18px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 99, fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
