'use client';

import { useState } from 'react';
import { ArrowRight, BadgeCheck, CalendarHeart, Check, ChevronLeft, ChevronRight, HandHeart, Heart, LockKeyhole, MapPin, MessageCircleHeart, Route, ShieldCheck, SlidersHorizontal, Sparkles, UsersRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const directions = [
  { id: 'saffron', short: 'Editorial', label: '01 Saffron Story', note: 'Warm, cultured & human', mood: 'For a trusted, relationship-first brand' },
  { id: 'lotus', short: 'Playful', label: '02 Lotus Pop', note: 'Bright, social & optimistic', mood: 'For a younger, high-energy community' },
  { id: 'indigo', short: 'Cinematic', label: '03 Indigo Nights', note: 'Premium, intimate & bold', mood: 'For a selective, members-club feel' },
  { id: 'mono', short: 'Minimal', label: '04 City Minimal', note: 'Crisp, direct & modern', mood: 'For a confident, urban product' },
] as const;

type Direction = (typeof directions)[number]['id'];

const differentiators = [
  { id: 'life', icon: Route, title: 'Life Map', description: 'Match on where life is headed—not only where you live today.' },
  { id: 'family', icon: UsersRound, title: 'Family Pace', description: 'Privately align on if, when, and how families become involved.' },
  { id: 'culture', icon: HandHeart, title: 'Culture, in context', description: 'Share how culture shows up in your life without reducing it to a filter.' },
  { id: 'energy', icon: CalendarHeart, title: 'Dating bandwidth', description: 'Set your real pace so promising matches do not become notification debt.' },
] as const;

type Feature = (typeof differentiators)[number]['id'];

export default function Home() {
  const [direction, setDirection] = useState<Direction>('saffron');
  const [decision, setDecision] = useState<'idle' | 'passed' | 'liked'>('idle');
  const [activeFeature, setActiveFeature] = useState<Feature>('life');
  const [lifePlan, setLifePlan] = useState('Flexible');
  const [familyPace, setFamilyPace] = useState('After we feel ready');

  const cycleDirection = (step: number) => {
    const current = directions.findIndex((item) => item.id === direction);
    setDirection(directions[(current + step + directions.length) % directions.length].id);
  };

  return (
    <main className={`app-shell theme-${direction}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Mila home"><span className="brand-mark">m</span><span>mila</span></a>
        <p className="promise"><ShieldCheck size={15} /> Curated for the Indian diaspora</p>
        <Button className="join-button" onClick={() => document.getElementById('concepts')?.scrollIntoView({ behavior: 'smooth' })}>Join thoughtfully <ArrowRight /></Button>
      </header>

      <nav className="style-dock" aria-label="Choose a design direction">
        <button className="dock-arrow" aria-label="Previous look" onClick={() => cycleDirection(-1)}><ChevronLeft /></button>
        <span>Look & feel</span>
        {directions.map((item) => (
          <button key={item.id} onClick={() => setDirection(item.id)} aria-pressed={direction === item.id}>
            <i className={`dock-dot dock-${item.id}`} /> {item.short}
          </button>
        ))}
        <button className="dock-arrow" aria-label="Next look" onClick={() => cycleDirection(1)}><ChevronRight /></button>
      </nav>

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

      <section className="market-gap" id="difference">
        <div className="gap-heading">
          <span className="eyebrow">Beyond the swipe</span>
          <h2>The questions that matter<br />after <em>“we matched.”</em></h2>
          <p>Popular apps are good at attraction and introductions. Mila adds a private alignment layer for the realities of building a bicultural life.</p>
          <div className="foundation-list">
            <span><BadgeCheck /> Identity verification</span>
            <span><MessageCircleHeart /> Prompt-led messages</span>
            <span><ShieldCheck /> Share-a-date safety</span>
          </div>
        </div>

        <div className="alignment-lab">
          <div className="lab-topline"><span><LockKeyhole /> Visible only to mutual matches</span><strong>Mila alignment</strong></div>
          <div className="feature-tabs" role="tablist" aria-label="Explore Mila features">
            {differentiators.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} role="tab" aria-label={item.title} aria-selected={activeFeature === item.id} onClick={() => setActiveFeature(item.id)}><Icon /><span>{item.title}</span></button>;
            })}
          </div>

          <div className="lab-panel" role="tabpanel">
            {activeFeature === 'life' && <>
              <span className="panel-kicker">01 · Future geography</span>
              <h3>Where could home be in 3 years?</h3>
              <p>Compare possibilities without treating today’s ZIP code as destiny.</p>
              <div className="option-row">{['USA', 'India', 'Flexible'].map((item) => <Button key={item} variant={lifePlan === item ? 'default' : 'outline'} onClick={() => setLifePlan(item)}>{item}</Button>)}</div>
              <div className="shared-signal"><Route /><div><strong>You both chose {lifePlan}</strong><span>Maya is also open to New York, Austin, or Bengaluru.</span></div><Check /></div>
            </>}
            {activeFeature === 'family' && <>
              <span className="panel-kicker">02 · Family involvement</span>
              <h3>When should family enter the story?</h3>
              <p>Your answer stays private until there is a mutual match.</p>
              <div className="choice-stack">{['Early—I value their perspective', 'After we feel ready', 'Much later—keep it between us'].map((item) => <button key={item} aria-pressed={familyPace === item} onClick={() => setFamilyPace(item)}><span />{item}{familyPace === item && <Check />}</button>)}</div>
            </>}
            {activeFeature === 'culture' && <>
              <span className="panel-kicker">03 · Cultural rhythm</span>
              <h3>Describe it. Don’t checkbox it.</h3>
              <p>Mila replaces rigid community filters with lived, optional context.</p>
              <blockquote>“I speak Telugu with my parents, celebrate the big holidays, and want a partner who’s curious—not necessarily identical.”</blockquote>
              <div className="context-tags"><span>Languages at home</span><span>Traditions I keep</span><span>What I’m reimagining</span></div>
            </>}
            {activeFeature === 'energy' && <>
              <span className="panel-kicker">04 · Intentional pacing</span>
              <h3>How much space do you have for dating?</h3>
              <p>Mila limits active introductions to match your capacity—without hiding your profile.</p>
              <div className="capacity"><SlidersHorizontal /><div><strong>2 active introductions</strong><span>One thoughtful match every Thursday</span></div><b>Balanced</b></div>
              <div className="capacity-track"><i /></div>
            </>}
          </div>
        </div>
      </section>

      <section className="principles">
        <div><span>01</span><strong>Explain the match</strong><p>Show shared values and meaningful differences, not a mysterious score.</p></div>
        <div><span>02</span><strong>Consent before context</strong><p>Sensitive family and future answers unlock only after mutual interest.</p></div>
        <div><span>03</span><strong>Quality over queue</strong><p>Fewer active introductions, clearer closure, and no endless swipe pressure.</p></div>
      </section>

      <section className="concepts" id="concepts">
        <div className="concept-heading"><span className="eyebrow">Choose the feeling</span><h2>Four distinct directions.</h2><p>Not just new colors—each option changes the typography, shape language, layout, depth, and overall brand personality.</p></div>
        <div className="concept-grid">
          {directions.map((item, index) => (
            <button key={item.id} className={`concept-card ${direction === item.id ? 'active' : ''}`} onClick={() => setDirection(item.id)} aria-pressed={direction === item.id}>
              <span className={`swatch swatch-${item.id}`}><i /><i /><i /><span className="mini-card" /></span>
              <span className="concept-meta"><b>{item.label}</b><small>{item.note}</small><em>{item.mood}</em></span>
              <span className="select-indicator">{direction === item.id ? <Check /> : String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
