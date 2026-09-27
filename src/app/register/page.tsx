'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', role:'client', location:'', bio:'', skills:'' });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [err, setErr] = useState('');

  const inp: React.CSSProperties = { width:'100%', padding:'11px 16px 11px 40px', background:'var(--bg-input)', border:'1.5px solid var(--border)', borderRadius:9, color:'var(--text-primary)', fontSize:'.89rem', fontFamily:'var(--font-body)', outline:'none', transition:'border-color .18s,box-shadow .18s' };
  const fo = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(45,125,210,.12)'; };
  const bl = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setErr('Passwords do not match'); setStatus('error'); return; }
    setStatus('loading'); setErr('');
    try {
      await authApi.register({ name:form.name, email:form.email, password:form.password, role:form.role === 'pioneer' ? 'translator' : 'client', location: form.location, bio: form.bio, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      setStatus('success');
    } catch (ex:any) { setErr(ex.message||'Registration failed'); setStatus('error'); }
  };

  if (status==='success') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-base)',padding:'100px 20px',textAlign:'center'}}>
      <div>
        <div style={{fontSize:'3.5rem',marginBottom:18}}>🎉</div>
        <h1 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.7rem',color:'var(--text-primary)',marginBottom:12}}>You're in!</h1>
        <p style={{color:'var(--text-secondary)',marginBottom:26,maxWidth:380,margin:'0 auto 26px'}}>{form.role==='pioneer'?'Start browsing jobs and get hired for work you love.':'Post your first job and hire top Pioneers today.'}</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
          <Link href={form.role==='pioneer'?'/jobs':'/post-job'} className="btn-secondary">{form.role==='pioneer'?'Browse Jobs':'Post a Job'}</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'100px 20px 60px',position:'relative',background:'var(--bg-base)',overflow:'hidden'}}>
      <div className="grid-bg" style={{position:'fixed',inset:0,opacity:.6}}/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:480}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:10,textDecoration:'none'}}>
            <div style={{width:38,height:38,borderRadius:9,overflow:'hidden',border:'1.5px solid var(--border)'}}><Image src="/logo.png" alt="BF Blessy" width={38} height={38} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
            <div style={{textAlign:'left'}}>
              <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1rem',color:'var(--text-primary)'}}><span style={{color:'var(--sand)'}}>BF</span>{' '}<span style={{color:'var(--accent-bright)'}}>Blessy</span></div>
              <div style={{fontSize:'.58rem',color:'var(--text-muted)',letterSpacing:'.08em',textTransform:'uppercase'}}>Pioneer Platform</div>
            </div>
          </Link>
        </div>
        <div style={{background:'var(--bg-card)',border:'1.5px solid var(--border)',borderRadius:22,padding:'clamp(24px,5vw,38px)',boxShadow:'var(--shadow-lg)'}}>
          <h1 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.35rem',color:'var(--text-primary)',textAlign:'center',marginBottom:5}}>Create Your Account</h1>
          <p style={{color:'var(--text-secondary)',fontSize:'.84rem',textAlign:'center',marginBottom:22}}>Join Africa's top freelance marketplace</p>
          {/* Role toggle */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
            {[{val:'client',icon:'💼',label:'I\'m Hiring',desc:'Post jobs'},{val:'pioneer',icon:'⚡',label:'I\'m a Pioneer',desc:'Find work'}].map(opt=>(
              <button key={opt.val} type="button" onClick={()=>setForm(f=>({...f,role:opt.val}))} style={{padding:'12px 10px',borderRadius:11,border:'1.5px solid',cursor:'pointer',transition:'all .18s',textAlign:'center',borderColor:form.role===opt.val?'var(--accent)':'var(--border)',background:form.role===opt.val?'rgba(45,125,210,.1)':'transparent',color:form.role===opt.val?'var(--accent)':'var(--text-secondary)'}}>
                <div style={{fontSize:'1.3rem',marginBottom:4}}>{opt.icon}</div>
                <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'.84rem',color:form.role===opt.val?'var(--accent)':'var(--text-primary)',marginBottom:2}}>{opt.label}</div>
                <div style={{fontSize:'.7rem',color:'var(--text-muted)'}}>{opt.desc}</div>
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <label style={{display:'block',fontSize:'.72rem',color:'var(--text-muted)',marginBottom:5,fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Full Name *</label>
              <div style={{position:'relative'}}><User size={14} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}}/><input style={inp} required placeholder="Your full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onFocus={fo} onBlur={bl}/></div>
            </div>
            <div>
              <label style={{display:'block',fontSize:'.72rem',color:'var(--text-muted)',marginBottom:5,fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Email Address *</label>
              <div style={{position:'relative'}}><Mail size={14} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}}/><input style={inp} type="email" required placeholder="you@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} onFocus={fo} onBlur={bl}/></div>
            </div>
            {form.role === 'pioneer' && <>
              <div>
                <label style={{display:'block',fontSize:'.72rem',color:'var(--text-muted)',marginBottom:5,fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Location</label>
                <input className="input-brand" placeholder="City, Country" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'.72rem',color:'var(--text-muted)',marginBottom:5,fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Skills</label>
                <input className="input-brand" placeholder="React, UI design, writing…" value={form.skills} onChange={e=>setForm(f=>({...f,skills:e.target.value}))}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'.72rem',color:'var(--text-muted)',marginBottom:5,fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Profile introduction</label>
                <textarea className="input-brand" rows={3} maxLength={2000} placeholder="What do you specialize in?" value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))}/>
              </div>
            </>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div>
                <label style={{display:'block',fontSize:'.72rem',color:'var(--text-muted)',marginBottom:5,fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Password *</label>
                <div style={{position:'relative'}}><Lock size={14} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}}/><input style={inp} type={showPw?'text':'password'} required minLength={8} placeholder="Min 8 chars" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} onFocus={fo} onBlur={bl}/></div>
              </div>
              <div>
                <label style={{display:'block',fontSize:'.72rem',color:'var(--text-muted)',marginBottom:5,fontFamily:'var(--font-display)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>Confirm *</label>
                <div style={{position:'relative'}}><Lock size={14} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}}/><input style={{...inp,paddingRight:38}} type={showPw?'text':'password'} required placeholder="Repeat" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} onFocus={fo} onBlur={bl}/><button type="button" onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:0}}>{showPw?<EyeOff size={14}/>:<Eye size={14}/>}</button></div>
              </div>
            </div>
            {status==='error'&&<div style={{background:'rgba(232,76,76,.08)',border:'1px solid rgba(232,76,76,.25)',borderRadius:8,padding:'10px 13px',fontSize:'.8rem',color:'var(--red)'}}>{err}</div>}
            <button type="submit" className="btn-primary" disabled={status==='loading'} style={{padding:'12px',fontSize:'.93rem',marginTop:4}}>
              {status==='loading'?'Creating account…':<><UserPlus size={15}/> Create Account</>}
            </button>
          </form>
          <div style={{textAlign:'center',marginTop:18,paddingTop:18,borderTop:'1.5px solid var(--border)'}}>
            <p style={{fontSize:'.82rem',color:'var(--text-secondary)'}}>Already have an account?{' '}<Link href="/login" style={{color:'var(--accent-bright)',textDecoration:'none',fontWeight:600}}>Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
