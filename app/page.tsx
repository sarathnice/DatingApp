'use client';

import { useState } from 'react';
import { BadgeCheck, Bot, BriefcaseBusiness, CalendarHeart, Check, ChevronDown, Compass, Globe2, Heart, Languages, MapPin, MessageCircle, Palette, RotateCcw, Search, Send, Settings2, ShieldCheck, Sparkles, Star, UserRound, UsersRound, WandSparkles, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const themes = [
  { id: 'sunrise', name: 'Sunrise', note: 'Warm & human', color: '#ef6547' },
  { id: 'bloom', name: 'Bloom', note: 'Playful & social', color: '#8e5bdb' },
  { id: 'midnight', name: 'Midnight', note: 'Premium & cinematic', color: '#7be4cb' },
  { id: 'paper', name: 'Paper', note: 'Minimal & direct', color: '#d6ff4b' },
] as const;
type Theme = (typeof themes)[number]['id'];
type Tab = 'discover' | 'explore' | 'likes' | 'chats' | 'you';

const navigation = [
  { id: 'discover', label: 'Discover', icon: Sparkles }, { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'likes', label: 'Likes', icon: Heart }, { id: 'chats', label: 'Chats', icon: MessageCircle },
  { id: 'you', label: 'You', icon: UserRound },
] as const;

const featureGroups = [
  { label: 'Core experience', timing: 'MVP', features: [
    ['Swipe discovery', 'Like, pass, undo and priority introduction.', Heart],
    ['Mutual-match chat', 'Messaging opens only after both people accept.', MessageCircle],
    ['Explore by intention', 'Serious, new in town, travel, culture and more.', Compass],
    ['Likes & controls', 'Preferences, privacy, notifications and pause.', Settings2],
  ]},
  { label: 'Mila intelligence', timing: 'MVP +', features: [
    ['Explain my match', 'Reasons based on goals, habits and values.', Sparkles],
    ['Profile Studio', 'Photo and prompt coaching—never auto-published.', WandSparkles],
    ['Conversation Copilot', 'Openers, tone help and translation with approval.', Bot],
    ['Dating bandwidth', 'Choose how many active introductions feel right.', CalendarHeart],
  ]},
  { label: 'Trust & worldwide', timing: 'MVP', features: [
    ['Verification & safety', 'Liveness checks, scam signals and reporting.', ShieldCheck],
    ['Language bridge', 'Translate while preserving personality and tone.', Languages],
    ['Global identity', 'City, roots, languages and relocation—each optional.', Globe2],
    ['Safe date planning', 'Public places, trusted contacts and check-ins.', UsersRound],
  ]},
] as const;

export default function Home() {
  const [theme, setTheme] = useState<Theme>('sunrise');
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [decision, setDecision] = useState<'idle' | 'liked' | 'passed' | 'intro'>('idle');
  const [showReason, setShowReason] = useState(false);

  return <main className={`preview-shell theme-${theme}`}>
    <header className="preview-header">
      <a className="mila-brand" href="#preview"><span className="mila-mark">m</span><span>mila</span></a>
      <div className="preview-label"><span /> Product concept · September 2026</div>
      <Button className="feature-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>View feature plan <ChevronDown /></Button>
    </header>

    <section className="preview-stage" id="preview">
      <div className="stage-copy">
        <span className="section-kicker"><Globe2 /> Worldwide dating, made personal</span>
        <h1>Meet with<br /><em>more meaning.</em></h1>
        <p>Mila keeps the familiar ease of swiping, then adds explainable compatibility, safer conversations and room for every culture.</p>
        <div className="theme-picker">
          <div className="picker-heading"><Palette /><span><strong>Choose your Mila</strong><small>The entire app changes instantly</small></span></div>
          <div className="theme-options">{themes.map(item => <button key={item.id} onClick={() => setTheme(item.id)} aria-pressed={theme === item.id}><i style={{background:item.color}}/><span><b>{item.name}</b><small>{item.note}</small></span>{theme === item.id && <Check />}</button>)}</div>
        </div>
        <div className="guardrail"><ShieldCheck /><span><strong>Consent comes first</strong>Chat unlocks only after a mutual match. AI suggests—it never speaks for you.</span></div>
      </div>

      <div className="phone-area">
        <div className="phone-shadow" />
        <div className="phone-frame">
          <div className="phone-top"><span>9:41</span><i /><div><span/><span/><span/></div></div>
          <div className="phone-screen">
            <div className="app-head"><span className="phone-brand"><i>m</i> mila</span><button aria-label="Search"><Search /></button><button aria-label="Settings"><Settings2 /></button></div>
            <div className="screen-content">
              {activeTab === 'discover' && <div className="discover-screen">
                <div className="discovery-title"><span>For you</span><button>New York <ChevronDown /></button></div>
                <article className={`profile-card card-${decision}`}>
                  <div className="profile-image">
                    <div className="story-dots"><i/><i/><i/><i/></div><span className="verified-pill"><BadgeCheck /> Verified</span>
                    {decision !== 'idle' && <div className="decision-stamp">{decision === 'passed' ? 'Maybe later' : decision === 'intro' ? 'Intro sent' : 'Liked'}</div>}
                    <div className="profile-gradient"/><div className="profile-details">
                      <div className="name-line"><h2>Maya, 29</h2><BadgeCheck /></div>
                      <p><BriefcaseBusiness /> Product designer</p><p><MapPin /> Brooklyn · 3 miles away</p>
                      <div className="profile-tags"><span>Long-term</span><span>Indie films</span><span>Gujarati + English</span></div>
                    </div>
                  </div>
                  <button className="match-reason" onClick={() => setShowReason(!showReason)}><span><Sparkles /><b>Why Mila picked Maya</b></span><ChevronDown /></button>
                  {showReason && <div className="reason-panel"><span><Check /> Same relationship goal</span><span><Check /> Similar social energy</span><span><Check /> Both open to relocating</span></div>}
                </article>
                <div className="swipe-actions"><button aria-label="Pass" onClick={() => setDecision('passed')}><X /></button><button aria-label="Undo" onClick={() => setDecision('idle')}><RotateCcw /></button><button className="priority" aria-label="Meaningful intro" onClick={() => setDecision('intro')}><Star /></button><button className="like" aria-label="Like" onClick={() => setDecision('liked')}><Heart /></button></div>
                <div className="swipe-hint"><span>Swipe left to pass</span><span>Swipe right to like</span></div>
              </div>}

              {activeTab === 'explore' && <div className="inner-screen"><span className="screen-kicker">Explore</span><h2>Date with intention.</h2><p>Choose a space that matches what you want today.</p><div className="explore-grid">
                <button className="wide"><Heart /><span><b>Ready for real</b><small>Long-term connections</small></span></button>
                <button><MapPin /><span><b>New in town</b><small>Meet nearby</small></span></button><button><Globe2 /><span><b>Across borders</b><small>Open to distance</small></span></button>
                <button><Zap /><span><b>Free tonight</b><small>Spontaneous plans</small></span></button><button><UsersRound /><span><b>Culture & roots</b><small>Share your world</small></span></button>
              </div></div>}

              {activeTab === 'likes' && <div className="inner-screen"><span className="screen-kicker">Likes you</span><h2>Three people noticed you.</h2><p>Profiles stay private until you choose to look.</p><div className="likes-grid"><div/><div/><div/><div/></div><button className="primary-cta">See who likes you <Heart /></button></div>}

              {activeTab === 'chats' && <div className="inner-screen"><span className="screen-kicker">Messages</span><h2>Good conversations.</h2><div className="new-matches"><span className="mini-avatar">M</span><span className="mini-avatar alt">A</span><button><Heart /> New match</button></div>
                <div className="chat-row"><span className="chat-avatar">M</span><div><b>Maya <BadgeCheck /></b><small>That bookstore sounds perfect!</small></div><time>2m</time></div>
                <div className="chat-row"><span className="chat-avatar blue">A</span><div><b>Alex</b><small>You: How was Lisbon?</small></div><time>1h</time></div>
                <div className="copilot-card"><Bot /><div><b>Conversation Copilot</b><span>Ask Mila for an opener based on your shared interests.</span></div><button aria-label="Try copilot"><Send /></button></div>
              </div>}

              {activeTab === 'you' && <div className="inner-screen you-screen"><span className="screen-kicker">Your Mila</span><h2>Make it feel like you.</h2><p>Your appearance preference stays on this device.</p>
                <div className="profile-summary"><div className="you-avatar">S</div><span><b>Your profile</b><small>82% complete · Verified</small></span><button>Edit</button></div><h3>Appearance</h3>
                <div className="in-app-themes">{themes.map(item => <button key={item.id} onClick={() => setTheme(item.id)} aria-pressed={theme === item.id}><i style={{background:item.color}}/>{item.name}{theme === item.id && <Check />}</button>)}</div>
                <div className="setting-row"><Languages /><span><b>Languages</b><small>English + 2 more</small></span><ChevronDown /></div><div className="setting-row"><ShieldCheck /><span><b>Safety center</b><small>Verification and privacy</small></span><ChevronDown /></div>
              </div>}
            </div>
            <nav className="bottom-nav">{navigation.map(item => {const Icon=item.icon;return <button key={item.id} onClick={() => setActiveTab(item.id)} aria-current={activeTab===item.id?'page':undefined}><Icon/><span>{item.label}</span>{item.id==='chats'&&<i>2</i>}</button>})}</nav>
          </div><div className="home-indicator"/>
        </div><p className="try-note"><span /> Live preview—try the tabs, themes and profile actions</p>
      </div>
    </section>

    <section className="feature-plan" id="features"><div className="plan-heading"><span className="section-kicker"><Sparkles /> Proposed product scope</span><h2>Everything Mila should do—<br/><em>in the right order.</em></h2><p>The first release creates a complete dating loop. Advanced AI strengthens compatibility and confidence without replacing human judgment.</p></div>
      <div className="feature-groups">{featureGroups.map(group => <article key={group.label} className="feature-group"><header><span>{group.label}</span><b>{group.timing}</b></header>{group.features.map(([title,description,Icon]) => <div className="feature-row" key={title as string}><i><Icon/></i><span><strong>{title as string}</strong><small>{description as string}</small></span><Check/></div>)}</article>)}</div>
    </section>
    <section className="product-rules"><div><span>01</span><strong>Familiar first</strong><p>Swiping, likes and chat remain easy to understand anywhere in the world.</p></div><div><span>02</span><strong>AI with permission</strong><p>Every suggestion is visible, explainable and controlled by the member.</p></div><div><span>03</span><strong>Safety is free</strong><p>Verification, blocking, reporting and essential protections never require payment.</p></div></section>
  </main>;
}
