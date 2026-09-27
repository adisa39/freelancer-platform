'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BriefcaseBusiness, Search, Users } from 'lucide-react';

type Job = { _id: string; title: string; description: string; category: string; skills: string[]; budgetMin: number; budgetMax: number; paymentType: string; status: string; posterId: { name: string; location?: string } };

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/jobs?status=open').then(r => r.json()).then(d => { if (d.success) setJobs(d.data.jobs); }).finally(() => setLoading(false)); }, []);
  const filtered = jobs.filter(job => `${job.title} ${job.category} ${job.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  return <main style={{ minHeight: '75vh', background: 'var(--bg-base)', paddingTop: 112, paddingBottom: 64 }}>
    <section className="container-brand" style={{ maxWidth: 1000 }}>
      <span className="section-label">Find your next project</span>
      <div className="list-head"><div><h1 style={{ fontSize: 'clamp(1.9rem,5vw,3rem)', margin: '9px 0' }}>Open <span className="grad-accent">jobs</span></h1><p style={{ color: 'var(--text-secondary)' }}>Browse projects posted by InterLink clients.</p></div><Link href="/post-job" className="btn-primary">Post a job</Link></div>
      <label className="search"><Search size={17}/><input aria-label="Search jobs" placeholder="Search title, category, or skill" value={query} onChange={e => setQuery(e.target.value)}/></label>
      {loading ? <p className="empty">Loading open jobs…</p> : filtered.length === 0 ? <div className="empty"><BriefcaseBusiness size={32}/><p>{jobs.length ? 'No jobs match your search.' : 'No jobs have been posted yet.'}</p><Link href="/post-job" className="btn-secondary">Post the first job</Link></div> : <div className="cards">{filtered.map(job => <Link key={job._id} href={`/jobs/${job._id}`} className="job-card">
        <div className="job-top"><div><span className="category">{job.category}</span><h2>{job.title}</h2></div><span className="status">{job.status.replace('_', ' ')}</span></div>
        <p className="description">{job.description}</p><div className="skills">{job.skills.slice(0, 5).map(skill => <span key={skill}>{skill}</span>)}</div>
        <div className="job-bottom"><strong>{job.budgetMin}–{job.budgetMax} ITL <small>· {job.paymentType}</small></strong><span><Users size={14}/>{job.posterId?.name || 'Client'}<span className="arrow">View job →</span></span></div>
      </Link>)}</div>}
    </section>
    <style jsx>{`.list-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:0 0 22px}.search{height:48px;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:11px;color:var(--text-muted);margin-bottom:16px}.search input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:var(--text-primary);font:inherit}.cards{display:grid;gap:12px}.job-card{display:block;padding:clamp(17px,3vw,23px);background:var(--bg-card);border:1px solid var(--border);border-radius:15px;text-decoration:none;transition:border-color .18s}.job-card:hover{border-color:var(--accent)}.job-top{display:flex;justify-content:space-between;gap:12px}.category{font-size:.72rem;color:var(--accent-bright);font-weight:700;text-transform:uppercase;letter-spacing:.08em}.job-top h2{font-size:1.05rem;color:var(--text-primary);margin:6px 0 0}.status{align-self:flex-start;color:var(--green);font-size:.75rem;text-transform:capitalize}.description{color:var(--text-secondary);font-size:.87rem;line-height:1.6;margin:14px 0}.skills{display:flex;flex-wrap:wrap;gap:6px}.skills span{padding:5px 8px;border:1px solid var(--border);border-radius:7px;color:var(--text-secondary);font-size:.74rem}.job-bottom{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--border);padding-top:13px;margin-top:15px}.job-bottom strong{color:var(--sand)}.job-bottom small{color:var(--text-muted);font-weight:400}.job-bottom>span{display:flex;align-items:center;gap:6px;color:var(--text-secondary);font-size:.8rem}.arrow{color:var(--accent-bright);margin-left:8px}.empty{display:grid;justify-items:center;gap:12px;text-align:center;padding:58px 16px;color:var(--text-secondary);background:var(--bg-card);border:1px solid var(--border);border-radius:15px}`}</style>
  </main>;
}
