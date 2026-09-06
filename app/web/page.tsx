"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Compass,
  Crown,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Mic,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./web.css";
import { MilaConnectMark } from "@/components/mila-connect-mark";

type WebTab = "discover" | "likes" | "messages" | "profile";

const profiles = [
  {
    id: "maya",
    name: "Maya",
    age: 29,
    city: "Brooklyn, NY",
    distance: "3 miles away",
    job: "Product designer",
    school: "Parsons School of Design",
    goal: "Long-term relationship",
    match: 92,
    about: "Curious about cities, food, and the small rituals that make a place feel like home. I value kindness, direct communication, and making time for the people I love.",
    tags: ["Indie films", "Food walks", "Design", "Weekend trips"],
    languages: "English · Gujarati",
  },
  {
    id: "arjun",
    name: "Arjun",
    age: 31,
    city: "Brooklyn, NY",
    distance: "4 miles away",
    job: "Climate-tech engineer",
    school: "Georgia Tech",
    goal: "Life partner",
    match: 89,
    about: "Engineer during the week, trail planner on weekends. Looking for a grounded relationship with someone who enjoys thoughtful conversations and spontaneous day trips.",
    tags: ["Hiking", "Live music", "Cooking", "Climate"],
    languages: "English · Hindi",
  },
  {
    id: "priya",
    name: "Priya",
    age: 30,
    city: "Jersey City, NJ",
    distance: "7 miles away",
    job: "Pediatric resident",
    school: "Rutgers Medical School",
    goal: "Long-term relationship",
    match: 86,
    about: "Warm, ambitious, and always collecting restaurant recommendations. Family matters to me, and so does building a life where both people keep growing.",
    tags: ["Dance", "Brunch", "Travel", "Family"],
    languages: "English · Telugu",
  },
] as const;

const navItems = [
  { id: "discover", label: "Discover", icon: Compass },
  { id: "likes", label: "Likes", icon: Heart },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: UserRound },
] as const;

export default function MilaWebApp() {
  const [activeTab, setActiveTab] = useState<WebTab>("discover");
  const [profileIndex, setProfileIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [introOpen, setIntroOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const profile = profiles[profileIndex];
  const liked = likedIds.includes(profile.id);
  const favorite = favoriteIds.includes(profile.id);

  useEffect(() => {
    document.documentElement.dataset.milaWebReady = "true";
    return () => {
      delete document.documentElement.dataset.milaWebReady;
    };
  }, []);

  const nextProfile = () => {
    setProfileIndex((current) => (current + 1) % profiles.length);
    setNotice("");
  };

  const toggleFavorite = () => {
    setFavoriteIds((current) => current.includes(profile.id)
      ? current.filter((id) => id !== profile.id)
      : [...current, profile.id]);
  };

  const likeProfile = () => {
    setLikedIds((current) => current.includes(profile.id) ? current : [...current, profile.id]);
    setNotice(`You liked ${profile.name}. We’ll let you know if it’s mutual.`);
  };

  return (
    <main className="mila-web-app">
      <aside className="web-sidebar" aria-label="Mila web navigation">
        <button className="web-brand" onClick={() => setActiveTab("discover")} aria-label="Mila web home"><i>m</i><span>mila</span></button>
        <nav aria-label="Mila web navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} aria-current={activeTab === item.id ? "page" : undefined} onClick={() => setActiveTab(item.id)}><Icon /><span>{item.label}</span>{item.id === "messages" && <em>2</em>}</button>;
          })}
        </nav>
        <div className="web-account"><span className="web-avatar">A</span><span><b>Arjun</b><small>Profile 84% complete</small></span><Settings2 /></div>
      </aside>

      <section className="web-workspace">
        <header className="web-topbar">
          <div><p>Good evening, Arjun</p><h1>{activeTab === "discover" ? "Discover" : navItems.find((item) => item.id === activeTab)?.label}</h1></div>
          <label className="web-search"><Search /><input aria-label="Search interests or places" placeholder="Search interests or places" /></label>
          <button className="web-icon-button" aria-label="Voice assistant"><Mic /></button>
          <button className="web-icon-button" aria-label="Notifications"><Bell /><i /></button>
        </header>

        {activeTab === "discover" ? (
          <div className="web-discover-grid">
            <section className="web-feed" aria-label="Recommended profiles">
              <div className="web-filter-row"><div><button className="active">For you</button><button>Nearby</button><button>New here</button></div><button className="web-filter"><SlidersHorizontal /> Filters</button></div>
              <article className={`web-profile-photo web-photo-${profile.id}`}>
                <div className="web-photo-progress"><i className="active" /><i /><i /><i /></div>
                <span className="web-verified"><BadgeCheck /> Verified</span>
                <div className="web-photo-copy"><span>{profile.match}% match</span><h2>{profile.name}, {profile.age}</h2><p><MapPin /> {profile.city} · {profile.distance}</p></div>
              </article>
              <div className="web-primary-actions">
                <button className="web-pass" onClick={nextProfile} aria-label={`Pass ${profile.name}`}><X /></button>
                <button className={`web-favorite ${favorite ? "active" : ""}`} onClick={toggleFavorite} aria-pressed={favorite} aria-label={`${favorite ? "Remove" : "Save"} ${profile.name} favorite`}><Bookmark fill={favorite ? "currentColor" : "none"} /></button>
                <button className="web-intro" onClick={() => setIntroOpen(true)}><MilaConnectMark /> Connect</button>
                <button className={`web-like ${liked ? "active" : ""}`} onClick={likeProfile} disabled={liked} aria-label={liked ? `${profile.name} liked` : `Like ${profile.name}`}><Heart fill={liked ? "currentColor" : "none"} /></button>
              </div>
              {notice && <output className="web-notice"><Check /> {notice}</output>}
              <div className="web-next-row"><span>Up next</span><button onClick={nextProfile}>Next profile <ChevronRight /></button></div>
              <div className="web-mini-list">
                {profiles.map((person, index) => <button key={person.id} aria-label={`View ${person.name}, ${person.age}`} className={index === profileIndex ? "active" : ""} onClick={() => { setProfileIndex(index); setNotice(""); }}><span className={`web-mini-photo web-photo-${person.id}`} /><span><b>{person.name}, {person.age}</b><small>{person.match}% match · {person.distance}</small></span></button>)}
              </div>
            </section>

            <aside className="web-profile-details" aria-label={`${profile.name}'s profile details`}>
              <div className="web-detail-heading"><div><span>Why you may click</span><b>{profile.match}%</b><small>Shared goals, lifestyle, and communication</small></div><button aria-label="Profile safety"><ShieldCheck /></button></div>
              <section><span className="web-section-label">About</span><p>{profile.about}</p></section>
              <section><span className="web-section-label">Looking for</span><strong><Heart /> {profile.goal}</strong></section>
              <section className="web-facts"><div><BriefcaseBusiness /><span><small>Work</small><b>{profile.job}</b></span></div><div><GraduationCap /><span><small>Education</small><b>{profile.school}</b></span></div><div><MessageCircle /><span><small>Languages</small><b>{profile.languages}</b></span></div></section>
              <section><span className="web-section-label">Interests</span><div className="web-tags">{profile.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>
              <section className="web-prompt"><span>The quickest way to my heart is…</span><blockquote>Good conversation, a neighborhood walk, and remembering the little things.</blockquote></section>
            </aside>
          </div>
        ) : (
          <section className="web-placeholder">
            {activeTab === "likes" ? <Heart /> : activeTab === "messages" ? <MessageCircle /> : <UserRound />}
            <h2>{activeTab === "likes" ? `${likedIds.length} profile${likedIds.length === 1 ? "" : "s"} liked` : activeTab === "messages" ? "Your conversations" : "Your Mila profile"}</h2>
            <p>{activeTab === "likes" ? "Profiles you like remain here during this session." : activeTab === "messages" ? "Chat opens after a mutual match or accepted introduction." : "Add photos, prompts, preferences, and verification before your private beta."}</p>
            <Button onClick={() => setActiveTab("discover")}>Return to Discover</Button>
          </section>
        )}
      </section>

      <nav className="web-mobile-nav" aria-label="Mila mobile web navigation">
        {navItems.map((item) => { const Icon = item.icon; return <button key={item.id} aria-current={activeTab === item.id ? "page" : undefined} onClick={() => setActiveTab(item.id)}><Icon /><span>{item.label}</span></button>; })}
      </nav>

      <Dialog open={introOpen} onOpenChange={setIntroOpen}>
        <DialogContent className="web-intro-dialog">
          <DialogHeader><DialogTitle>Meet {profile.name} with an introduction</DialogTitle><DialogDescription>Introductions are included with Mila Plus and appear with your profile before a match.</DialogDescription></DialogHeader>
          <div className={`web-dialog-person web-photo-${profile.id}`}><span><b>{profile.name}, {profile.age}</b><small>{profile.job} · {profile.city}</small></span></div>
          <div className="web-dialog-benefits"><p><Check /> Add a personal message</p><p><Check /> {profile.name} can review your full profile</p><p><ShieldCheck /> Block and report remain free</p></div>
          <DialogFooter className="web-dialog-footer"><DialogClose render={<Button variant="outline" />}>Not now</DialogClose><Button onClick={() => { setIntroOpen(false); setNotice("Choose a Mila Plus plan to send this introduction."); }}><Crown /> View Mila Plus</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
