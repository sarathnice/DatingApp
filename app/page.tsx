'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, BadgeCheck, Ban, Bot, BriefcaseBusiness, CalendarHeart, Check, ChevronDown, Compass, EyeOff, Flag, Globe2, Heart, Languages, LocateFixed, MapPin, MessageCircle, MoreHorizontal, Palette, Play, RotateCcw, Search, Send, Settings2, ShieldCheck, Sparkles, Star, UserRound, UsersRound, WandSparkles, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const themes = [
  { id: 'sunrise', name: 'Sunrise', note: 'Warm & human', color: '#ef6547' },
  { id: 'bloom', name: 'Bloom', note: 'Playful & social', color: '#8e5bdb' },
  { id: 'midnight', name: 'Midnight', note: 'Premium & cinematic', color: '#7be4cb' },
  { id: 'paper', name: 'Paper', note: 'Minimal & direct', color: '#d6ff4b' },
] as const;
type Theme = (typeof themes)[number]['id'];
type Tab = 'discover' | 'explore' | 'likes' | 'chats' | 'you';
type Platform = 'ios' | 'android';

const navigation = [
  { id: 'discover', label: 'Discover', icon: Sparkles }, { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'likes', label: 'Likes', icon: Heart }, { id: 'chats', label: 'Chats', icon: MessageCircle },
  { id: 'you', label: 'Profile', icon: UserRound },
] as const;

const featureGroups = [
  { label: 'Core experience', timing: 'MVP', features: [
    ['Swipe discovery', 'Like, pass, undo and priority introduction.', Heart], ['Mutual-match chat', 'Messaging opens only after both people accept.', MessageCircle],
    ['Explore by intention', 'Serious, new in town, travel, culture and more.', Compass], ['Likes & controls', 'Preferences, privacy, notifications and pause.', Settings2],
  ]},
  { label: 'Mila intelligence', timing: 'MVP +', features: [
    ['Explain my match', 'Reasons based on goals, habits and values.', Sparkles], ['Profile Studio', 'Photo and prompt coaching—never auto-published.', WandSparkles],
    ['Conversation Copilot', 'Openers, tone help and translation with approval.', Bot], ['Dating bandwidth', 'Choose how many active introductions feel right.', CalendarHeart],
  ]},
  { label: 'Trust & worldwide', timing: 'MVP', features: [
    ['Verification & safety', 'Liveness checks, scam signals and reporting.', ShieldCheck], ['Language bridge', 'Translate while preserving personality and tone.', Languages],
    ['Global identity', 'City, roots, languages and relocation—each optional.', Globe2], ['Safe date planning', 'Public places, trusted contacts and check-ins.', UsersRound],
  ]},
] as const;

function MobileScreen({ platform, activeTab, onTab, theme, onTheme, decision, onDecision, showReason, onReason, profileOpen, onProfileOpen, safetyOpen, onSafetyOpen, blocked, onBlocked, hidden, onHidden, mediaIndex, onMediaIndex, radius, onRadius }: {
  platform: Platform; activeTab: Tab; onTab: (tab: Tab) => void; theme: Theme; onTheme: (theme: Theme) => void;
  decision: 'idle' | 'liked' | 'passed' | 'intro'; onDecision: (value: 'idle' | 'liked' | 'passed' | 'intro') => void; showReason: boolean; onReason: () => void;
  profileOpen: boolean; onProfileOpen: (value: boolean) => void; safetyOpen: boolean; onSafetyOpen: (value: boolean) => void;
  blocked: boolean; onBlocked: (value: boolean) => void; hidden: boolean; onHidden: (value: boolean) => void;
  mediaIndex: number; onMediaIndex: (value: number) => void; radius: number; onRadius: (value: number) => void;
}) {
  const dragStart = useRef<number | null>(null); const [dragX,setDragX]=useState(0);
  const finishSwipe = () => { if(dragX > 58) onDecision('liked'); else if(dragX < -58) onDecision('passed'); setDragX(0); dragStart.current=null; };
  const cycleRadius = () => onRadius(radius === 5 ? 10 : radius === 10 ? 25 : 5);
  return <div className={`device-column ${platform}`}>
    <div className="device-caption"><span>{platform === 'ios' ? 'iOS' : 'Android'}</span><small>{platform === 'ios' ? 'iPhone 16 · Native layout' : 'Pixel 10 · Material layout'}</small></div>
    <div className={`phone-frame compare-phone ${platform}`}>
      <div className="phone-top"><span>{platform === 'ios' ? '9:41' : '10:10'}</span><i/><div><span/><span/><span/></div></div>
      <div className="phone-screen">
        <div className="app-head"><span className="phone-brand"><i>m</i> mila</span><button aria-label="Search"><Search/></button><button aria-label="Settings"><Settings2/></button></div>
        <div className="screen-content">
          {activeTab === 'discover' && <div className="discover-screen">
            <div className="discovery-title"><span><LocateFixed/> Nearby · 12 profiles</span><button onClick={cycleRadius}>Within {radius} mi <ChevronDown/></button></div>
            {blocked ? <div className="blocked-state"><span><Ban/></span><h3>Maya is blocked</h3><p>You will not see each other or be able to message.</p><button onClick={() => onBlocked(false)}>Undo block</button></div> : <><article className={`profile-card card-${decision} ${dragX!==0?'is-dragging':''}`} style={dragX ? {transform:`translateX(${dragX}px) rotate(${dragX/20}deg)`}:undefined} onPointerDown={e => {if((e.target as HTMLElement).closest('button'))return;dragStart.current=e.clientX;e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e => {if(dragStart.current!==null)setDragX(e.clientX-dragStart.current)}} onPointerUp={finishSwipe} onPointerCancel={finishSwipe}>
              <div className={`profile-image media-${mediaIndex}`}><div className="story-dots">{[0,1,2,3].map(i=><i key={i} className={mediaIndex===i?'active':''}/>)}</div><span className="verified-pill"><BadgeCheck/> Verified</span>{mediaIndex===3&&<span className="video-pill"><Play/> Video · 0:12</span>}
                {decision !== 'idle' && <div className="decision-stamp">{decision === 'passed' ? 'Maybe later' : decision === 'intro' ? 'Intro sent' : 'Liked'}</div>}
                <button className="media-prev" onClick={()=>onMediaIndex((mediaIndex+3)%4)} aria-label="Previous photo"/><button className="media-next" onClick={()=>onMediaIndex((mediaIndex+1)%4)} aria-label="Next photo"/>
                <div className="profile-gradient"/><div className="profile-details"><div className="name-line"><h2>Maya, 29</h2><BadgeCheck/></div><p><BriefcaseBusiness/> Product designer</p><p><MapPin/> Brooklyn · 3 miles away</p><div className="profile-tags"><span>Long-term</span><span>Indie films</span><span>Gujarati + English</span></div><button className="view-profile" onClick={() => onProfileOpen(true)}>View all 3 photos + video <ChevronDown/></button></div>
              </div>
              <button className="match-reason" onClick={onReason}><span><Sparkles/><b>Why Mila picked Maya</b></span><ChevronDown/></button>
              {showReason && <div className="reason-panel"><span><Check/> Same relationship goal</span><span><Check/> Similar social energy</span><span><Check/> Both open to relocating</span></div>}
            </article>
            <div className="swipe-actions"><button aria-label="Pass" onClick={() => onDecision('passed')}><X/></button><button aria-label="Undo" onClick={() => onDecision('idle')}><RotateCcw/></button><button className="priority" aria-label="Meaningful intro" onClick={() => onDecision('intro')}><Star/></button><button className="like" aria-label="Like" onClick={() => onDecision('liked')}><Heart/></button></div>
            <div className="swipe-hint"><span>Pass</span><span>Meaningful intro</span><span>Like</span></div></>}
          </div>}
          {activeTab === 'explore' && <div className="inner-screen"><span className="screen-kicker">Explore</span><h2>Date with intention.</h2><p>Choose a space that matches what you want today.</p><div className="explore-grid"><button className="wide"><Heart/><span><b>Ready for real</b><small>Long-term connections</small></span></button><button><MapPin/><span><b>New in town</b><small>Meet nearby</small></span></button><button><Globe2/><span><b>Across borders</b><small>Open to distance</small></span></button><button><Zap/><span><b>Free tonight</b><small>Spontaneous plans</small></span></button><button><UsersRound/><span><b>Culture & roots</b><small>Share your world</small></span></button></div></div>}
          {activeTab === 'likes' && <div className="inner-screen"><span className="screen-kicker">Likes you</span><h2>Three people noticed you.</h2><p>Profiles stay private until you choose to look.</p><div className="likes-grid"><div/><div/><div/><div/></div><button className="primary-cta">See who likes you <Heart/></button></div>}
          {activeTab === 'chats' && <div className="inner-screen"><span className="screen-kicker">Messages</span><h2>Good conversations.</h2><div className="new-matches"><span className="mini-avatar">M</span><span className="mini-avatar alt">A</span><button><Heart/> New match</button></div><div className="chat-row"><span className="chat-avatar">M</span><div><b>Maya <BadgeCheck/></b><small>That bookstore sounds perfect!</small></div><time>2m</time></div><div className="chat-row"><span className="chat-avatar blue">A</span><div><b>Alex</b><small>You: How was Lisbon?</small></div><time>1h</time></div><div className="copilot-card"><Bot/><div><b>Conversation Copilot</b><span>Ask Mila for an opener based on shared interests.</span></div><button aria-label="Try copilot"><Send/></button></div></div>}
          {activeTab === 'you' && <div className="inner-screen you-screen"><span className="screen-kicker">Your Mila</span><h2>Make it feel like you.</h2><p>Control your profile, privacy and appearance.</p><div className="profile-summary"><div className="you-avatar">S</div><span><b>Your profile</b><small>82% complete · Verified</small></span><button>Edit</button></div><div className={`hide-profile-card ${hidden?'is-hidden':''}`}><EyeOff/><span><b>Hide my profile</b><small>{hidden?'Hidden from new people. Matches can still chat.':'Stop appearing in Discover without losing matches.'}</small></span><Switch size="sm" checked={hidden} onCheckedChange={onHidden} aria-label="Hide my profile"/></div><h3>Appearance</h3><div className="in-app-themes">{themes.map(item => <button key={item.id} onClick={() => onTheme(item.id)} aria-pressed={theme === item.id}><i style={{background:item.color}}/>{item.name}{theme === item.id && <Check/>}</button>)}</div><div className="setting-row"><Languages/><span><b>Languages</b><small>English + 2 more</small></span><ChevronDown/></div><div className="setting-row"><ShieldCheck/><span><b>Safety center</b><small>Verification and privacy</small></span><ChevronDown/></div></div>}
        </div>
        {profileOpen && <section className="full-profile"><div className={`full-profile-hero media-${mediaIndex}`}><button className="profile-back" onClick={() => {onProfileOpen(false);onSafetyOpen(false)}} aria-label="Back"><ArrowLeft/></button><button className="profile-more" onClick={() => onSafetyOpen(!safetyOpen)} aria-label="Safety options"><MoreHorizontal/></button>{safetyOpen && <div className="safety-menu"><button onClick={() => {onBlocked(true);onProfileOpen(false);onSafetyOpen(false)}}><Ban/> Block Maya</button><button><Flag/> Report profile</button><button onClick={() => onSafetyOpen(false)}>Cancel</button></div>}<button className="full-media-prev" onClick={()=>onMediaIndex((mediaIndex+3)%4)} aria-label="Previous media"><ArrowLeft/></button><button className="full-media-next" onClick={()=>onMediaIndex((mediaIndex+1)%4)} aria-label="Next media"><ArrowLeft/></button>{mediaIndex===3&&<span className="full-video"><Play/> Play video prompt</span>}<div className="profile-gradient"/><div className="full-name"><h2>Maya, 29</h2><BadgeCheck/><p><MapPin/> Brooklyn · 3 miles away</p></div></div><div className="media-thumbs">{[0,1,2,3].map(i=><button key={i} className={`media-${i} ${mediaIndex===i?'active':''}`} onClick={()=>onMediaIndex(i)} aria-label={i===3?'Video prompt':`Photo ${i+1}`}>{i===3&&<Play/>}</button>)}</div><div className="full-profile-copy"><span className="intent-pill"><Heart/> Looking for a long-term relationship</span><h3>About Maya</h3><p>Product designer, amateur film photographer and a firm believer that the best weekends begin without an itinerary.</p><h3>Two truths and a tiny hill</h3><blockquote>“I make excellent dosa, know every indie cinema in Brooklyn, and think window seats are overrated.”</blockquote><h3>Languages & life</h3><div className="full-tags"><span>English</span><span>Gujarati</span><span>Open to relocate</span><span>Family-minded</span></div></div><div className="full-actions"><button onClick={() => onProfileOpen(false)}><X/> Pass</button><button onClick={() => {onDecision('liked');onProfileOpen(false)}}><Heart/> Like Maya</button></div></section>}
        <nav className="bottom-nav" aria-label={`${platform} preview pages`}>{navigation.map(item => {const Icon=item.icon;return <button key={item.id} onClick={() => onTab(item.id)} aria-current={activeTab===item.id?'page':undefined}><Icon/><span>{item.label}</span>{item.id==='chats'&&<i>2</i>}</button>})}</nav>
      </div><div className="home-indicator"/>
    </div>
  </div>;
}

export default function Home() {
  const [theme,setTheme]=useState<Theme>('sunrise'); const [activeTab,setActiveTab]=useState<Tab>('discover');
  const [decision,setDecision]=useState<'idle'|'liked'|'passed'|'intro'>('idle'); const [showReason,setShowReason]=useState(false);
  const [profileOpen,setProfileOpen]=useState(false); const [safetyOpen,setSafetyOpen]=useState(false);
  const [blocked,setBlocked]=useState(false); const [hidden,setHidden]=useState(false);
  const [mediaIndex,setMediaIndex]=useState(0); const [radius,setRadius]=useState(5);
  const sharedPreview = {activeTab,onTab:setActiveTab,theme,onTheme:setTheme,decision,onDecision:setDecision,showReason,onReason:()=>setShowReason(!showReason),profileOpen,onProfileOpen:setProfileOpen,safetyOpen,onSafetyOpen:setSafetyOpen,blocked,onBlocked:setBlocked,hidden,onHidden:setHidden,mediaIndex,onMediaIndex:setMediaIndex,radius,onRadius:setRadius};
  return <main className={`preview-shell theme-${theme}`}>
    <header className="preview-header"><a className="mila-brand" href="#preview"><span className="mila-mark">m</span><span>mila</span></a><div className="preview-label"><span/> iOS + Android product preview</div><Button className="feature-link" onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>Feature plan <ChevronDown/></Button></header>
    <section className="compare-stage" id="preview">
      <div className="compare-heading"><span className="section-kicker"><Globe2/> Worldwide dating, made personal</span><h1>Discover people<br/><em>near your life.</em></h1><p>Drag Maya’s card left or right, tap either side of her photo to browse three photos and one video prompt, or adjust the nearby radius. Both previews update together.</p></div>
      <div className="preview-controls">
        <div className="control-group"><span>Preview page</span><div className="page-tabs">{navigation.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>setActiveTab(item.id)} aria-pressed={activeTab===item.id}><Icon/>{item.label}</button>})}</div></div>
        <div className="control-group"><span><Palette/> Theme</span><div className="compact-themes">{themes.map(item=><button key={item.id} title={item.note} onClick={()=>setTheme(item.id)} aria-label={`${item.name} theme`} aria-pressed={theme===item.id}><i style={{background:item.color}}/>{item.name}</button>)}</div></div>
      </div>
      <div className="device-grid"><MobileScreen platform="ios" {...sharedPreview}/><MobileScreen platform="android" {...sharedPreview}/></div>
      <div className="platform-notes"><div><strong>iOS direction</strong><span>Compact navigation, softer motion, sheet-style actions and familiar iPhone proportions.</span></div><div><strong>Android direction</strong><span>Material-style active states, roomier targets, system back behavior and Pixel proportions.</span></div></div>
    </section>
    <section className="feature-plan" id="features"><div className="plan-heading"><span className="section-kicker"><Sparkles/> Proposed product scope</span><h2>Everything Mila should do—<br/><em>in the right order.</em></h2><p>The first release creates a complete dating loop on both platforms. Advanced AI strengthens compatibility and confidence without replacing human judgment.</p></div><div className="feature-groups">{featureGroups.map(group=><article key={group.label} className="feature-group"><header><span>{group.label}</span><b>{group.timing}</b></header>{group.features.map(([title,description,Icon])=><div className="feature-row" key={title as string}><i><Icon/></i><span><strong>{title as string}</strong><small>{description as string}</small></span><Check/></div>)}</article>)}</div></section>
    <section className="product-rules"><div><span>01</span><strong>Shared product system</strong><p>Features and brand stay consistent while controls respect each platform.</p></div><div><span>02</span><strong>AI with permission</strong><p>Every suggestion is visible, explainable and controlled by the member.</p></div><div><span>03</span><strong>Safety is free</strong><p>Verification, blocking, reporting and essential protections never require payment.</p></div></section>
  </main>;
}
