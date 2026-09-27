'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JOB_CATEGORIES } from '@/lib/data';

export default function CategoriesSection() {
  return (
    <section className="section-pad" style={{ background: 'var(--bg-surface)' }}>
      <div className="container-brand">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label">— Browse by Category —</span>
          <h2 className="section-title" style={{ marginBottom: 14 }}>
            Every Skill, <span className="grad-accent">One Platform</span>
          </h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            From code to creative, strategy to science — find or post jobs across any professional discipline.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {JOB_CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/jobs?category=${encodeURIComponent(cat.id)}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '22px 20px', cursor: 'pointer' }}>
                <div style={{ fontSize: '1.7rem', marginBottom: 12 }}>{cat.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 5 }}>{cat.id}</h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{cat.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', color: cat.color, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                  Browse <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
