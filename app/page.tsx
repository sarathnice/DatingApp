'use client';

import { useState } from 'react';
import { ArrowRight, Check, Heart, MapPin, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const directions = [
  { id: 'saffron', label: '01 Warm', note: 'Editorial & human' },
  { id: 'lotus', label: '02 Fresh', note: 'Bright & optimistic' },
  { id: 'indigo', label: '03 After dark', note: 'Premium & intimate' },
] as const;

type Direction = (typeof directions)[number]['id'];

export default function Home() {
  const [direction, setDirection] = useState<Direction>('saffron');
  const [decision, setDecision] = useState<'idle' | 'passed' | 'liked'>('idle');

  return (
    <main className={`app-shell theme-${direction}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Mila home"><span className="brand-mark">m</span><span>mila</span></a>
        <p className="promise"><ShieldCheck size={15} /> Curated for the Indian diaspora</p>
        <Button className="join-button" onClick={() => document.getElementById('concepts')?.scrollIntoView({ behavior: 'smooth' })}>Join thoughtfully <ArrowRight /></Button>
      </header>

      <section className="discovery" id="top">
        <div className="intro">
          <span className="eyebrow"><Sparkles size={14} /> Today’s introduction</span>
          <h1>Someone who gets<br />both <em>worlds.</em></h1>
          <p>Intentional introductions for South Asians building a life in America—with room for where you came from and who you’re becoming.</p>
          <div className="trust-row"><div className="avatar-stack"><span>AK</span><span>RS</span><span>NM</span></div><span>2,400+ thoughtful introductions this month</span></div>
        </div>

        <article className={`match-card decision-${decision}`} aria-label="Profile for Maya">
          <div className="profile-photo" role="img" aria-label="Maya smiling outdoors in New York">
            <div className="photo-monogram">M</div>
            <span className="match-pill"><span /> Strong match</span>
          </div>
          <div className="profile-copy">
            <div><h2>Maya <span>29</span></h2><p><MapPin size={14} /> Brooklyn, NY · Gujarati</p></div>
            <p className="profile-quote">“Equal parts Sunday dosa, indie films, and convincing myself I’ll run the NYC marathon.”</p>
            <div className="tags"><span>Product designer</span><span>Family-minded</span><span>NYC → Ahmedabad</span></div>
          </div>
          <div className="actions">
            <Button aria-label="Pass on Maya" variant="outline" size="icon-lg" onClick={() => setDecision('passed')}><X /></Button>
            <Button aria-label="Like Maya" className="like-button" size="lg" onClick={() => setDecision('liked')}><Heart /> {decision === 'liked' ? 'Introduction requested' : 'I’d like to meet'}</Button>
          </div>
          {decision !== 'idle' && <button className="undo" onClick={() => setDecision('idle')}>Undo</button>}
        </article>

        <aside className="compatibility">
          <span className="compat-number">88</span><span className="compat-percent">%</span><strong>Compatibility</strong>
          <div><span><Check /> Shared values</span><span><Check /> Same city</span><span><Check /> Similar pace</span></div>
          <p>Based on what matters to both of you—not endless swiping.</p>
        </aside>
      </section>

      <section className="concepts" id="concepts">
        <div className="concept-heading"><span className="eyebrow">Choose the feeling</span><h2>Three ways Mila could feel.</h2><p>Same thoughtful product, distinct emotional tone. Switch live to compare the full experience.</p></div>
        <div className="concept-grid">
          {directions.map((item, index) => (
            <button key={item.id} className={`concept-card ${direction === item.id ? 'active' : ''}`} onClick={() => setDirection(item.id)} aria-pressed={direction === item.id}>
              <span className={`swatch swatch-${item.id}`}><i /><i /><i /></span>
              <span className="concept-meta"><b>{item.label}</b><small>{item.note}</small></span>
              <span className="select-indicator">{direction === item.id ? <Check /> : String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
