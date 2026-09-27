'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle');
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading'); setErr('');
    try {
      const res = await authApi.login(form);
      window.location.href = '/dashboard';
    } catch (ex: any) { setErr(ex.message || 'Invalid credentials'); setStatus('error'); }
  };

  const inp: React.CSSProperties = { width:'100%', padding:'12px 44px', background:'var(--bg-input)', border:'1.5px solid var(--border)', borderRadius:10, color:'var(--text-primary)', fontSize:'.9rem', fontFamily:'var(--font-body)', outline:'none', transition:'border-color .18s,box-shadow .18s' };
  const fo = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(45,125,210,.12)'; };
  const bl = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'100px 20px 60px',position:'relative',background:'var(--bg-base)'}}>
      <div className="grid-bg" style={{position:'fixed',inset:0,opacity:.6}}/>
      <div style={{position:'fixed',top:'20%',right:'10%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(45,125,210,.07) 0%,transparent 70%)',filter:'blur(40px)',pointerEvents:'none'}}/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:440}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:10,textDecoration:'none'}}>
            <div style={{width:42,height:42,borderRadius:11,overflow:'hidden',border:'1.5px solid var(--border)'}}>
              <Image src="/logo.png" alt="BF Blessy" width={42} height={42} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
            <div style={{textAlign:'left'}}>
              <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.1rem',color:'var(--text-primary)'}}><span style={{color:'var(--sand)'}}>BF</span>{' '}<span style={{color:'var(--accent-bright)'}}>Blessy</span></div>
              <div style={{fontSize:'.58rem',color:'var(--text-muted)',letterSpacing:'.08em',textTransform:'uppercase'}}>Pioneer Platform</div>
            </div>
          </Link>
        </div>
        <div style={{background:'var(--bg-card)',border:'1.5px solid var(--border)',borderRadius:22,padding:'clamp(26px,6vw,42px)',boxShadow:'var(--shadow-lg)'}}>
          <h1 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.4rem',color:'var(--text-primary)',textAlign:'center',marginBottom:5}}>Welcome Back</h1>
          <p style={{color:'var(--text-secondary)',fontSize:'.86rem',textAlign:'center',marginBottom:26}}>Sign in to your Pioneer Platform account</p>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:15}}>
            <div>
              <label style={{display:'block',fontSize:'.75rem',color:'var(--text-muted)',marginBottom:6,fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail size={15} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}}/>
                <input style={inp} type="email" required placeholder="you@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} onFocus={fo} onBlur={bl}/>
              </div>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <label style={{fontSize:'.75rem',color:'var(--text-muted)',fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Password</label>
                <span style={{fontSize:'.76rem',color:'var(--accent)',cursor:'pointer'}}>Forgot?</span>
              </div>
              <div style={{position:'relative'}}>
                <Lock size={15} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}}/>
                <input style={{...inp,paddingRight:44}} type={showPw?'text':'password'} required placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} onFocus={fo} onBlur={bl}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:0}}>
                  {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>
            {status==='error'&&<div style={{background:'rgba(232,76,76,.08)',border:'1px solid rgba(232,76,76,.25)',borderRadius:9,padding:'10px 14px',fontSize:'.82rem',color:'var(--red)'}}>{err}</div>}
            <button type="submit" className="btn-primary" disabled={status==='loading'} style={{padding:'13px',fontSize:'.95rem',marginTop:4}}>
              {status==='loading'?'Signing in…':<><LogIn size={15}/>Sign In</>}
            </button>
          </form>
          <div style={{textAlign:'center',marginTop:20,paddingTop:20,borderTop:'1.5px solid var(--border)'}}>
            <p style={{fontSize:'.84rem',color:'var(--text-secondary)'}}>No account?{' '}<Link href="/register" style={{color:'var(--accent-bright)',textDecoration:'none',fontWeight:600}}>Join as Pioneer or Client</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
