'use client';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, Briefcase } from 'lucide-react';
import { HOW_IT_WORKS } from '@/lib/data';

export default function CTASection() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
      <div className="container-brand">
        <div style={{ display: 'grid', gap: 56, alignItems: 'start' }} className="cta-grid">

          {/* How it works */}
          <div>
            <span className="section-label">— Simple Process —</span>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              How Pioneer <span className="grad-accent">Platform Works</span>
            </h2>
            <p className="section-sub" style={{ marginBottom: 36 }}>Three steps from posting to paid. No complexity, no hidden fees.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {HOW_IT_WORKS.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 28, position: 'relative' }}>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div style={{ position: 'absolute', left: 17, top: 44, bottom: 0, width: 2, background: 'var(--border)' }} />
                  )}
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'var(--bg-card)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.72rem', color: 'var(--accent)', zIndex: 1 }}>
                    {item.step}
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.97rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                      {item.icon} {item.title}
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Client card */}
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(45,125,210,0.1)', border: '1.5px solid rgba(45,125,210,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Briefcase size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                Hiring? Post a Job
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {['Free to post — no upfront cost', 'Receive applications within hours', 'Pay only when work is approved'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={13} style={{ color: 'var(--green)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/post-job" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Post a Job Free <ArrowRight size={15} />
              </Link>
            </div>

            {/* Pioneer card */}
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(200,184,130,0.1)', border: '1.5px solid rgba(200,184,130,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Users size={20} style={{ color: 'var(--sand)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                Skilled Professional? Join Free
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {['Browse 12K+ open jobs now', 'Set your own rates and availability', 'Build a reputation with verified reviews'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={13} style={{ color: 'var(--sand)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/register?role=pioneer" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Join as Pioneer
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`@media(min-width:900px){.cta-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </section>
  );
}
