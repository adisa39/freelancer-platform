'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, MapPin, Plus, Save, UserRound } from 'lucide-react';
import { RequireAuth, useAuth } from '@/context/AuthContext';
import DashboardShell, { type DashTab } from '@/components/dashboard/DashboardShell';

type DashboardJob = {
  _id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  paymentType: string;
  status: string;
  deadline?: string;
  createdAt: string;
};

type ProfileForm = {
  name: string;
  phone: string;
  company: string;
  location: string;
  bio: string;
  portfolio: string;
  skills: string;
  languages: string;
  hourlyRate: string;
  skillLevel: string;
  availability: string;
  experienceYears: string;
  education: string;
  certifications: string;
};

const TITLES: Record<DashTab, string> = { overview: 'Overview', jobs: 'Posted jobs', profile: 'Profile settings' };
const stringValue = (value: unknown) => typeof value === 'string' ? value : '';
const listValue = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').join(', ') : '';
const linesValue = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').join('\n') : '';

function profileFromUser(user: NonNullable<ReturnType<typeof useAuth>['user']>): ProfileForm {
  return {
    name: user.name || '',
    phone: stringValue(user.phone),
    company: stringValue(user.company),
    location: stringValue(user.location),
    bio: stringValue(user.bio),
    portfolio: stringValue(user.portfolio),
    skills: listValue(user.skills),
    languages: listValue(user.languages),
    hourlyRate: user.hourlyRate == null ? '' : String(user.hourlyRate),
    skillLevel: stringValue(user.skillLevel),
    availability: stringValue(user.availability) || 'available',
    experienceYears: user.experienceYears == null ? '' : String(user.experienceYears),
    education: linesValue(user.education),
    certifications: linesValue(user.certifications),
  };
}

function splitList(value: string) {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}
function splitLines(value: string) {
  return value.split('\n').map(item => item.trim()).filter(Boolean);
}

function DashboardContent() {
  const router = useRouter();
  const { user, refresh, signOut } = useAuth();
  const [tab, setTab] = useState<DashTab>('overview');
  const [jobs, setJobs] = useState<DashboardJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const isFreelancer = user?.role === 'freelancer';

  useEffect(() => {
    if (!user) return;
    setProfile(profileFromUser(user));
    let active = true;
    fetch('/api/jobs?mine=true', { credentials: 'same-origin', cache: 'no-store' })
      .then(response => response.json())
      .then(payload => { if (active && payload.success) setJobs(payload.data.jobs as DashboardJob[]); })
      .catch(() => undefined)
      .finally(() => { if (active) setJobsLoading(false); });
    return () => { active = false; };
  }, [user]);

  const openJobs = jobs.filter(job => job.status === 'open').length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const fields = isFreelancer
      ? [profile.name, profile.location, profile.bio, profile.skills, profile.languages, profile.portfolio, profile.hourlyRate, profile.experienceYears]
      : [profile.name, profile.location, profile.phone, profile.company, profile.bio];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  }, [isFreelancer, profile]);

  const handleSignOut = async () => { await signOut(); router.replace('/login'); router.refresh(); };
  const update = (field: keyof ProfileForm, value: string) => setProfile(current => current ? { ...current, [field]: value } : current);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaveMessage('');
    setSaveError('');
    const payload: Record<string, unknown> = {
      name: profile.name,
      phone: profile.phone,
      company: profile.company,
      location: profile.location,
      bio: profile.bio,
    };
    if (isFreelancer) Object.assign(payload, {
      portfolio: profile.portfolio,
      skills: splitList(profile.skills),
      languages: splitList(profile.languages),
      hourlyRate: profile.hourlyRate ? Number(profile.hourlyRate) : 0,
      skillLevel: profile.skillLevel || 'beginner',
      availability: profile.availability,
      experienceYears: profile.experienceYears ? Number(profile.experienceYears) : 0,
      education: splitLines(profile.education),
      certifications: splitLines(profile.certifications),
    });

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Profile settings could not be saved.');
      await refresh();
      setSaveMessage('Your profile settings have been saved.');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Profile settings could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  if (!user || !profile) return null;

  const profileField = (label: string, field: keyof ProfileForm, props: { type?: string; placeholder?: string; min?: string; max?: string } = {}) => (
    <label className="bf-dash-field" key={field}>
      <span>{label}</span>
      <input className="input-brand" type={props.type || 'text'} min={props.min} max={props.max} placeholder={props.placeholder} value={profile[field]} onChange={event => update(field, event.target.value)} />
    </label>
  );

  return (
    <DashboardShell title={TITLES[tab]} tab={tab} onTab={setTab} user={user} onSignOut={() => void handleSignOut()}>
      {tab === 'overview' && <>
        <section className="bf-dash-welcome">
          <div><span className="bf-dash-eyebrow">Your marketplace at a glance</span><h2>Welcome back, {user.name.split(' ')[0] || 'there'}</h2><p>{isFreelancer ? 'Manage the work you post, find new opportunities, and keep your professional profile up to date.' : 'Post opportunities, find skilled talent, and manage your projects from one place.'}</p></div>
          <Link href="/post-job" className="bf-dash-btn"><Plus size={16} />Post a job</Link>
        </section>
        <div className="bf-dash-widgets">
          {[
            { icon: BriefcaseBusiness, label: 'Jobs posted', value: jobsLoading ? '—' : jobs.length },
            { icon: Clock3, label: 'Open jobs', value: jobsLoading ? '—' : openJobs },
            { icon: CheckCircle2, label: 'Completed jobs', value: jobsLoading ? '—' : completedJobs },
            { icon: UserRound, label: 'Profile complete', value: `${profileCompletion}%` },
          ].map(({ icon: Icon, label, value }) => <article key={label} className="bf-dash-widget"><span className="bf-dash-widget__icon"><Icon size={20} /></span><span className="bf-dash-widget__text">{label}</span><strong className="bf-dash-widget__number">{value}</strong></article>)}
        </div>
        <section className="bf-dash-card bf-dash-recent">
          <div className="bf-dash-section-head"><div><h2>Recently posted</h2><p>Jobs created from this account</p></div><button type="button" className="bf-dash-btn ghost" onClick={() => setTab('jobs')}>View all jobs <ArrowUpRight size={15} /></button></div>
          {jobsLoading ? <p className="bf-dash-muted">Loading your jobs…</p> : jobs.length ? <div className="bf-dash-job-list">{jobs.slice(0, 4).map(job => <Link className="bf-dash-job" href={`/jobs/${job._id}`} key={job._id}><span className="bf-dash-job-icon"><BriefcaseBusiness size={17} /></span><span className="bf-dash-job-main"><strong>{job.title}</strong><small>{job.category} · {job.skills.slice(0, 3).join(', ')}</small></span><span className={`bf-dash-status is-${job.status}`}>{job.status.replace('_', ' ')}</span></Link>)}</div> : <div className="bf-dash-empty-state"><p>You haven’t posted a job yet.</p><Link href="/post-job" className="bf-dash-btn"><Plus size={15} />Post your first job</Link></div>}
        </section>
        <section className="bf-dash-profile-prompt"><div><strong>Complete your profile</strong><p>{isFreelancer ? 'Add your skills, languages, experience and portfolio so clients can understand what you offer.' : 'Add your company and contact details to help freelancers work with you.'}</p></div><div className="bf-dash-progress"><span style={{ width: `${profileCompletion}%` }} /></div><button type="button" className="bf-dash-btn ghost" onClick={() => setTab('profile')}>Edit profile</button></section>
      </>}

      {tab === 'jobs' && <section className="bf-dash-card">
        <div className="bf-dash-section-head"><div><span className="bf-dash-eyebrow">Your workspace</span><h2>Jobs you’ve posted</h2><p>Clients and freelancers can both create jobs on BF Blessy.</p></div><Link href="/post-job" className="bf-dash-btn"><Plus size={16} />Post a job</Link></div>
        {jobsLoading ? <p className="bf-dash-muted">Loading your jobs…</p> : jobs.length ? <div className="bf-dash-job-list">{jobs.map(job => <Link className="bf-dash-job" href={`/jobs/${job._id}`} key={job._id}><span className="bf-dash-job-icon"><BriefcaseBusiness size={17} /></span><span className="bf-dash-job-main"><strong>{job.title}</strong><small>{job.category} · {job.budgetMin}–{job.budgetMax} tITL · {job.paymentType}</small><small>{job.skills.join(', ')}</small></span><span className={`bf-dash-status is-${job.status}`}>{job.status.replace('_', ' ')}</span></Link>)}</div> : <div className="bf-dash-empty-state"><p>There are no jobs linked to this account yet.</p><Link href="/post-job" className="bf-dash-btn"><Plus size={15} />Post a job</Link></div>}
      </section>}

      {tab === 'profile' && <form className="bf-dash-profile-form" onSubmit={saveProfile}>
        <section className="bf-dash-card">
          <div className="bf-dash-section-head"><div><span className="bf-dash-eyebrow">Account settings</span><h2>Profile settings</h2><p>Keep your account and public details current.</p></div><div className="bf-dash-profile-header-actions">{isFreelancer && <Link href={`/linkers/${user._id}`} className="bf-dash-btn ghost">Preview profile <ArrowUpRight size={15} /></Link>}<span className="bf-dash-completion">{profileCompletion}% complete</span></div></div>
          <div className="bf-dash-form-grid">
            {profileField('Full name', 'name', { placeholder: 'Your name' })}
            {profileField('Phone', 'phone', { placeholder: 'Phone number' })}
            {!isFreelancer && profileField('Company or organisation', 'company', { placeholder: 'Company name' })}
            {profileField('Location', 'location', { placeholder: 'City, country' })}
          </div>
          <label className="bf-dash-field bf-dash-field-full"><span>About you</span><textarea className="input-brand" rows={4} maxLength={2000} placeholder={isFreelancer ? 'Introduce your experience and the work you do.' : 'Tell freelancers a little about your organisation and projects.'} value={profile.bio} onChange={event => update('bio', event.target.value)} /></label>
        </section>

        {isFreelancer && <section className="bf-dash-card">
          <div className="bf-dash-section-head"><div><span className="bf-dash-eyebrow">Freelancer details</span><h2>Your professional profile</h2><p>Share the information clients need to assess your experience.</p></div></div>
          <div className="bf-dash-form-grid">
            {profileField('Portfolio URL', 'portfolio', { placeholder: 'https://your-portfolio.example' })}
            {profileField('Hourly rate (tITL)', 'hourlyRate', { type: 'number', min: '0', placeholder: 'e.g. 40' })}
            {profileField('Years of experience', 'experienceYears', { type: 'number', min: '0', max: '60', placeholder: 'e.g. 5' })}
            <label className="bf-dash-field"><span>Experience level</span><select className="input-brand" value={profile.skillLevel} onChange={event => update('skillLevel', event.target.value)}><option value="">Choose a level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option></select></label>
            <label className="bf-dash-field"><span>Availability</span><select className="input-brand" value={profile.availability} onChange={event => update('availability', event.target.value)}><option value="available">Available for work</option><option value="limited">Limited availability</option><option value="unavailable">Not available</option></select></label>
            <label className="bf-dash-field"><span>Skills <small>(comma separated)</small></span><textarea className="input-brand" rows={3} placeholder="Translation, proofreading, localisation" value={profile.skills} onChange={event => update('skills', event.target.value)} /></label>
            <label className="bf-dash-field"><span>Languages <small>(comma separated)</small></span><textarea className="input-brand" rows={3} placeholder="English, Swahili" value={profile.languages} onChange={event => update('languages', event.target.value)} /></label>
            <label className="bf-dash-field"><span>Education <small>(one per line)</small></span><textarea className="input-brand" rows={3} placeholder="Degree, institution, year" value={profile.education} onChange={event => update('education', event.target.value)} /></label>
            <label className="bf-dash-field"><span>Certifications <small>(one per line)</small></span><textarea className="input-brand" rows={3} placeholder="Certification or credential" value={profile.certifications} onChange={event => update('certifications', event.target.value)} /></label>
          </div>
        </section>}

        {saveError && <p className="bf-dash-form-error" role="alert">{saveError}</p>}
        {saveMessage && <p className="bf-dash-form-success" role="status">{saveMessage}</p>}
        <div className="bf-dash-form-actions"><span>Your settings are saved to your BF Blessy account.</span><button type="submit" className="bf-dash-btn" disabled={saving}><Save size={16} />{saving ? 'Saving…' : 'Save changes'}</button></div>
      </form>}
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return <RequireAuth><DashboardContent /></RequireAuth>;
}