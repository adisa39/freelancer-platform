'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { BriefcaseBusiness, LayoutGrid, LogOut, Menu, Plus, UserRound, Users, X } from 'lucide-react';
import type { AuthUser } from '@/context/AuthContext';

export type DashTab = 'overview' | 'jobs' | 'profile';

type Props = {
  title: string;
  tab: DashTab;
  onTab: (tab: DashTab) => void;
  user: AuthUser;
  onSignOut: () => void;
  children: ReactNode;
};

export default function DashboardShell({ title, tab, onTab, user, onSignOut, children }: Props) {
  const [open, setOpen] = useState(false);
  const isFreelancer = user.role === 'freelancer';
  const initials = (user.name || 'U').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const roleLabel = isFreelancer ? 'Freelancer' : user.role === 'admin' ? 'Admin' : 'Client';
  const go = (next: DashTab) => { onTab(next); setOpen(false); };

  return (
    <div className="bf-dash">
      <button type="button" className={`bf-dash-overlay${open ? ' open' : ''}`} aria-label="Close menu" onClick={() => setOpen(false)} />
      <aside className={`bf-dash-sidebar${open ? ' open' : ''}`}>
        <div className="bf-dash-sidebar__inner">
          <Link href="/" className="bf-dash-logo">
            <span className="mark">BF</span>
            <span><strong>BF <span>Blessy</span></strong><small>{isFreelancer ? 'Freelancer workspace' : 'Client workspace'}</small></span>
          </Link>
          <div className="bf-dash-account-card">
            <span className="bf-dash-account-avatar">{initials}</span>
            <span><strong>{user.name || 'Your account'}</strong><small>{roleLabel} account{user.isDevelopmentMock === true ? ' · development mock' : ''}</small></span>
          </div>
          <nav className="bf-dash-nav" aria-label="Dashboard">
            <button type="button" className={tab === 'overview' ? 'active' : ''} onClick={() => go('overview')}><LayoutGrid size={18} />Overview</button>
            <button type="button" className={tab === 'jobs' ? 'active' : ''} onClick={() => go('jobs')}><BriefcaseBusiness size={18} />Posted jobs</button>
            <Link href={isFreelancer ? '/jobs' : '/linkers'} onClick={() => setOpen(false)}><Users size={18} />{isFreelancer ? 'Find work' : 'Find talent'}</Link>
            <button type="button" className={tab === 'profile' ? 'active' : ''} onClick={() => go('profile')}><UserRound size={18} />Profile settings</button>
          </nav>
          <Link href="/post-job" className="bf-dash-btn bf-dash-post-link"><Plus size={16} />Post a job</Link>
          <button type="button" className="bf-dash-signout" onClick={onSignOut}><LogOut size={17} />Sign out</button>
        </div>
      </aside>

      <div className="bf-dash-right">
        <header className="bf-dash-header">
          <div className="bf-dash-header__inner">
            <div className="bf-dash-header__left">
              <button type="button" className="bf-dash-menu" aria-label="Open menu" onClick={() => setOpen(true)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
              <div><span className="bf-dash-eyebrow">{roleLabel} workspace</span><h1>{title}</h1></div>
            </div>
            <div className="bf-dash-header__tools">
              <Link href="/post-job" className="bf-dash-btn"><Plus size={16} />Post a job</Link>
              <button type="button" className="bf-dash-user" onClick={() => go('profile')} aria-label="Open profile settings">
                <span className="avatar">{initials}</span><span className="meta"><span className="name">{user.name || 'Account'}</span><span className="role">{roleLabel}</span></span>
              </button>
            </div>
          </div>
        </header>
        <main className="bf-dash-body">{children}</main>
      </div>
    </div>
  );
}