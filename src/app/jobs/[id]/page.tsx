'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CircleDollarSign, Users } from 'lucide-react';

type Job = { _id: string; title: string; description: string; category: string; skills: string[]; budgetMin: number; budgetMax: number; paymentType: string; status: string; deadline?: string; posterId: { _id: string; name: string; location?: string }; assignedFreelancerId?: { _id: string; name: string } | null };

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedAmount, setProposedAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetch(`/api/jobs/${id}`).then(r => r.json()).then(data => data.success ? setJob(data.data.job) : setError(data.message || 'Job not found.')).catch(() => setError('Could not load this job.')); }, [id]);

  async function apply(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setNotice('');
    try {
      const res = await fetch(`/api/jobs/${id}/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ coverLetter, proposedAmount: Number(proposedAmount), estimatedDays: Number(estimatedDays) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Application could not be submitted.');
      setNotice('Application sent. The job poster can now review your proposal.'); setCoverLetter('');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Application could not be submitted.'); }
    finally { setBusy(false); }
  }

  if (error) return <main className="container-brand" style={{ paddingTop: 130, minHeight: '70vh' }}><p>{error}</p><Link href="/jobs" className="btn-secondary">Back to jobs</Link></main>;
  if (!job) return <main className="container-brand" style={{ paddingTop: 130, minHeight: '70vh', color: 'var(--text-secondary)' }}>Loading job…</main>;
  return <main className="container-brand" style={{ paddingTop: 110, paddingBottom: 64, maxWidth: 1060 }}>
    <Link href="/jobs" style={{ display: 'inline-flex', gap: 7, alignItems: 'center', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 20 }}><ArrowLeft size={16}/> All jobs</Link>
    <div className="job-detail-layout">
      <section style={{ minWidth: 0 }}>
        <article className="surface-card">
          <div style={{ color: 'var(--accent-bright)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>{job.category} · {job.status.replace('_', ' ')}</div>
          <h1 style={{ fontSize: 'clamp(1.65rem, 5vw, 2.5rem)', lineHeight: 1.2, margin: '10px 0 18px' }}>{job.title}</h1>
          <div className="job-facts"><span><CircleDollarSign size={16}/> {job.budgetMin}–{job.budgetMax} tITL</span><span><BriefcaseBusiness size={16}/> {job.paymentType}</span>{job.deadline && <span><CalendarDays size={16}/> Due {new Date(job.deadline).toLocaleDateString()}</span>}</div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 22, paddingTop: 20 }}><h2 className="detail-heading">About this job</h2><p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</p></div>
          <div style={{ marginTop: 22 }}><h2 className="detail-heading">Skills</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{job.skills.map(skill => <span key={skill} className="skill-chip">{skill}</span>)}</div></div>
        </article>
        <article className="surface-card" style={{ marginTop: 14 }}><h2 className="detail-heading">About the client</h2><p style={{ color: 'var(--text-primary)', fontWeight: 650 }}>{job.posterId.name}</p><p style={{ color: 'var(--text-secondary)', fontSize: '.88rem' }}>{job.posterId.location || 'InterLink member'}</p><Link href={`/jobs/${id}/applications`} className="applications-link">Review applications →</Link></article>
      </section>
      <aside className="surface-card apply-card">
        {job.assignedFreelancerId ? <><p style={{ color: 'var(--green)', fontWeight: 700 }}>Freelancer assigned</p><p>{job.assignedFreelancerId.name}</p></> : job.status !== 'open' ? <p>This job is no longer accepting applications.</p> : <>
          <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 7 }}><Users size={18} color="var(--accent-bright)"/><h2 className="detail-heading" style={{ margin: 0 }}>Apply for this job</h2></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem', marginBottom: 16 }}>Send a clear proposal. Your offer is not a payment; escrow starts after the client selects you.</p>
          <form onSubmit={apply} style={{ display: 'grid', gap: 12 }}>
            <label className="form-label">Proposal (at least 30 characters)<textarea required minLength={30} rows={6} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="input-brand" /></label>
            <label className="form-label">Your total price (tITL)<input required type="number" min="1" step="any" value={proposedAmount} onChange={e => setProposedAmount(e.target.value)} className="input-brand" /></label>
            <label className="form-label">Delivery time (days)<input required type="number" min="1" step="1" value={estimatedDays} onChange={e => setEstimatedDays(e.target.value)} className="input-brand" /></label>
            {notice && <p role="status" style={{ color: notice.includes('sent') ? 'var(--green)' : 'var(--red)', fontSize: '.84rem' }}>{notice}</p>}
            <button className="btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Submit application'}</button>
          </form>
        </>}
      </aside>
    </div>
    <style jsx>{`.surface-card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:clamp(18px,4vw,28px)}.detail-heading{font-family:var(--font-display);font-weight:700;font-size:1.05rem;color:var(--text-primary);margin-bottom:12px}.job-facts{display:flex;gap:12px 18px;flex-wrap:wrap;color:var(--text-secondary);font-size:.85rem}.job-facts span{display:inline-flex;align-items:center;gap:6px}.skill-chip{padding:6px 10px;border-radius:8px;background:var(--bg-base);border:1px solid var(--border);font-size:.8rem;color:var(--text-secondary)}.form-label{display:grid;gap:6px;color:var(--text-secondary);font-size:.8rem}.applications-link{display:inline-flex;margin-top:12px;color:var(--accent-bright);font-size:.85rem;text-decoration:none}.job-detail-layout{display:grid;gap:14px}@media(min-width:850px){.job-detail-layout{grid-template-columns:minmax(0,1fr) 350px}.apply-card{position:sticky;top:90px;height:max-content}}`}</style>
  </main>;
}
