'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BadgeCheck, Clock, UserRound } from 'lucide-react';
import { RequireAuth } from '@/context/AuthContext';

type Application = { _id: string; coverLetter: string; proposedAmount: number; estimatedDays: number; status: string; freelancerId: { _id: string; name: string; location?: string; bio?: string; skills?: string[] } };
type Job = { _id: string; title: string; status: string; assignedFreelancerId?: string | null };

function ApplicationsContent() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  async function load() {
    const [jr, ar] = await Promise.all([fetch(`/api/jobs/${id}`), fetch(`/api/jobs/${id}/applications`)]);
    const [jd, ad] = await Promise.all([jr.json(), ar.json()]);
    if (!jr.ok || !ar.ok) throw new Error(ad.message || jd.message || 'Could not load applications.');
    setJob(jd.data.job); setApplications(ad.data.applications);
  }
  useEffect(() => { load().catch(e => setError(e.message)); }, [id]);
  async function assign(applicationId: string) {
    setBusy(applicationId); setNotice('');
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'assign', applicationId }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message);
      setNotice('Freelancer assigned. Fund the tITL escrow before work begins.'); await load();
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Assignment failed.'); }
    finally { setBusy(''); }
  }
  return <main className="container-brand" style={{ maxWidth: 950, paddingTop: 110, paddingBottom: 64 }}>
    <Link href={`/jobs/${id}`} className="back"><ArrowLeft size={16}/> Back to job</Link>
    {error ? <p role="alert" className="notice">{error}</p> : <>
      <h1 className="page-title">Applications</h1><p className="sub">{job?.title || 'Loading jobâ€¦'} Â· {applications.length} proposal{applications.length === 1 ? '' : 's'}</p>
      {notice && <p role="status" className="notice">{notice}</p>}
      {applications.length === 0 && <section className="empty">No applications yet. New proposals will appear here.</section>}
      <div className="list">{applications.map(app => <article key={app._id} className="card">
        <div className="person"><div className="avatar"><UserRound size={24}/></div><div style={{ minWidth: 0, flex: 1 }}><h2>{app.freelancerId.name} <BadgeCheck size={15} color="var(--green)"/></h2><p>{app.freelancerId.location || 'InterLink freelancer'}</p></div><span className={`state ${app.status}`}>{app.status}</span></div>
        <div className="offer"><strong>{app.proposedAmount} tITL</strong><span><Clock size={14}/> {app.estimatedDays} day delivery</span></div>
        <p className="letter">{app.coverLetter}</p>
        {!!app.freelancerId.skills?.length && <div className="skills">{app.freelancerId.skills.slice(0, 6).map(s => <span key={s}>{s}</span>)}</div>}
        <div className="actions"><Link href={`/freelancers/${app.freelancerId._id}`} className="btn-secondary">View profile</Link>{app.status === 'pending' && job?.status === 'open' && !job.assignedFreelancerId && <button className="btn-primary" disabled={!!busy} onClick={() => assign(app._id)}>{busy === app._id ? 'Assigningâ€¦' : 'Assign freelancer'}</button>}</div>
      </article>)}</div>
    </>}
    <style jsx>{`.back{display:inline-flex;align-items:center;gap:7px;color:var(--text-secondary);text-decoration:none;margin-bottom:18px}.page-title{font-size:clamp(1.7rem,5vw,2.5rem);color:var(--text-primary);margin:0 0 6px}.sub{color:var(--text-secondary);margin-bottom:20px}.notice,.empty{padding:16px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-secondary)}.list{display:grid;gap:12px}.card{padding:clamp(17px,4vw,24px);background:var(--bg-card);border:1px solid var(--border);border-radius:16px}.person{display:flex;align-items:center;gap:12px}.avatar{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:rgba(45,125,210,.15);color:var(--accent-bright);flex-shrink:0}.person h2{font-size:1rem;color:var(--text-primary);display:flex;gap:6px;align-items:center;margin:0 0 4px}.person p{font-size:.8rem;color:var(--text-muted);margin:0}.state{text-transform:capitalize;color:var(--text-secondary);font-size:.75rem}.state.accepted{color:var(--green)}.offer{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:17px 0 10px}.offer strong{font-size:1.1rem;color:var(--sand)}.offer span{display:flex;align-items:center;gap:5px;font-size:.82rem;color:var(--text-secondary)}.letter{white-space:pre-wrap;color:var(--text-secondary);line-height:1.7;font-size:.88rem}.skills{display:flex;gap:6px;flex-wrap:wrap}.skills span{font-size:.74rem;color:var(--text-muted);border:1px solid var(--border);border-radius:7px;padding:4px 8px}.actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}.actions :global(.btn-primary),.actions :global(.btn-secondary){justify-content:center;flex:1;min-width:145px}`}</style>
  </main>;
}

export default function ApplicationsPage() {
  return <RequireAuth roles={['client', 'freelancer', 'admin']}><ApplicationsContent /></RequireAuth>;
}
