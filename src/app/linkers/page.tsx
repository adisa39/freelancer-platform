'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, UserRound } from 'lucide-react';

type Freelancer = { _id: string; name: string; location?: string; bio?: string; skills: string[]; completedJobs: number };

export default function LinkersPage() {
  const [people, setPeople] = useState<Freelancer[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/freelancers').then(r => r.json()).then(data => { if (data.success) setPeople(data.data.freelancers); }).finally(() => setLoading(false)); }, []);
  const filtered = people.filter(p => `${p.name} ${p.bio || ''} ${(p.skills || []).join(' ')} ${p.location || ''}`.toLowerCase().includes(query.toLowerCase()));
  
  return <main 
    style={{ 
      minHeight: '75vh', 
      paddingTop: 112, 
      paddingBottom: 64, 
      background: 'var(--bg-base)'       
    }}>
      <section 
        className="container-brand" 
        style={{ maxWidth: 1000 }}
      >
        <span className="section-label">
          Find trusted talent
        </span>

        <div className="head">
          <div>
            <h1 style={{ fontSize: 'clamp(1.9rem,5vw,3rem)', margin: '9px 0' }}>
              Freelancer <span className="grad-accent">profiles</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Explore profiles and invite the right person to your next project.
            </p>
          </div>
        </div>
        <label className="search">
          <Search size={17}/>
          <input 
            aria-label="Search freelancers" 
            placeholder="Search by name, skill, or location" 
            value={query} 
            onChange={e => setQuery(e.target.value)}
          />
        </label>
        {loading ? 
          <p className="empty">
            Loading Freelancers…
          </p> : filtered.length ? <div className="cards">{filtered.map(p => <Link className="person" key={p._id} href={`/linkers/${p._id}`}><div className="avatar"><UserRound size={24}/></div><div className="person-copy"><h2>{p.name}</h2><p><MapPin size={13}/>{p.location || 'InterLink member'} · {p.completedJobs} completed jobs</p><p className="bio">{p.bio || 'Linker profile'}</p><div className="skills">{(p.skills || []).slice(0, 5).map(skill => <span key={skill}>{skill}</span>)}</div></div><span className="view">View profile →</span></Link>)}</div> : <div className="empty"><UserRound size={32}/><p>{people.length ? 'No profiles match your search.' : 'Freelancers will appear here after they create an account.'}</p></div>}
        
        <style jsx>
          {`.head{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;margin-bottom:20px}.search{height:48px;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:11px;color:var(--text-muted);margin-bottom:14px}.search input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:var(--text-primary);font:inherit}.cards{display:grid;gap:11px}.person{display:flex;align-items:flex-start;gap:13px;padding:18px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;text-decoration:none;transition:border-color .18s}.person:hover{border-color:var(--accent)}.avatar{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:rgba(45,125,210,.15);color:var(--accent-bright);flex-shrink:0}.person-copy{min-width:0;flex:1}.person h2{font-size:1rem;color:var(--text-primary);margin:0 0 5px}.person p{display:flex;align-items:center;gap:4px;color:var(--text-muted);font-size:.78rem;margin:0 0 7px}.person .bio{color:var(--text-secondary);line-height:1.5;font-size:.83rem}.skills{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}.skills span{padding:4px 7px;border-radius:6px;border:1px solid var(--border);color:var(--text-secondary);font-size:.72rem}.view{align-self:center;color:var(--accent-bright);font-size:.8rem;white-space:nowrap}.empty{display:grid;justify-items:center;gap:10px;text-align:center;padding:55px 14px;border:1px solid var(--border);border-radius:14px;background:var(--bg-card);color:var(--text-secondary)}@media(max-width:520px){.person{flex-wrap:wrap}.view{margin-left:59px}}`}
        </style>
      </section>
  </main>;
}
