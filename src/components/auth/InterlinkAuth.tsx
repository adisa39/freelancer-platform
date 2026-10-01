'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, ShieldCheck, UserRound } from 'lucide-react';
import { UserRole } from '@/types/enum';
import { ethers } from 'ethers';

import { env } from '@/lib/env';
import { asObject, getErrorMessage } from '@/lib/utils';

declare global {
  interface Window {
    ethereum?: {
      request(args: { method: string; params?: unknown[] }): Promise<unknown>;
    };
  }
}

type Mode = 'login' | 'register';
type Props = { mode: Mode };

export default function InterlinkAuth({ mode }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState<'idle' | 'waiting' | 'working' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function completeSignIn(walletAddress: string) {
    setStatus('working');
    setMessage('Requesting a secure sign-in challenge…');

    try {
      const challengeResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action: 'challenge', walletAddress }),
      });
      const challengePayload: unknown = await challengeResponse.json().catch(() => null);
      const challengeData = asObject(asObject(challengePayload)?.data);
      if (!challengeResponse.ok || typeof challengeData?.challengeId !== 'string' || typeof challengeData.messageToSign !== 'string') {
        const errorPayload = asObject(challengePayload);
        throw new Error(typeof errorPayload?.message === 'string' ? errorPayload.message : 'Could not start wallet verification.');
      }

      const ethereum = window.ethereum;
      if (!ethereum) throw new Error('Wallet is no longer available. Reconnect and try again.');
      setMessage('Approve the sign-in message in your wallet.');
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [ethers.hexlify(ethers.toUtf8Bytes(challengeData.messageToSign)), walletAddress],
      });
      if (typeof signature !== 'string') throw new Error('Wallet returned an invalid signature.');

      setMessage('Verifying your wallet and marketplace profile…');
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          action: 'interlink',
          flow: mode,
          walletAddress,
          challengeId: challengeData.challengeId,
          message: challengeData.messageToSign,
          signature,
          role,
          profile: {
            name,
            location,
            bio,
            skills: skills.split(',').map(value => value.trim()).filter(Boolean),
          },
        }),
      });

      const result: unknown = await response.json().catch(() => null);
      const resultData = asObject(asObject(result)?.data);
      const user = asObject(resultData?.user);
      if (!response.ok || typeof user?.role !== 'string') {
        const errorPayload = asObject(result);
        throw new Error(typeof errorPayload?.message === 'string' ? errorPayload.message : 'Wallet sign-in could not be completed.');
      }

      router.replace(mode === 'register' ? (user.role === UserRole.FREELANCER ? '/jobs' : '/post-job') : '/dashboard');
      router.refresh();
    } catch (error) {
      setStatus('error');
      setMessage(getErrorMessage(error, 'Sign-in failed. Please try again.'));
    }
  }

  async function connectWallet() {
    try {
      setStatus('waiting');
      setMessage('Waiting for wallet approval…');
      const ethereum = window.ethereum;
      if (!ethereum) throw new Error('No compatible wallet was found. Open this page in InterLink or connect an EVM wallet.');

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (!Array.isArray(accounts) || typeof accounts[0] !== 'string') throw new Error('No wallet account was returned.');
      const walletAddress = accounts[0];
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      if (typeof currentChainId !== 'string' || Number.parseInt(currentChainId, 16) !== env.CHAIN_ID) {
        throw new Error(`Switch your wallet to ITL Testnet (Chain ID ${env.CHAIN_ID}) and try again.`);
      }

      await completeSignIn(walletAddress);
    } catch (error) {
      setStatus('error');
      setMessage(getErrorMessage(error, 'Wallet connection failed.'));
    }
  }
  const isRegister = mode === 'register';
  return (
    <main className="auth-shell">
      <div className="grid-bg auth-grid" />
      <section className="auth-content">
        <Link href="/" className="brand-lockup">
          <span>
            <strong>
              <i>BF</i> Blessy
            </strong>
            <small> interlink job platform</small>
          </span>
        </Link>

        <div className="auth-card">
          <div className="eyebrow"><ShieldCheck size={15} /> InterLink Login</div>
          <h1>{isRegister ? 'Join the BF Blessy jobs' : 'Welcome back'}</h1>
          <p className="intro">Connect using Interlink App</p>

          {isRegister && <div className="role-picker" aria-label="Choose account type">
            <button type="button" aria-pressed={role === UserRole.CLIENT} className={role === UserRole.CLIENT ? 'selected' : ''} onClick={() => setRole(UserRole.CLIENT)}>
              <BriefcaseBusiness size={18} />
              <span><b>Job poster</b><small>Hire Linkers</small></span>
            </button>

            <button
              type="button"
              aria-pressed={role === UserRole.FREELANCER}
              className={role === UserRole.FREELANCER ? 'selected' : ''}
              onClick={() => setRole(UserRole.FREELANCER)}
            >
              <UserRound size={18} />
              <span><b>Linker</b><small>Find projects</small></span>
            </button>
          </div>}

          {isRegister && <div className="profile-fields">
            <label>
              Display name
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                placeholder="How clients will see you"
                maxLength={100}
              />
            </label>

            {role === UserRole.FREELANCER && <>
              <label>
                Location
                <span>Optional</span>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="City, country" maxLength={120}
                />
              </label>

              <label>
                Skills
                <span>Separate with commas</span>
                <input
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="Design, writing, development"
                />
              </label>

              <label>
                About you
                <span>Optional</span>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell clients what you do best"
                  rows={3}
                  maxLength={2000}
                />
              </label>
            </>}
          </div>}

          <button
            type="button"
            className="interlink-button"
            disabled={status === 'waiting' || status === 'working'}
            onClick={() => {
              setStatus('waiting');
              setMessage('Waiting for InterLink…');
              void connectWallet();
            }}
          >
            <span className="interlink-symbol">i</span>
            {status === 'working' ? 'Verifying…' : status === 'waiting' ? 'Waiting for InterLink…' : 'Continue with InterLink'}
            <ArrowRight size={17} />
          </button>

          {message && <p
            className={`feedback ${status === 'error' ? 'error' : ''}`}
            role={status === 'error' ? 'alert' : 'status'}
          >
            {message}
          </p>}

          <p className="trust-note">
            <ShieldCheck size={14} />
            Your InterLink wallet is verified on the server. Your platform session uses a secure HttpOnly cookie.
          </p>

          <div className="auth-switch">
            {isRegister ?
            <>
              Already registered?
              <Link href="/login">Sign in</Link>
            </> :
            <>
              New to the marketplace?
              <Link href="/register">
                Create a Linker account
              </Link>
            </>}
          </div>
        </div>

        <p className="auth-foot">
          Your wallet signature verifies ownership. Your marketplace profile controls whether you post jobs or work as a Linker.
        </p>
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