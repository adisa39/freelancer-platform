'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, BadgeCheck, Briefcase, MapPin, UserRound } from 'lucide-react';

type Freelancer = {
  _id: string;
  name: string;
  location?: string;
  bio?: string;
  languages?: string[];
  skills?: string[];
  portfolio?: string;
  hourlyRate?: number;
  skillLevel?: string;
  availability?: string;
  experienceYears?: number;
  education?: string[];
  certifications?: string[];
  completedJobs: number;
  activeJobs: { _id: string; title: string; category: string }[];
};

export default function FreelancerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Freelancer | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(`/api/freelancers/${id}`)
      .then(response => response.json())
      .then(data => data.success ? setPerson(data.data.freelancer) : setError(data.message))
      .catch(() => setError('Could not load this profile.'));
  }, [id]);

  if (error) return <main className="container-brand" style={{ paddingTop: 130, minHeight: '70vh' }}><p>{error}</p><Link href="/linkers" className="btn-secondary">Browse Linkers</Link></main>;
  if (!person) return <main className="container-brand" style={{ paddingTop: 130, minHeight: '70vh' }}>Loading profile…</main>;

  return <main className="container-brand linker-profile-page">
    <Link href="/linkers" className="back-link"><ArrowLeft size={16} /> Browse Linkers</Link>
    <section className="profile-card">
      <header className="profile-head">
        <div className="avatar"><UserRound size={34} /></div>
        <div className="profile-intro">
          <div className="profile-title"><h1>{person.name}</h1><BadgeCheck size={19} color="var(--green)" /></div>
          <p className="location"><MapPin size={14} />{person.location || 'InterLink freelancer'}</p>
          <span className={`availability availability-${person.availability || 'available'}`}>{(person.availability || 'available').replace('_', ' ')}</span>
        </div>
        <div className="rate-block">{person.hourlyRate ? <><strong>{person.hourlyRate} tITL</strong><span>per hour</span></> : <span>Rate available on request</span>}</div>
      </header>
      <div className="stats"><div><strong>{person.completedJobs}</strong><span>Completed jobs</span></div><div><strong>{person.activeJobs?.length || 0}</strong><span>Active projects</span></div><div><strong>{person.experienceYears ?? '—'}</strong><span>Years experience</span></div><div><strong>{person.skillLevel || '—'}</strong><span>Experience level</span></div></div>
      <section className="profile-section"><h2>About</h2><p>{person.bio || 'This freelancer has not added a profile introduction yet.'}</p></section>
      <section className="profile-section"><h2>Skills</h2><div className="chips">{person.skills?.length ? person.skills.map(skill => <span className="chip" key={skill}>{skill}</span>) : <span className="muted">No skills listed yet.</span>}</div></section>
      <section className="profile-section"><h2>Languages</h2><div className="chips">{person.languages?.length ? person.languages.map(language => <span className="chip" key={language}>{language}</span>) : <span className="muted">No languages listed yet.</span>}</div></section>
      {(person.education?.length || person.certifications?.length) ? <section className="profile-section details-grid">
        {person.education?.length ? <div><h2>Education</h2><ul>{person.education.map(item => <li key={item}>{item}</li>)}</ul></div> : null}
        {person.certifications?.length ? <div><h2>Certifications</h2><ul>{person.certifications.map(item => <li key={item}>{item}</li>)}</ul></div> : null}
      </section> : null}
      {person.portfolio ? <a className="portfolio-link" href={person.portfolio} target="_blank" rel="noreferrer">View portfolio <ArrowUpRight size={15} /></a> : null}
    </section>
    <section className="work-card"><h2><Briefcase size={18} /> Current work</h2>{person.activeJobs?.length ? person.activeJobs.map(job => <Link key={job._id} href={`/jobs/${job._id}`} className="active-job"><span>{job.title}</span><span>{job.category}</span></Link>) : <p className="muted">No active work at the moment.</p>}</section>
    <style jsx>{`.linker-profile-page{padding-top:110px;padding-bottom:64px;max-width:900px}.back-link{display:inline-flex;gap:7px;align-items:center;color:var(--text-secondary);text-decoration:none;margin-bottom:18px}.profile-card,.work-card{background:var(--bg-card);border:1px solid var(--border);border-radius:18px;padding:clamp(22px,5vw,38px)}.profile-head{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.avatar{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 15%,transparent);color:var(--accent-bright);flex-shrink:0}.profile-intro{min-width:0;flex:1}.profile-title{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.profile-title h1{font-family:var(--font-display);font-size:clamp(1.5rem,4vw,2.1rem);margin:0;color:var(--text-primary)}.location{color:var(--text-secondary);display:flex;align-items:center;gap:5px;margin:8px 0}.availability{display:inline-block;padding:4px 9px;border-radius:99px;background:var(--bg-base);color:var(--text-secondary);font-size:.72rem;text-transform:capitalize}.availability-available{background:color-mix(in srgb,var(--green) 13%,transparent);color:var(--green)}.rate-block{display:grid;gap:3px;text-align:right;color:var(--text-muted);font-size:.76rem}.rate-block strong{color:var(--sand);font:700 1.1rem var(--font-display)}.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:24px 0;padding:16px 0;border-block:1px solid var(--border)}.stats div{display:grid;gap:4px}.stats strong{font-size:1.12rem;color:var(--text-primary);text-transform:capitalize}.stats span,.muted{font-size:.78rem;color:var(--text-muted)}.profile-section{margin-top:20px}.profile-section h2,.work-card h2{font:700 1rem var(--font-display);color:var(--text-primary);margin:0 0 10px}.profile-section p{color:var(--text-secondary);line-height:1.8;margin:0}.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{padding:6px 10px;border-radius:8px;background:var(--bg-base);border:1px solid var(--border);font-size:.8rem;color:var(--text-secondary)}.details-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.details-grid ul{margin:0;padding-left:18px;color:var(--text-secondary);font-size:.86rem;line-height:1.8}.portfolio-link{display:inline-flex;align-items:center;gap:6px;margin-top:24px;color:var(--accent-bright);font-weight:600;text-decoration:none}.work-card{margin-top:16px}.work-card h2{display:flex;align-items:center;gap:8px}.active-job{display:flex;justify-content:space-between;gap:10px;padding:13px 0;border-top:1px solid var(--border);color:var(--text-primary);text-decoration:none}.active-job span+span{color:var(--text-muted);font-size:.8rem}@media(max-width:620px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.details-grid{grid-template-columns:1fr}.rate-block{text-align:left;margin-left:84px}}`}</style>
  </main>;
}