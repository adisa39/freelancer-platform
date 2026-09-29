'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, Send, CheckCircle } from 'lucide-react';
import { JOB_CATEGORIES } from '@/lib/data';

interface MilestoneInput { title: string; description: string; amount: string; }

export default function PostJobPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [milestones, setMilestones] = useState<MilestoneInput[]>([{ title: '', description: '', amount: '' }]);
  const [form, setForm] = useState({
    title: '', description: '', category: '', tags: '',
    requiredSkills: '', requiredSkillLevel: '', jobType: 'project',
    paymentType: 'milestone', budgetMin: '', budgetMax: '', currency: 'tITL',
    paymentConditions: '', deadline: '', isInviteOnly: false,
  });

  const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '.9rem', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color .2s' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '.76rem', color: 'var(--text-secondary)', marginBottom: 6, fontFamily: 'var(--font-display)', fontWeight: 500 };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => e.target.style.borderColor = 'var(--accent)';
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => e.target.style.borderColor = 'var(--border)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        skills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        paymentType: form.paymentType,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        deadline: form.deadline || undefined,
      };
      const res = await fetch('/api/jobs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) router.push(`/jobs/${result.data.job._id}`);
      else { setStatus('error'); setErrorMessage(result.message || 'Could not post this job.'); }
    } catch { setStatus('error'); setErrorMessage('Could not connect to the job service.'); }
  };

  if (status === 'success') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: '100px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <CheckCircle size={56} style={{ color: 'var(--green)', margin: '0 auto 20px' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.7rem', color: 'var(--text-primary)', marginBottom: 12 }}>Job Posted!</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>Your job is now live. Linkers can browse and apply, or you can invite someone directly from their profile.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/dashboard" className="btn-primary">View Dashboard</Link>
          <button onClick={() => setStatus('idle')} className="btn-secondary">Post Another</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section style={{ paddingTop: 110, paddingBottom: 36, background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .45 }} />
        <div className="container-brand" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '.75rem', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: 10 }}>— Hire a Linker —</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            Post a <span style={{ background: 'linear-gradient(135deg,var(--sand),var(--accent-bright))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Translation Job</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Any registered user can post jobs. Fields map to <code style={{ fontSize: '.8rem', color: 'var(--accent-bright)', background: 'rgba(45,125,210,.1)', padding: '2px 6px', borderRadius: 4 }}>POST /api/jobs</code></p>
        </div>
      </section>

      <section style={{ background: 'var(--bg-base)', padding: '32px 0 72px' }}>
        <div className="container-brand">
          <div style={{ display: 'grid', gap: 32, alignItems: 'start' }} className="post-grid">
            <form onSubmit={handleSubmit}>
              {/* Job Details */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(20px,5vw,36px)', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 4 }}>Job Details</h2>
                <p style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: 22 }}>Describe the translation work needed.</p>

                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Job Title *</label>
                  <input style={inp} required placeholder="e.g. Swahili → English Legal Contract Translation" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Description *</label>
                  <textarea style={{ ...inp, minHeight: 100, resize: 'vertical' as const }} required rows={4} placeholder="Describe the scope, required expertise, file format, and deliverables..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={lbl}>Category *</label>
                    <select style={inp} required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} onFocus={focus} onBlur={blur}>
                      <option value="">Select category...</option>
                      {JOB_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.id}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Job Type *</label>
                    <select style={inp} value={form.jobType} onChange={e => setForm(f => ({ ...f, jobType: e.target.value }))} onFocus={focus} onBlur={blur}>
                      <option value="project">Project</option>
                      <option value="freelance">Freelance</option>
                      <option value="contract">Contract</option>
                      <option value="full_time">Full-time</option>
                      <option value="part_time">Part-time</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={lbl}>Required Skill Level</label>
                    <select style={inp} value={form.requiredSkillLevel} onChange={e => setForm(f => ({ ...f, requiredSkillLevel: e.target.value }))} onFocus={focus} onBlur={blur}>
                      <option value="">Any level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Deadline</label>
                    <input style={inp} type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Required Skills * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
                  <input style={inp} required placeholder="e.g. Swahili, English, Legal Translation" value={form.requiredSkills} onChange={e => setForm(f => ({ ...f, requiredSkills: e.target.value }))} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={lbl}>Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
                  <input style={inp} placeholder="e.g. urgent, certified, court-accepted" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              {/* Budget & Payment */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(20px,5vw,36px)', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 4 }}>Budget & Payment</h2>
                <p style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: 22 }}>Set your budget and payment release conditions.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={lbl}>Min Budget (tITL) *</label>
                    <input style={inp} type="number" required min="1" placeholder="e.g. 400" value={form.budgetMin} onChange={e => setForm(f => ({ ...f, budgetMin: e.target.value }))} onFocus={focus} onBlur={blur} />
                  </div>
                  <div>
                    <label style={lbl}>Max Budget (tITL) *</label>
                    <input style={inp} type="number" required min="1" placeholder="e.g. 800" value={form.budgetMax} onChange={e => setForm(f => ({ ...f, budgetMax: e.target.value }))} onFocus={focus} onBlur={blur} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Payment Type *</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[['milestone', 'Milestone'], ['fixed', 'Fixed'], ['hourly', 'Hourly']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(f => ({ ...f, paymentType: val }))} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid', cursor: 'pointer', transition: 'all .2s', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.82rem', borderColor: form.paymentType === val ? 'var(--accent)' : 'var(--border)', background: form.paymentType === val ? 'rgba(45,125,210,.12)' : 'transparent', color: form.paymentType === val ? 'var(--accent-bright)' : 'var(--text-secondary)' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={lbl}>Payment Conditions *</label>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                    e.g. "30% upfront, 40% on milestone 1, 30% on final delivery and sign-off"
                  </div>
                  <textarea style={{ ...inp, minHeight: 72, resize: 'vertical' as const }} required rows={2} placeholder="Describe when payments will be released..." value={form.paymentConditions} onChange={e => setForm(f => ({ ...f, paymentConditions: e.target.value }))} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              {/* Milestones */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(20px,5vw,36px)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Milestones <span style={{ fontSize: '.78rem', color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span></h2>
                </div>
                <p style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: 18 }}>Break the project into paid milestones for clearer deliverables.</p>
                {milestones.map((m, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 10, alignItems: 'end' }}>
                    <div>
                      {i === 0 && <label style={lbl}>Milestone Title</label>}
                      <input style={inp} placeholder={`Milestone ${i + 1} title`} value={m.title} onChange={e => setMilestones(ms => ms.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                      {i === 0 && <label style={lbl}>Amount (tITL)</label>}
                      <input style={inp} type="number" placeholder="$" value={m.amount} onChange={e => setMilestones(ms => ms.map((x, j) => j === i ? { ...x, amount: e.target.value } : x))} onFocus={focus} onBlur={blur} />
                    </div>
                    <button type="button" onClick={() => setMilestones(ms => ms.filter((_, j) => j !== i))} style={{ width: 38, height: 38, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: i === 0 ? 0 : 0 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setMilestones(ms => [...ms, { title: '', description: '', amount: '' }])} style={{ fontSize: '.82rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
                  <Plus size={14} /> Add Milestone
                </button>
              </div>

              {/* Settings */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(20px,5vw,36px)', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 18 }}>Job Settings</h2>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isInviteOnly} onChange={e => setForm(f => ({ ...f, isInviteOnly: e.target.checked }))} style={{ marginTop: 2, width: 16, height: 16 }} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.9rem', color: 'var(--text-primary)', marginBottom: 3 }}>Invite-Only Job</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Only Linkers you explicitly invite can apply. Use this when you already have a trusted freelancer in mind.</div>
                  </div>
                </label>
              </div>

              {status === 'error' && <div role="alert" style={{ background: 'rgba(232,76,76,.1)', border: '1px solid rgba(232,76,76,.3)', borderRadius: 8, padding: '10px 14px', fontSize: '.82rem', color: 'var(--red)', marginBottom: 16 }}>{errorMessage}</div>}

              <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
                {status === 'loading' ? 'Posting...' : <><Send size={16} /> Post Job</>}
              </button>
            </form>

            {/* Sidebar tips */}
            <div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 22, marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.95rem', color: 'var(--text-primary)', marginBottom: 14 }}>💡 Tips for Great Job Posts</h3>
                {['Be specific about the work and expected outcome','List the skills or experience you need','Describe the deliverables and review process','State your preferred deadline clearly','Clear payment terms attract better Linkers'].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <span style={{ color: 'var(--accent)', fontSize: '.8rem', marginTop: 1, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(45,125,210,.2)', borderRadius: 16, padding: 22 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.95rem', color: 'var(--text-primary)', marginBottom: 10 }}>🔌 API Endpoint</h3>
                <code style={{ fontSize: '.78rem', color: 'var(--accent-bright)', lineHeight: 1.8, display: 'block' }}>
                  POST /api/jobs<br />
                  Authorization: Bearer &lt;token&gt;<br /><br />
                  Body: title, description,<br />
                  category, requiredSkills,<br />
                  budget, paymentType,<br />
                  paymentConditions,<br />
                  milestones, isInviteOnly
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        @media(min-width:900px){.post-grid{grid-template-columns:1fr 320px!important}}
        select option{background:#111820}
      `}</style>
    </>
  );
}
