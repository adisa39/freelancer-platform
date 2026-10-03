'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Users, CheckCircle, DollarSign, Plus, Bell, LogOut, Star, Clock, ArrowRight, Send, LayoutGrid, BriefcaseBusiness, ClipboardList, WalletCards, UserRound } from 'lucide-react';
import { JOB_STATUS_CONFIG, APP_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/lib/data';
import { RequireAuth, useAuth } from '@/context/AuthContext';

const MOCK_STATS = { postedJobs: { total: 4, active: 2, completed: 9 }, workHistory: { applied: 17, completed: 3 }, reputation: { rating: 4.8, reviews: 12 } };
const MOCK_JOBS = [
  { _id: '1', title: 'Swahili â†’ English Legal Contract', assignedTo: 'Fatima Al-Hassan', status: 'in_progress', budget: { min: 400, max: 800, currency: 'USD' }, applicationsCount: 3, deadline: '2024-01-20' },
  { _id: '2', title: 'Arabic Medical Report (200 pages)', assignedTo: null, status: 'open', budget: { min: 1200, max: 2000, currency: 'USD' }, applicationsCount: 7, deadline: '2024-01-25' },
  { _id: '3', title: 'Website Localization EN â†’ Swahili', assignedTo: 'Chidi Eze', status: 'completed', budget: { min: 600, max: 1000, currency: 'USD' }, applicationsCount: 12, deadline: null },
  { _id: '4', title: 'Chinese Business Docs â†’ Swahili', assignedTo: null, status: 'open', budget: { min: 300, max: 600, currency: 'USD' }, applicationsCount: 5, deadline: '2024-01-18' },
];
const MOCK_APPLICATIONS = [
  { _id: 'a1', jobTitle: 'French â†’ English Annual Report', proposedRate: 650, status: 'shortlisted', appliedAt: '2024-01-09' },
  { _id: 'a2', jobTitle: 'Amharic Audio Transcription', proposedRate: 280, status: 'pending', appliedAt: '2024-01-10' },
  { _id: 'a3', jobTitle: 'Hausa Website Localization', proposedRate: 450, status: 'accepted', appliedAt: '2024-01-05' },
];
const MOCK_PAYMENTS = [
  { _id: 'py1', jobTitle: 'Legal Contract Translation', amount: 400, currency: 'USD', status: 'in_escrow', reference: 'PAY-1704892800-A8XK', createdAt: '2024-01-10' },
  { _id: 'py2', jobTitle: 'Website Localization â€” M1', amount: 300, currency: 'USD', status: 'released', reference: 'PAY-1704806400-Z3MN', createdAt: '2024-01-08' },
  { _id: 'py3', jobTitle: 'Medical Reports â€” Full', amount: 1800, currency: 'USD', status: 'released', reference: 'PAY-1704720000-Q9PL', createdAt: '2024-01-06' },
];

type Tab = 'overview' | 'jobs' | 'applications' | 'payments' | 'profile';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'jobs', label: 'My Jobs', icon: BriefcaseBusiness },
  { id: 'applications', label: 'Applications', icon: ClipboardList },
  { id: 'payments', label: 'Payments', icon: WalletCards },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

function DashboardContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const handleSignOut = async () => { await signOut(); router.replace('/login'); router.refresh(); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: 68, display: 'flex', flexDirection: 'column' }}>
      {/* Dashboard topbar */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
        <div className="container-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Dashboard</h1>
            <p style={{ fontSize: '.76rem', color: 'var(--text-secondary)' }}>Welcome back, {user?.name || 'Linker'} — here's your overview</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/post-job" className="btn-primary" style={{ padding: '8px 16px', fontSize: '.82rem' }}><Plus size={13} /> Post Job</Link>
            <button style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={15} /></button>
          </div>
        </div>
      </div>

      <div className="dash-layout container-brand" style={{ flex: 1, display: 'grid', gap: 0, paddingTop: 24, paddingBottom: 60 }}>
        {/* Sidebar */}
        <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 12px', height: 'fit-content' }} className="dash-aside">
          {NAV.map(n => {
            const Icon = n.icon;
            return (
              <button key={n.id} onClick={() => setTab(n.id as Tab)} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
                borderRadius: 9, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                background: tab === n.id ? 'rgba(45,125,210,.12)' : 'transparent',
                color: tab === n.id ? 'var(--accent-bright)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)', fontWeight: tab === n.id ? 600 : 400, fontSize: '.86rem',
                marginBottom: 4,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                  <Icon size={15} />
                </span>
                {n.label}
              </button>
            );
          })}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent-dark),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>A</div>
              <div><div style={{ fontSize: '.84rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Aisha O.</div><div style={{ fontSize: '.72rem', color: 'var(--text-secondary)' }}>Client</div></div>
            </div>
            <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '.82rem' }}>
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ minWidth: 0 }}>
          {tab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 24 }}>
                {[
                  { icon: Briefcase, label: 'Active Jobs', value: MOCK_STATS.postedJobs.active, color: 'var(--accent)' },
                  { icon: Users, label: 'Applications', value: MOCK_STATS.workHistory.applied, color: '#F59E0B' },
                  { icon: CheckCircle, label: 'Completed', value: MOCK_STATS.postedJobs.completed, color: '#4CAF50' },
                  { icon: DollarSign, label: 'Total Paid', value: '$4.2K', color: 'var(--sand)' },
                ].map(({ icon: Icon, label, value, color }, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 16px', transition: 'border-color .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 10 }}><Icon size={16} /></div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>{value}</div>
                    <div style={{ fontSize: '.76rem', color: 'var(--text-secondary)' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.95rem', color: 'var(--text-primary)' }}>Recent Jobs</span>
                <button onClick={() => setTab('jobs')} style={{ fontSize: '.8rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={12} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MOCK_JOBS.slice(0, 3).map(j => {
                  const st = JOB_STATUS_CONFIG[j.status];
                  return (
                    <div key={j._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.9rem', color: 'var(--text-primary)', marginBottom: 3 }}>{j.title}</div>
                        <div style={{ fontSize: '.76rem', color: 'var(--text-secondary)' }}>
                          {j.assignedTo ? <span>Assigned to <span style={{ color: 'var(--sand)' }}>{j.assignedTo}</span></span> : <span>{j.applicationsCount} applicants</span>}
                          {j.deadline && <span style={{ marginLeft: 10 }}><Clock size={10} style={{ display: 'inline', marginRight: 2 }} />Due {j.deadline}</span>}
                        </div>
                      </div>
                      <span style={{ fontSize: '.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: st?.bg, color: st?.color }}>{st?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'jobs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>My Posted Jobs</h2>
                <Link href="/post-job" className="btn-primary" style={{ padding: '7px 14px', fontSize: '.8rem' }}><Plus size={12} /> Post New</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_JOBS.map(j => {
                  const st = JOB_STATUS_CONFIG[j.status];
                  return (
                    <div key={j._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.95rem', color: 'var(--text-primary)' }}>{j.title}</h3>
                        <span style={{ fontSize: '.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: st?.bg, color: st?.color, flexShrink: 0 }}>{st?.label}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--sand)', fontSize: '.95rem' }}>${j.budget.min}â€“{j.budget.max}</span>
                        <span><Users size={11} style={{ display: 'inline', marginRight: 3 }} />{j.applicationsCount} applicants</span>
                        {j.deadline && <span><Clock size={11} style={{ display: 'inline', marginRight: 3 }} />Due {j.deadline}</span>}
                        {j.assignedTo && <span>â†’ <span style={{ color: 'var(--sand)' }}>{j.assignedTo}</span></span>}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '.78rem' }}>View Applicants</button>
                        {j.status === 'in_progress' && <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '.78rem' }}>Release Payment</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'applications' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 16 }}>My Applications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_APPLICATIONS.map(a => {
                  const st = APP_STATUS_CONFIG[a.status];
                  return (
                    <div key={a._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.92rem', color: 'var(--text-primary)', marginBottom: 4 }}>{a.jobTitle}</div>
                        <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)' }}>Proposed: <span style={{ color: 'var(--sand)', fontWeight: 600 }}>${a.proposedRate}</span> Â· Applied {a.appliedAt}</div>
                      </div>
                      <span style={{ fontSize: '.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: st?.bg, color: st?.color }}>{st?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 8 }}>Payments</h2>
              <p style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: 18 }}>Powered by <code style={{ color: 'var(--accent-bright)', fontSize: '.78rem' }}>GET /api/payments/mine</code></p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 20 }}>
                {[{ label: 'Total Paid', val: '$2,500', color: 'var(--sand)' }, { label: 'In Escrow', val: '$400', color: '#F59E0B' }, { label: 'Released', val: '$2,100', color: '#4CAF50' }].map((s, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: '.76rem', color: 'var(--text-secondary)', marginBottom: 5 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MOCK_PAYMENTS.map(p => {
                  const st = PAYMENT_STATUS_CONFIG[p.status];
                  return (
                    <div key={p._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.9rem', color: 'var(--text-primary)', marginBottom: 3 }}>{p.jobTitle}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '.72rem', color: 'var(--text-muted)' }}>{p.reference}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--sand)' }}>${p.amount}</span>
                        <span style={{ fontSize: '.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: st?.bg, color: st?.color }}>{st?.label}</span>
                        {p.status === 'in_escrow' && <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '.76rem' }}>Release</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 18, padding: 14, background: 'rgba(45,125,210,.06)', border: '1px solid rgba(45,125,210,.15)', borderRadius: 12, fontSize: '.8rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-bright)', fontWeight: 600 }}>Escrow flow: </span>
                Initiate â†’ <span style={{ color: '#F59E0B' }}>In Escrow</span> â†’ Client approves â†’ <span style={{ color: '#4CAF50' }}>Released to Linker</span>
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div style={{ maxWidth: 520 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 28, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent-dark),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>A</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 4 }}>Aisha Okonkwo</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>aisha@example.com</div>
                    <span style={{ fontSize: '.72rem', color: 'var(--accent)', background: 'rgba(45,125,210,.1)', border: '1px solid rgba(45,125,210,.2)', padding: '2px 10px', borderRadius: 99 }}>Client Account</span>
                  </div>
                </div>
                {[['Full Name', 'Aisha Okonkwo'], ['Email', 'aisha@example.com'], ['Location', 'Lagos, Nigeria'], ['Member Since', 'January 2024']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontSize: '.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '.84rem' }}>Edit Profile</button>
                  <button onClick={handleSignOut} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(232,76,76,.1)', border: '1px solid rgba(232,76,76,.2)', color: 'var(--red)', cursor: 'pointer', fontSize: '.84rem', fontFamily: 'var(--font-display)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .dash-layout{display:grid;gap:20px}
        @media(min-width:900px){.dash-layout{grid-template-columns:200px 1fr!important}}
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return <RequireAuth><DashboardContent /></RequireAuth>;
}
