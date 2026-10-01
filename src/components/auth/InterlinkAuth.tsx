'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mdk2 } from '@interlinklabs/mdk';
import { ArrowRight, BriefcaseBusiness, ShieldCheck, UserRound } from 'lucide-react';
import { env } from '@/lib/env';

type Mode = 'login' | 'register';
type Props = { mode: Mode };
type InterlinkSuccess = { webToken: string; appToken?: string; payload?: { appId: string; loginId: string } };

const APP_ID = env.NEXT_PUBLIC_INTERLINK_APP_ID;

export default function InterlinkAuth({ mode }: Props) {
  const router = useRouter();
  const started = useRef(false);
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [pendingWebToken, setPendingWebToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'waiting' | 'working' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function completeSignIn(data?: InterlinkSuccess) {
    if (!data?.webToken) {
      started.current = false;
      setStatus('error');
      setMessage('InterLink did not return a valid login token. Please try again inside the InterLink app.');
      return;
    }
    if (mode === 'register' && !started.current) {
      setPendingWebToken(data.webToken);
      setMessage('InterLink ID is ready. Confirm your account type and profile, then continue.');
      return;
    }
    setStatus('working');
    setMessage('Verifying your InterLink ID…');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          action: 'interlink', flow: mode, webToken: data.webToken,
          role: role === 'freelancer' ? 'freelancer' : 'client',
          profile: { name, location, bio, skills: skills.split(',').map(value => value.trim()).filter(Boolean) },
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'InterLink sign-in could not be completed.');
      const accountRole = result.data.user.role;
      router.replace(mode === 'register' ? (accountRole === 'freelancer' ? '/jobs' : '/post-job') : '/dashboard');
      router.refresh();
    } catch (error) {
      started.current = false;
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Sign-in failed. Please try again.');
    }
  }

  function handleFailure() {
    if (!started.current) return; // The SDK also calls failure while checking an empty cookie on first render.
    started.current = false;
    setStatus('error');
    setMessage('InterLink could not verify this sign-in. Open the mini-app in InterLink and try again.');
  }

  const isRegister = mode === 'register';
  return (
    <main className="auth-shell">
      <div className="grid-bg auth-grid" />
      <section className="auth-content">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark"><Image src="/logo.png" alt="BF Blessy" width={42} height={42} /></span>
          <span><strong><i>BF</i> Blessy </strong><small>interlink marketplace</small></span>
        </Link>

        <div className="auth-card">
          <div className="eyebrow"><ShieldCheck size={15} /> InterLink ID</div>
          <h1>{isRegister ? 'Join the Linker network' : 'Welcome back'}</h1>
          <p className="intro">{isRegister ? 'Use your verified InterLink ID to set up your marketplace profile.' : 'Sign in securely with the InterLink app. No marketplace password needed.'}</p>

          {isRegister && <div className="role-picker" aria-label="Choose account type">
            <button type="button" aria-pressed={role === 'client'} className={role === 'client' ? 'selected' : ''} onClick={() => setRole('client')}>
              <BriefcaseBusiness size={18} /><span><b>Job poster</b><small>Hire Linkers</small></span>
            </button>
            <button type="button" aria-pressed={role === 'freelancer'} className={role === 'freelancer' ? 'selected' : ''} onClick={() => setRole('freelancer')}>
              <UserRound size={18} /><span><b>Linker</b><small>Find projects</small></span>
            </button>
          </div>}

          {isRegister && <div className="profile-fields">
            <label>Display name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="How clients will see you" maxLength={100} /></label>
            {role === 'freelancer' && <>
              <label>Location <span>Optional</span><input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, country" maxLength={120} /></label>
              <label>Skills <span>Separate with commas</span><input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Design, writing, development" /></label>
              <label>About you <span>Optional</span><textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell clients what you do best" rows={3} maxLength={2000} /></label>
            </>}
          </div>}

          {!APP_ID ? 
            <div className="config-message" role="status">InterLink sign-in is not configured yet. Set <code>NEXT_PUBLIC_INTERLINK_APP_ID</code> to the App ID registered for this mini-app.</div> : pendingWebToken ? <button type="button" className="interlink-button" disabled={status === 'working'} onClick={() => { started.current = true; void completeSignIn({ webToken: pendingWebToken }); }}>
              <span className="interlink-symbol">i</span>{status === 'working' ? 'Verifying…' : 'Continue with this InterLink ID'}<ArrowRight size={17} />
            </button> :             
            <Mdk2 appid={APP_ID} onSuccess={completeSignIn} onFailure={handleFailure}>
              {({ open }) => <button type="button" className="interlink-button" disabled={status === 'working'} onClick={() => { started.current = true; setStatus('waiting'); setMessage('Waiting for InterLink…'); open(); }}>
                <span className="interlink-symbol">i</span>{status === 'working' ? 'Verifying…' : status === 'waiting' ? 'Waiting for InterLink…' : 'Continue with InterLink'}<ArrowRight size={17} />
              </button>}
            </Mdk2>
          }

          {message && <p className={`feedback ${status === 'error' ? 'error' : ''}`} role={status === 'error' ? 'alert' : 'status'}>{message}</p>}
          <p className="trust-note"><ShieldCheck size={14} /> Your InterLink token is verified on the server. Your marketplace session uses a secure HttpOnly cookie.</p>
          <div className="auth-switch">{isRegister ? <>Already registered? <Link href="/login">Sign in</Link></> : <>New to the marketplace? <Link href="/register">Create a Linker account</Link></>}</div>
        </div>
        <p className="auth-foot">Your InterLink ID is your sign-in. Your marketplace profile controls whether you post jobs or work as a Linker.</p>
      </section>
      <style jsx>{`
        .auth-shell{min-height:100vh;display:grid;place-items:center;padding:100px 18px 42px;background:var(--bg-base);position:relative;overflow:hidden}
        .auth-grid{position:fixed;inset:0;opacity:.5;pointer-events:none}
        .auth-content{z-index:1;width:100%;max-width:480px}
        .brand-lockup{display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;margin-bottom:24px}
        .brand-mark{width:42px;height:42px;border-radius:11px;overflow:hidden;border:1px solid var(--border);display:grid;place-items:center}.brand-mark :global(img){width:100%;height:100%;object-fit:cover}
        .brand-lockup strong{display:block;color:var(--text-primary);font:800 1.08rem var(--font-display)}.brand-lockup i{color:var(--sand);font-style:normal}.brand-lockup small{display:block;margin-top:2px;text-transform:uppercase;letter-spacing:.1em;font-size:.58rem;color:var(--text-muted)}
        .auth-card{padding:clamp(22px,6vw,38px);background:var(--bg-card);border:1px solid var(--border);border-radius:22px;box-shadow:var(--shadow-lg)}
        .eyebrow{display:flex;justify-content:center;align-items:center;gap:6px;color:var(--accent-bright);font-size:.76rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
        h1{text-align:center;color:var(--text-primary);font:800 clamp(1.45rem,5vw,1.85rem) var(--font-display);margin:11px 0 7px}.intro{text-align:center;color:var(--text-secondary);font-size:.88rem;line-height:1.55;margin:0 auto 21px;max-width:360px}
        .role-picker{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:18px}.role-picker button{min-width:0;display:flex;align-items:center;gap:10px;text-align:left;padding:12px;border-radius:11px;border:1px solid var(--border);background:var(--bg-base);color:var(--text-secondary);cursor:pointer}.role-picker button.selected{border-color:var(--accent);background:rgba(45,125,210,.1);color:var(--accent-bright)}.role-picker b,.role-picker small{display:block}.role-picker b{color:var(--text-primary);font-size:.82rem}.role-picker small{margin-top:3px;color:var(--text-muted);font-size:.7rem}
        .profile-fields{display:grid;gap:12px;margin:0 0 17px}.profile-fields label{display:grid;gap:6px;color:var(--text-secondary);font-size:.76rem;font-weight:600}.profile-fields label span{font-size:.68rem;color:var(--text-muted);font-weight:400}.profile-fields input,.profile-fields textarea{width:100%;box-sizing:border-box;padding:11px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:9px;color:var(--text-primary);font:400 .88rem var(--font-body);outline:none}.profile-fields input:focus,.profile-fields textarea:focus{border-color:var(--accent)}.profile-fields textarea{resize:vertical}
        .interlink-button{width:100%;min-height:50px;display:flex;justify-content:center;align-items:center;gap:10px;border:0;border-radius:10px;background:linear-gradient(120deg,var(--accent-dark),var(--accent));color:#fff;font:700 .9rem var(--font-display);cursor:pointer}.interlink-button:disabled{opacity:.65;cursor:wait}.interlink-symbol{width:22px;height:22px;border:1.5px solid currentColor;border-radius:50%;display:grid;place-items:center;font:700 .9rem var(--font-display)}
        .config-message{padding:12px 13px;border:1px solid rgba(245,158,11,.3);border-radius:10px;background:rgba(245,158,11,.08);color:var(--text-secondary);font-size:.82rem;line-height:1.6}.config-message code{color:var(--sand);font-size:.78rem}
        .feedback{margin:12px 0 0;color:var(--text-secondary);font-size:.82rem;line-height:1.5}.feedback.error{color:var(--red)}.trust-note{display:flex;gap:7px;align-items:flex-start;margin:18px 0 0;padding:12px;border-radius:9px;background:var(--bg-base);color:var(--text-muted);font-size:.72rem;line-height:1.5}.trust-note :global(svg){flex-shrink:0;color:var(--green);margin-top:1px}
        .auth-switch{text-align:center;margin-top:19px;padding-top:17px;border-top:1px solid var(--border);font-size:.82rem;color:var(--text-secondary)}.auth-switch a{color:var(--accent-bright);font-weight:650;text-decoration:none;margin-left:3px}.auth-foot{text-align:center;color:var(--text-muted);font-size:.72rem;line-height:1.6;margin:13px 8px 0}
      `}</style>
    </main>
  );
}
