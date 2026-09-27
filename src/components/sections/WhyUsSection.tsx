'use client';
import { Shield, Zap, Globe, Users, DollarSign, Award } from 'lucide-react';

const REASONS = [
  { icon: Globe,     color: 'var(--accent)',  title: 'Pan-African Network',  desc: 'Pioneers and clients across 40+ African countries and globally. Work across borders, get paid in your currency.' },
  { icon: Shield,    color: '#4CAF50',        title: 'Secure Escrow',        desc: 'Every payment is held in escrow. Funds are released only when you approve the work. Zero risk for clients.' },
  { icon: Zap,       color: 'var(--yellow)',  title: 'Hire in 24 Hours',     desc: 'Post a job and receive qualified Pioneer applications within hours. Our matching surfaces the best candidates first.' },
  { icon: Users,     color: 'var(--purple)',  title: 'Invite-Only Jobs',     desc: 'Already know a great Pioneer? Use invite-only mode to work exclusively with trusted talent you\'ve vetted.' },
  { icon: DollarSign,color: 'var(--sand)',    title: 'Flexible Payments',    desc: 'Fixed, hourly, or milestone-based — you define the terms. Release payments on your schedule, not theirs.' },
  { icon: Award,     color: 'var(--red)',     title: 'Verified Ratings',     desc: 'Every review is tied to a completed job. Both parties rate each other — full transparency, no fake reviews.' },
];

export default function WhyUsSection() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-base)' }}>
      <div className="container-brand">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label">— Why Pioneer Platform —</span>
          <h2 className="section-title" style={{ marginBottom: 14 }}>
            Built for <span className="grad-warm">Africa's Future</span>
          </h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            More than a marketplace. A trust layer between clients and professionals, built with escrow, ratings, and milestone payments.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {REASONS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="card" style={{ display: 'flex', gap: 16, padding: 22 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `color-mix(in srgb, ${item.color} 12%, transparent)`, border: `1.5px solid color-mix(in srgb, ${item.color} 25%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.93rem', color: 'var(--text-primary)', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
