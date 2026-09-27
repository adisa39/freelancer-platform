'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BadgeCheck, Briefcase, MapPin, UserRound } from 'lucide-react';

type Freelancer = { _id: string; name: string; location?: string; bio?: string; languages?: string[]; skills?: string[]; completedJobs: number; activeJobs: { _id: string; title: string; category: string }[] };

export default function FreelancerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Freelancer | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { fetch(`/api/freelancers/${id}`).then(r => r.json()).then(data => data.success ? setPerson(data.data.freelancer) : setError(data.message)).catch(() => setError('Could not load this profile.')); }, [id]);
  if (error) return <main className="container-brand" style={{ paddingTop: 130, minHeight: '70vh' }}><p>{error}</p><Link href="/pioneers" className="btn-secondary">Browse freelancers</Link></main>;
  if (!person) return <main className="container-brand" style={{ paddingTop: 130, minHeight: '70vh' }}>Loading profile…</main>;
  return <main className="container-brand" style={{ paddingTop: 110, paddingBottom: 64, maxWidth: 900 }}>
    <Link href="/pioneers" style={{ display: 'inline-flex', gap: 7, alignItems: 'center', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 18 }}><ArrowLeft size={16}/> Browse freelancers</Link>
    <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 'clamp(22px,5vw,38px)' }}>
      <div className="profile-head"><div className="avatar"><UserRound size={34}/></div><div style={{ minWidth: 0 }}><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}><h1 style={{ fontSize: 'clamp(1.5rem,4vw,2.1rem)', margin: 0 }}>{person.name}</h1><BadgeCheck size={19} color="var(--green)"/></div><p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5, margin: '8px 0 0' }}><MapPin size={14}/>{person.location || 'InterLink freelancer'}</p></div></div>
      <div className="stats"><div><strong>{person.completedJobs}</strong><span>Completed jobs</span></div><div><strong>{person.activeJobs.length}</strong><span>Active projects</span></div></div>
      <h2 className="heading">Profile</h2><p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{person.bio || 'This freelancer has not added a profile introduction yet.'}</p>
      <h2 className="heading" style={{ marginTop: 24 }}>Skills</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{(person.skills || []).length ? person.skills?.map(skill => <span key={skill} className="chip">{skill}</span>) : <span style={{ color: 'var(--text-muted)' }}>No skills listed yet.</span>}</div>
      <h2 className="heading" style={{ marginTop: 24 }}>Languages</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{(person.languages || []).length ? person.languages?.map(lang => <span key={lang} className="chip">{lang}</span>) : <span style={{ color: 'var(--text-muted)' }}>No languages listed yet.</span>}</div>
    </section>
    <section style={{ marginTop: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 'clamp(20px,4vw,30px)' }}><h2 className="heading"><Briefcase size={18}/> Current work</h2>{person.activeJobs.length ? person.activeJobs.map(job => <Link key={job._id} href={`/jobs/${job._id}`} className="active-job"><span>{job.title}</span><span>{job.category}</span></Link>) : <p style={{ color: 'var(--text-secondary)' }}>No active work at the moment.</p>}</section>
    <style jsx>{`.profile-head{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.avatar{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;background:rgba(45,125,210,.15);color:var(--accent-bright);flex-shrink:0}.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:24px 0;padding:14px 0;border-block:1px solid var(--border)}.stats div{display:grid;gap:4px}.stats strong{font-size:1.25rem;color:var(--text-primary)}.stats span{font-size:.78rem;color:var(--text-muted)}.heading{display:flex;align-items:center;gap:8px;font-family:var(--font-display);font-size:1rem;color:var(--text-primary);margin:0 0 10px}.chip{padding:6px 10px;border-radius:8px;background:var(--bg-base);border:1px solid var(--border);font-size:.8rem;color:var(--text-secondary)}.active-job{display:flex;justify-content:space-between;gap:10px;padding:13px 0;border-bottom:1px solid var(--border);color:var(--text-primary);text-decoration:none}.active-job span+span{color:var(--text-muted);font-size:.8rem}`}</style>
  </main>;
}
