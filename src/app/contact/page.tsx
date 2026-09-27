'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { JOB_CATEGORIES } from '@/lib/data';

export default function ContactPage() {
  const [tab, setTab] = useState<'quote'|'contact'>('quote');
  const [quoteForm, setQuoteForm] = useState({ name:'', email:'', phone:'', sourceLanguage:'', targetLanguage:'', serviceType:'', wordCount:'', deadline:'', notes:'' });
  const [contactForm, setContactForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading');
    try {
      const res = await fetch('/api/quotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(quoteForm) });
      setStatus(res.ok ? 'success' : 'error');
    } catch { setStatus('error'); }
  };

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactForm) });
      setStatus(res.ok ? 'success' : 'error');
    } catch { setStatus('error'); }
  };

  const inp: React.CSSProperties = { width:'100%', padding:'11px 14px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text-primary)', fontSize:'.9rem', fontFamily:'var(--font-body)', outline:'none', transition:'border-color .2s' };
  const lbl: React.CSSProperties = { display:'block', fontSize:'.76rem', color:'var(--text-secondary)', marginBottom:6, fontFamily:'var(--font-display)', fontWeight:500 };
  const fo = (e: any) => e.target.style.borderColor = 'var(--accent)';
  const bl = (e: any) => e.target.style.borderColor = 'var(--border)';

  return (
    <>
      <section style={{ paddingTop:116, paddingBottom:48, background:'var(--bg-surface)', position:'relative', overflow:'hidden' }}>
        <div className="grid-bg" style={{ position:'absolute', inset:0, opacity:.45 }} />
        <div className="container-brand" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <span style={{ fontSize:'.75rem', fontFamily:'var(--font-display)', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--accent)', display:'block', marginBottom:12 }}>— Get in Touch —</span>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(1.8rem,5vw,2.8rem)', color:'var(--text-primary)', lineHeight:1.15, marginBottom:12 }}>
            Start Your Translation <span style={{ background:'linear-gradient(135deg,var(--sand),var(--accent-bright))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Project</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', maxWidth:480, margin:'0 auto' }}>Request a quote or send us a message. We respond within 2 hours.</p>
        </div>
      </section>

      <section className="section-pad" style={{ background:'var(--bg-base)' }}>
        <div className="container-brand">
          <div style={{ display:'grid', gap:48, alignItems:'start' }} className="contact-grid">
            <div>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:24 }}>Contact Info</h2>
              {[
                { icon: Mail, label:'Email', value:'info@bfblessy.com', href:'mailto:info@bfblessy.com', color:'var(--accent)' },
                { icon: Phone, label:'Phone / WhatsApp', value:'+255 XXX XXX XXX', href:'tel:+255000000000', color:'#4CAF50' },
                { icon: MapPin, label:'Office', value:'Dar es Salaam, Tanzania', href:'#', color:'var(--sand)' },
                { icon: Clock, label:'Working Hours', value:'Mon–Sat: 8am – 8pm EAT', href:'#', color:'#F59E0B' },
              ].map(({ icon:Icon, label, value, href, color }, i) => (
                <a key={i} href={href} style={{ display:'flex', gap:14, alignItems:'center', marginBottom:20, textDecoration:'none' }}>
                  <div style={{ width:42, height:42, borderRadius:11, flexShrink:0, background:`${color}14`, border:`1px solid ${color}22`, display:'flex', alignItems:'center', justifyContent:'center', color }}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize:'.74rem', color:'var(--text-secondary)', fontFamily:'var(--font-display)', fontWeight:500, marginBottom:2 }}>{label}</div>
                    <div style={{ color:'var(--text-primary)', fontSize:'.88rem', fontWeight:500 }}>{value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div>
              <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--bg-card)', borderRadius:12, padding:4, border:'1px solid var(--border)' }}>
                {(['quote','contact'] as const).map(t => (
                  <button key={t} onClick={() => { setTab(t); setStatus('idle'); }} style={{ flex:1, padding:'9px', borderRadius:9, border:'none', cursor:'pointer', transition:'all .18s', background:tab===t?'var(--bg-surface)':'transparent', color:tab===t?'var(--text-primary)':'var(--text-secondary)', fontFamily:'var(--font-display)', fontWeight:600, fontSize:'.84rem', boxShadow:tab===t?'0 2px 8px rgba(0,0,0,.3)':'none' }}>
                    {t==='quote'?'📋 Request Quote':'✉️ Send Message'}
                  </button>
                ))}
              </div>

              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:20, padding:'clamp(20px,5vw,34px)' }}>
                {status==='success' ? (
                  <div style={{ textAlign:'center', padding:'44px 20px' }}>
                    <CheckCircle size={52} style={{ color:'#4CAF50', margin:'0 auto 16px' }} />
                    <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.15rem', color:'var(--text-primary)', marginBottom:10 }}>{tab==='quote'?'Quote Request Sent!':'Message Sent!'}</h3>
                    <p style={{ color:'var(--text-secondary)', fontSize:'.88rem', lineHeight:1.65, marginBottom:22 }}>{tab==='quote'?'We\'ll review your requirements and respond within 2 hours.':'We\'ll reply to your message shortly.'}</p>
                    <button onClick={()=>setStatus('idle')} className="btn-secondary" style={{ fontSize:'.84rem' }}>Submit Another</button>
                  </div>
                ) : tab==='quote' ? (
                  <form onSubmit={submitQuote} style={{ display:'flex', flexDirection:'column', gap:13 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
                      <div><label style={lbl}>Full Name *</label><input style={inp} required placeholder="Your name" value={quoteForm.name} onChange={e=>setQuoteForm(f=>({...f,name:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                      <div><label style={lbl}>Email *</label><input style={inp} type="email" required placeholder="you@email.com" value={quoteForm.email} onChange={e=>setQuoteForm(f=>({...f,email:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                    </div>
                    <div><label style={lbl}>Phone / WhatsApp</label><input style={inp} placeholder="+255 XXX XXX XXX" value={quoteForm.phone} onChange={e=>setQuoteForm(f=>({...f,phone:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
                      <div><label style={lbl}>Service Category *</label>
                        <select style={inp} required value={quoteForm.serviceType} onChange={e=>setQuoteForm(f=>({...f,serviceType:e.target.value}))} onFocus={fo} onBlur={bl}>
                          <option value="">Select...</option>
                          {JOB_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.id}</option>)}
                        </select>
                      </div>
                      <div><label style={lbl}>Budget Range</label>
                        <select style={inp} required value={quoteForm.notes} onChange={e=>setQuoteForm(f=>({...f,notes:e.target.value}))} onFocus={fo} onBlur={bl}>
                          <option value="">Select...</option>
                          {JOB_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.id}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
                      <div><label style={lbl}>Service Type</label>
                        <select style={inp} value={quoteForm.serviceType} onChange={e=>setQuoteForm(f=>({...f,serviceType:e.target.value}))} onFocus={fo} onBlur={bl}>
                          <option value="">Select...</option>
                          {JOB_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.id}</option>)}
                        </select>
                      </div>
                      <div><label style={lbl}>Word Count</label><input style={inp} type="number" placeholder="e.g. 2000" value={quoteForm.wordCount} onChange={e=>setQuoteForm(f=>({...f,wordCount:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                    </div>
                    <div><label style={lbl}>Deadline</label><input style={inp} type="date" value={quoteForm.deadline} onChange={e=>setQuoteForm(f=>({...f,deadline:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                    <div><label style={lbl}>Notes & Requirements</label><textarea style={{...inp,minHeight:80,resize:'vertical' as const}} rows={3} placeholder="Document type, special requirements..." value={quoteForm.notes} onChange={e=>setQuoteForm(f=>({...f,notes:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                    {status==='error'&&<p style={{color:'var(--red)',fontSize:'.8rem'}}>Something went wrong. Try again.</p>}
                    <button type="submit" className="btn-primary" disabled={status==='loading'} style={{justifyContent:'center',padding:'13px',fontSize:'.95rem',marginTop:4}}>
                      {status==='loading'?'Sending...':<><Send size={15} /> Submit Quote Request</>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={submitContact} style={{ display:'flex', flexDirection:'column', gap:13 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
                      <div><label style={lbl}>Name *</label><input style={inp} required placeholder="Your name" value={contactForm.name} onChange={e=>setContactForm(f=>({...f,name:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                      <div><label style={lbl}>Email *</label><input style={inp} type="email" required placeholder="you@email.com" value={contactForm.email} onChange={e=>setContactForm(f=>({...f,email:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                    </div>
                    <div><label style={lbl}>Subject *</label><input style={inp} required placeholder="What's this about?" value={contactForm.subject} onChange={e=>setContactForm(f=>({...f,subject:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                    <div><label style={lbl}>Message *</label><textarea style={{...inp,minHeight:130,resize:'vertical' as const}} required rows={5} placeholder="Your message..." value={contactForm.message} onChange={e=>setContactForm(f=>({...f,message:e.target.value}))} onFocus={fo} onBlur={bl} /></div>
                    {status==='error'&&<p style={{color:'var(--red)',fontSize:'.8rem'}}>Something went wrong. Try again.</p>}
                    <button type="submit" className="btn-primary" disabled={status==='loading'} style={{justifyContent:'center',padding:'13px',fontSize:'.95rem'}}>
                      {status==='loading'?'Sending...':<><Send size={15} /> Send Message</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        @media(min-width:900px){.contact-grid{grid-template-columns:360px 1fr!important}}
        select option{background:#111820}
      `}</style>
    </>
  );
}
