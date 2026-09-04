"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Bookmark,
  Bot,
  BriefcaseBusiness,
  CakeSlice,
  CalendarHeart,
  Check,
  ChevronDown,
  Compass,
  EyeOff,
  Flag,
  Globe2,
  GraduationCap,
  Heart,
  Languages,
  LocateFixed,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Play,
  RotateCcw,
  Ruler,
  Save,
  Search,
  Send,
  Settings2,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const themes = [
  { id: "sunrise", name: "Sunrise", note: "Warm & human", color: "#ef6547" },
  { id: "bloom", name: "Bloom", note: "Playful & social", color: "#8e5bdb" },
  {
    id: "midnight",
    name: "Midnight",
    note: "Premium & cinematic",
    color: "#7be4cb",
  },
  { id: "paper", name: "Paper", note: "Minimal & direct", color: "#d6ff4b" },
] as const;
type Theme = (typeof themes)[number]["id"];
type Tab = "discover" | "explore" | "likes" | "chats" | "you";
type Platform = "ios" | "android";
type DemoProfile = {
  id: "maya" | "arjun";
  name: string;
  age: number;
  job: string;
  city: string;
  distance: number;
  languages: string[];
  tags: string[];
  about: string;
  prompt: string;
};

const demoProfiles: Record<DemoProfile["id"], DemoProfile> = {
  maya: {
    id: "maya",
    name: "Maya",
    age: 29,
    job: "Product designer",
    city: "Brooklyn",
    distance: 3,
    languages: ["English", "Gujarati"],
    tags: ["Indie films", "Family-minded"],
    about: "Product designer, amateur film photographer and a firm believer that the best weekends begin without an itinerary.",
    prompt: "I make excellent dosa, know every indie cinema in Brooklyn, and think window seats are overrated.",
  },
  arjun: {
    id: "arjun",
    name: "Arjun",
    age: 31,
    job: "Climate-tech engineer",
    city: "Brooklyn",
    distance: 4,
    languages: ["English", "Hindi"],
    tags: ["Weekend hikes", "Home cooking"],
    about: "Climate-tech engineer, weekend trail hunter and enthusiastic host of small dinner parties with very ambitious menus.",
    prompt: "I can fix a bike, make a memorable biryani, and will always choose the scenic route.",
  },
};

const interestOptions = [
  "Travel",
  "Live music",
  "Cooking",
  "Fitness",
  "Films",
  "Books",
  "Art",
  "Hiking",
];
function zodiacFor(date: string) {
  const [, monthText, dayText] = date.split("-");
  const month = Number(monthText),
    day = Number(dayText);
  const edge = [20, 19, 20, 20, 21, 21, 22, 22, 22, 22, 21, 21];
  const signs = [
    "Capricorn",
    "Aquarius",
    "Pisces",
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
  ];
  return signs[month - (day < edge[month - 1] ? 1 : 0)] || "—";
}
const zodiacSymbol: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

const navigation = [
  { id: "discover", label: "Discover", icon: Sparkles },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "likes", label: "Likes", icon: Heart },
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "you", label: "Profile", icon: UserRound },
] as const;

const featureGroups = [
  {
    label: "Core experience",
    timing: "MVP",
    features: [
      ["Swipe discovery", "Like, pass, undo and priority introduction.", Heart],
      [
        "Mutual-match chat",
        "Messaging opens only after both people accept.",
        MessageCircle,
      ],
      [
        "Explore by intention",
        "Serious, new in town, travel, culture and more.",
        Compass,
      ],
      [
        "Likes & controls",
        "Preferences, privacy, notifications and pause.",
        Settings2,
      ],
    ],
  },
  {
    label: "Mila intelligence",
    timing: "MVP +",
    features: [
      [
        "Explain my match",
        "Reasons based on goals, habits and values.",
        Sparkles,
      ],
      [
        "Profile Studio",
        "Photo and prompt coaching—never auto-published.",
        WandSparkles,
      ],
      [
        "Conversation Copilot",
        "Openers, tone help and translation with approval.",
        Bot,
      ],
      [
        "Dating bandwidth",
        "Choose how many active introductions feel right.",
        CalendarHeart,
      ],
    ],
  },
  {
    label: "Trust & worldwide",
    timing: "MVP",
    features: [
      [
        "Verification & safety",
        "Liveness checks, scam signals and reporting.",
        ShieldCheck,
      ],
      [
        "Language bridge",
        "Translate while preserving personality and tone.",
        Languages,
      ],
      [
        "Global identity",
        "City, roots, languages and relocation—each optional.",
        Globe2,
      ],
      [
        "Safe date planning",
        "Public places, trusted contacts and check-ins.",
        UsersRound,
      ],
    ],
  },
] as const;

function MobileScreen({
  platform,
  viewerName,
  profile,
  matched,
  targetLikedYou,
  activeTab,
  onTab,
  theme,
  onTheme,
  decision,
  onDecision,
  showReason,
  onReason,
  profileOpen,
  onProfileOpen,
  safetyOpen,
  onSafetyOpen,
  blocked,
  onBlocked,
  hidden,
  onHidden,
  mediaIndex,
  onMediaIndex,
  radius,
  onRadius,
}: {
  platform: Platform;
  viewerName: string;
  profile: DemoProfile;
  matched: boolean;
  targetLikedYou: boolean;
  activeTab: Tab;
  onTab: (tab: Tab) => void;
  theme: Theme;
  onTheme: (theme: Theme) => void;
  decision: "idle" | "liked" | "passed" | "intro";
  onDecision: (value: "idle" | "liked" | "passed" | "intro") => void;
  showReason: boolean;
  onReason: () => void;
  profileOpen: boolean;
  onProfileOpen: (value: boolean) => void;
  safetyOpen: boolean;
  onSafetyOpen: (value: boolean) => void;
  blocked: boolean;
  onBlocked: (value: boolean) => void;
  hidden: boolean;
  onHidden: (value: boolean) => void;
  mediaIndex: number;
  onMediaIndex: (value: number) => void;
  radius: number;
  onRadius: (value: number) => void;
}) {
  const dragStart = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [likesView, setLikesView] = useState<
    "incoming" | "sent" | "favorites"
  >("incoming");
  const [mayaFavorite, setMayaFavorite] = useState(true);
  const [birthDate, setBirthDate] = useState("1994-10-08");
  const [gender, setGender] = useState("Non-binary");
  const [showGender, setShowGender] = useState(true);
  const [height, setHeight] = useState("170");
  const [about, setAbout] = useState(
    "Curious by nature, happiest around good food, live music and thoughtful conversation.",
  );
  const [workTitle, setWorkTitle] = useState("Product designer");
  const [education, setEducation] = useState("Bachelor’s degree");
  const [schoolName, setSchoolName] = useState("Parsons School of Design");
  const [interests, setInterests] = useState(["Travel", "Films", "Cooking"]);
  const [astrology, setAstrology] = useState(true);
  const [saved, setSaved] = useState(false);
  const zodiac = zodiacFor(birthDate);
  const completeness = Math.min(
    100,
    52 +
      interests.length * 4 +
      (height ? 4 : 0) +
      (showGender ? 4 : 0) +
      (birthDate ? 4 : 0) +
      (about.trim() ? 8 : 0) +
      (workTitle.trim() ? 5 : 0) +
      (education ? 5 : 0) +
      (schoolName.trim() ? 6 : 0),
  );
  const toggleInterest = (item: string) =>
    setInterests((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : current.length < 5
          ? [...current, item]
          : current,
    );
  const finishSwipe = () => {
    if (dragX > 58) onDecision("liked");
    else if (dragX < -58) onDecision("passed");
    setDragX(0);
    dragStart.current = null;
  };
  const cycleRadius = () =>
    onRadius(radius === 5 ? 10 : radius === 10 ? 25 : 5);
  const shareProfile = () => {
    setProfileNotice(`${profile.name}’s profile link is ready to share`);
    onSafetyOpen(false);
  };
  const reportProfile = () => {
    setProfileNotice(`Report options opened — ${profile.name} is not notified`);
    onSafetyOpen(false);
  };
  const blockProfile = () => {
    onBlocked(true);
    onProfileOpen(false);
    onSafetyOpen(false);
  };
  return (
    <div className={`device-column ${platform}`}>
    <div className="device-caption">
      <span>{viewerName}’s view</span>
      <small>
        {platform === "ios" ? "iPhone · viewing Maya" : "Android · viewing Arjun"}
      </small>
      </div>
      <div className={`phone-frame compare-phone ${platform}`}>
        <div className="phone-top">
          <span>{platform === "ios" ? "9:41" : "10:10"}</span>
          <i />
          <div>
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="phone-screen">
          <div className="app-head">
            <span className="phone-brand">
              <i>m</i> mila
            </span>
            <button aria-label="Search">
              <Search />
            </button>
            <button aria-label="Settings">
              <Settings2 />
            </button>
          </div>
          <div className="screen-content">
            {activeTab === "discover" && (
              <div className="discover-screen">
                <div className="discovery-title">
                  <span>
                    <LocateFixed /> Nearby · 12 profiles
                  </span>
                  <button onClick={cycleRadius}>
                    Within {radius} mi <ChevronDown />
                  </button>
                </div>
                {blocked ? (
                  <div className="blocked-state">
                    <span>
                      <Ban />
                    </span>
                    <h3>{profile.name} is blocked</h3>
                    <p>You will not see each other or be able to message.</p>
                    <button onClick={() => onBlocked(false)}>Undo block</button>
                  </div>
                ) : (
                  <>
                  <article
                      className={`profile-card card-${decision} ${dragX !== 0 ? "is-dragging" : ""}`}
                      style={
                        dragX
                          ? {
                              transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)`,
                            }
                          : undefined
                      }
                      onPointerDown={(e) => {
                        if ((e.target as HTMLElement).closest("button")) return;
                        dragStart.current = e.clientX;
                        e.currentTarget.setPointerCapture(e.pointerId);
                      }}
                      onPointerMove={(e) => {
                        if (dragStart.current !== null)
                          setDragX(e.clientX - dragStart.current);
                      }}
                      onPointerUp={finishSwipe}
                      onPointerCancel={finishSwipe}
                    >
                    <div className={`profile-image profile-${profile.id} media-${mediaIndex}`}>
                        <div className="story-dots">
                          {[0, 1, 2, 3].map((i) => (
                            <i
                              key={i}
                              className={mediaIndex === i ? "active" : ""}
                            />
                          ))}
                        </div>
                        <span className="verified-pill">
                          <BadgeCheck /> Verified
                        </span>
                        {mediaIndex === 3 && (
                          <span className="video-pill">
                            <Play /> Video · 0:12
                          </span>
                        )}
                        {decision !== "idle" && (
                          <div className="decision-stamp">
                            {decision === "passed"
                              ? "Maybe later"
                              : decision === "intro"
                                ? "Intro sent"
                                : "Liked"}
                          </div>
                        )}
                        <button
                          className="media-prev"
                          onClick={() => onMediaIndex((mediaIndex + 3) % 4)}
                          aria-label="Previous photo"
                        />
                        <button
                          className="media-next"
                          onClick={() => onMediaIndex((mediaIndex + 1) % 4)}
                          aria-label="Next photo"
                        />
                        <div className="profile-gradient" />
                        <div className="profile-details">
                          <div className="name-line">
                            <h2>{profile.name}, {profile.age}</h2>
                            <BadgeCheck />
                          </div>
                          <p>
                            <BriefcaseBusiness /> {profile.job}
                          </p>
                          <p>
                            <MapPin /> {profile.city} · {profile.distance} miles away
                          </p>
                          <div className="profile-tags">
                            <span>Long-term</span>
                            <span>{profile.tags[0]}</span>
                            <span>{profile.languages.join(" + ")}</span>
                          </div>
                          <button
                            className="view-profile"
                            onClick={() => onProfileOpen(true)}
                          >
                      Get to know {profile.name} <ChevronDown />
                          </button>
                        </div>
                      </div>
                      <button className="match-reason" onClick={onReason}>
                        <span>
                          <Sparkles />
                          <b>Why Mila picked {profile.name}</b>
                        </span>
                        <ChevronDown />
                      </button>
                      {showReason && (
                        <div className="reason-panel">
                          <span>
                            <Check /> Same relationship goal
                          </span>
                          <span>
                            <Check /> Similar social energy
                          </span>
                          <span>
                            <Check /> Both open to relocating
                          </span>
                        </div>
                      )}
                    </article>
                    <div className="swipe-actions">
                      <button
                        aria-label="Pass"
                        onClick={() => onDecision("passed")}
                      >
                        <X />
                      </button>
                      <button
                        aria-label="Undo"
                        onClick={() => onDecision("idle")}
                      >
                        <RotateCcw />
                      </button>
                      <button
                        className="priority"
                        aria-label="Meaningful intro"
                        onClick={() => onDecision("intro")}
                      >
                        <Star />
                      </button>
                      <button
                        className="like"
                        aria-label="Like"
                        onClick={() => onDecision("liked")}
                      >
                        <Heart />
                      </button>
                    </div>
                    <div className="swipe-hint">
                      <span>Pass</span>
                      <span>Meaningful intro</span>
                      <span>Like</span>
                    </div>
                  </>
                )}
                {matched && (
                  <div className="match-moment">
                    <span className={`match-photo profile-${profile.id}`} />
                    <Sparkles />
                    <h3>It’s a match!</h3>
                    <p>{viewerName} and {profile.name} liked each other. Chat is now open.</p>
                    <button onClick={() => onTab("chats")}>
                      Say hello <MessageCircle />
                    </button>
                  </div>
                )}
              </div>
            )}
            {activeTab === "explore" && (
              <div className="inner-screen">
                <span className="screen-kicker">Explore</span>
                <h2>Date with intention.</h2>
                <p>Choose a space that matches what you want today.</p>
                <div className="explore-grid">
                  <button className="wide">
                    <Heart />
                    <span>
                      <b>Ready for real</b>
                      <small>Long-term connections</small>
                    </span>
                  </button>
                  <button>
                    <MapPin />
                    <span>
                      <b>New in town</b>
                      <small>Meet nearby</small>
                    </span>
                  </button>
                  <button>
                    <Globe2 />
                    <span>
                      <b>Across borders</b>
                      <small>Open to distance</small>
                    </span>
                  </button>
                  <button>
                    <Zap />
                    <span>
                      <b>Free tonight</b>
                      <small>Spontaneous plans</small>
                    </span>
                  </button>
                  <button>
                    <UsersRound />
                    <span>
                      <b>Culture & roots</b>
                      <small>Share your world</small>
                    </span>
                  </button>
                </div>
              </div>
            )}
            {activeTab === "likes" && (
              <div className="inner-screen likes-screen">
                <span className="screen-kicker">Connections</span>
                <h2>Your likes, clearly.</h2>
                <p>See incoming likes, likes you sent, and private favorites.</p>
                <div className="likes-tabs" aria-label="Likes views">
                  <button
                    onClick={() => setLikesView("incoming")}
                    aria-pressed={likesView === "incoming"}
                  >
                    Liked you <i>{targetLikedYou ? 4 : 3}</i>
                  </button>
                  <button
                    onClick={() => setLikesView("sent")}
                    aria-pressed={likesView === "sent"}
                  >
                    You liked <i>{decision === "liked" ? 2 : 1}</i>
                  </button>
                  <button
                    onClick={() => setLikesView("favorites")}
                    aria-pressed={likesView === "favorites"}
                  >
                    Favorites <i>{mayaFavorite ? 1 : 0}</i>
                  </button>
                </div>
                {likesView === "incoming" && (
                  <div className="likes-list">
                    {targetLikedYou && (
                      <button className="like-person incoming-target">
                        <span className={`like-avatar target-mini profile-${profile.id}`}>{profile.name[0]}</span>
                        <span>
                          <b>{profile.name}, {profile.age}</b>
                          <small>{matched ? "It’s a match — chat is open" : "Liked you just now"}</small>
                        </span>
                        <em>{matched ? "Matched" : "New"}</em>
                      </button>
                    )}
                    {[
                      ["P", "Priya, 31", "Queens · 6 mi", "New"],
                      ["D", "Daniel, 30", "Manhattan · 4 mi", "Today"],
                      ["E", "Elena, 28", "Jersey City · 8 mi", "Yesterday"],
                    ].map(([initial, name, meta, time], index) => (
                      <button className="like-person" key={name}>
                        <span className={`like-avatar tone-${index}`}>{initial}</span>
                        <span>
                          <b>{name}</b>
                          <small>{meta}</small>
                        </span>
                        <em>{time}</em>
                      </button>
                    ))}
                    <small className="likes-note">
                      Like someone back to create a match and start chatting.
                    </small>
                  </div>
                )}
                {likesView === "sent" && (
                  <div className="likes-list">
                    {decision === "liked" && (
                      <div className="like-person">
                        <span className={`like-avatar target-mini profile-${profile.id}`}>{profile.name[0]}</span>
                        <span>
                          <b>{profile.name}, {profile.age}</b>
                          <small>Liked just now · Awaiting response</small>
                        </span>
                        <button
                          className="save-person"
                          onClick={() => setMayaFavorite(!mayaFavorite)}
                          aria-label={mayaFavorite ? `Remove ${profile.name} from favorites` : `Save ${profile.name} to favorites`}
                        >
                          <Bookmark fill={mayaFavorite ? "currentColor" : "none"} />
                        </button>
                      </div>
                    )}
                    <div className="like-person">
                      <span className="like-avatar tone-1">J</span>
                      <span>
                        <b>Jordan, 32</b>
                        <small>Liked yesterday · Awaiting response</small>
                      </span>
                      <button className="save-person" aria-label="Save Jordan to favorites">
                        <Bookmark />
                      </button>
                    </div>
                    <small className="likes-note">
                      Sent likes can become chats only when the other person likes you back.
                    </small>
                  </div>
                )}
                {likesView === "favorites" && (
                  <div className="likes-list">
                    {mayaFavorite ? (
                      <div className="like-person">
                        <span className={`like-avatar target-mini profile-${profile.id}`}>{profile.name[0]}</span>
                        <span>
                          <b>{profile.name}, {profile.age}</b>
                          <small>Saved privately · {profile.city}</small>
                        </span>
                        <button
                          className="save-person"
                          onClick={() => setMayaFavorite(false)}
                          aria-label={`Remove ${profile.name} from favorites`}
                        >
                          <Bookmark fill="currentColor" />
                        </button>
                      </div>
                    ) : (
                      <div className="likes-empty">
                        <Bookmark />
                        <b>No favorites yet</b>
                        <small>Save profiles you want to revisit. They will not be notified.</small>
                      </div>
                    )}
                    <small className="likes-note">
                      Favorites are visible only to you and do not send a like.
                    </small>
                  </div>
                )}
              </div>
            )}
            {activeTab === "chats" && (
              <div className="inner-screen">
                <span className="screen-kicker">Messages</span>
                <h2>Good conversations.</h2>
                <div className="new-matches">
                  <span className={`mini-avatar target-mini profile-${profile.id}`}>{profile.name[0]}</span>
                  <span className="mini-avatar alt">A</span>
                  <button>
                    <Heart /> New match
                  </button>
                </div>
                {matched ? (
                  <div className="chat-row new-match-chat">
                    <span className={`chat-avatar target-mini profile-${profile.id}`}>{profile.name[0]}</span>
                    <div>
                      <b>
                        {profile.name} <BadgeCheck />
                      </b>
                      <small>You matched — say hello!</small>
                    </div>
                    <time>Now</time>
                  </div>
                ) : (
                  <div className="chat-lock">
                    <Heart />
                    <span><b>Your new chat will appear here</b><small>Both people must like each other first.</small></span>
                  </div>
                )}
                <div className="chat-row">
                  <span className="chat-avatar blue">A</span>
                  <div>
                    <b>Alex</b>
                    <small>You: How was Lisbon?</small>
                  </div>
                  <time>1h</time>
                </div>
                <div className="copilot-card">
                  <Bot />
                  <div>
                    <b>Conversation Copilot</b>
                    <span>
                      Ask Mila for an opener based on shared interests.
                    </span>
                  </div>
                  <button aria-label="Try copilot">
                    <Send />
                  </button>
                </div>
              </div>
            )}
            {activeTab === "you" && (
              <div className="inner-screen you-screen">
                <span className="screen-kicker">Your Mila</span>
                <h2>Make it feel like you.</h2>
                <p>Control your profile, privacy and appearance.</p>
                <div className="profile-summary">
                  <div className="you-avatar">S</div>
                  <span>
                    <b>Your profile</b>
                    <small>{completeness}% complete · Verified</small>
                  </span>
                  <button onClick={() => setEditorOpen(true)}>Edit</button>
                </div>
                <div
                  className={`hide-profile-card ${hidden ? "is-hidden" : ""}`}
                >
                  <EyeOff />
                  <span>
                    <b>Hide my profile</b>
                    <small>
                      {hidden
                        ? "Hidden from new people. Matches can still chat."
                        : "Stop appearing in Discover without losing matches."}
                    </small>
                  </span>
                  <Switch
                    size="sm"
                    checked={hidden}
                    onCheckedChange={onHidden}
                    aria-label="Hide my profile"
                  />
                </div>
                <h3>Appearance</h3>
                <div className="in-app-themes">
                  {themes.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onTheme(item.id)}
                      aria-pressed={theme === item.id}
                    >
                      <i style={{ background: item.color }} />
                      {item.name}
                      {theme === item.id && <Check />}
                    </button>
                  ))}
                </div>
                <div className="setting-row">
                  <Languages />
                  <span>
                    <b>Languages</b>
                    <small>English + 2 more</small>
                  </span>
                  <ChevronDown />
                </div>
                <div className="setting-row">
                  <ShieldCheck />
                  <span>
                    <b>Safety center</b>
                    <small>Verification and privacy</small>
                  </span>
                  <ChevronDown />
                </div>
              </div>
            )}
          </div>
          {profileOpen && (
            <section className="full-profile">
              <div className={`full-profile-hero profile-${profile.id} media-${mediaIndex}`}>
                <button
                  className="profile-back"
                  onClick={() => {
                    onProfileOpen(false);
                    onSafetyOpen(false);
                  }}
                  aria-label="Back"
                >
                  <ArrowLeft />
                </button>
                <button
                  className="profile-more"
                  onClick={() => onSafetyOpen(!safetyOpen)}
                  aria-label="Safety options"
                >
                  <MoreHorizontal />
                </button>
                {safetyOpen && (
                  <div className="safety-menu">
                    <button onClick={shareProfile}>
                      <Share2 /> Share profile
                    </button>
                    <button onClick={blockProfile}>
                      <Ban /> Block {profile.name}
                    </button>
                    <button onClick={reportProfile}>
                      <Flag /> Report profile
                    </button>
                    <button onClick={() => onSafetyOpen(false)}>Cancel</button>
                  </div>
                )}
                <button
                  className="full-media-prev"
                  onClick={() => {
                    onMediaIndex((mediaIndex + 3) % 4);
                    setVideoPlaying(false);
                  }}
                  aria-label="Previous media"
                >
                  <ArrowLeft />
                </button>
                <button
                  className="full-media-next"
                  onClick={() => {
                    onMediaIndex((mediaIndex + 1) % 4);
                    setVideoPlaying(false);
                  }}
                  aria-label="Next media"
                >
                  <ArrowLeft />
                </button>
                {mediaIndex === 3 && (
                  <button
                    className={`full-video ${videoPlaying ? "is-playing" : ""}`}
                    onClick={() => setVideoPlaying(!videoPlaying)}
                  >
                    <Play />
                    {videoPlaying ? "Playing · 0:08 / 0:12" : "Play video prompt"}
                  </button>
                )}
                <span className="media-count">
                  {mediaIndex === 3 ? "Video" : `Photo ${mediaIndex + 1}`} · {mediaIndex + 1}/4
                </span>
                <div className="profile-gradient" />
                <div className="full-name">
                  <h2>{profile.name}, {profile.age}</h2>
                  <BadgeCheck />
                  <p>
                    <MapPin /> {profile.city} · {profile.distance} miles away
                  </p>
                </div>
              </div>
              <div className="media-thumbs" aria-label="All photos and video">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className={`profile-${profile.id} media-${i} ${mediaIndex === i ? "active" : ""}`}
                    onClick={() => {
                      onMediaIndex(i);
                      setVideoPlaying(false);
                    }}
                    aria-label={i === 3 ? "Video prompt" : `Photo ${i + 1}`}
                  >
                    {i === 3 && <Play />}
                  </button>
                ))}
              </div>
              {profileNotice && (
                <div className="profile-notice" role="status">
                  <Check /> {profileNotice}
                </div>
              )}
              <div className="full-profile-copy">
                <div className="profile-intent-row">
                  <span className="intent-pill">
                    <Heart /> Looking for a long-term relationship
                  </span>
                  <button
                    className="favorite-toggle"
                    onClick={() => setMayaFavorite(!mayaFavorite)}
                    aria-pressed={mayaFavorite}
                  >
                    <Bookmark fill={mayaFavorite ? "currentColor" : "none"} />
                    {mayaFavorite ? "Saved" : "Favorite"}
                  </button>
                </div>
                <h3>About {profile.name}</h3>
                <p>{profile.about}</p>
                <h3>Two truths and a tiny hill</h3>
                <blockquote>
                  “{profile.prompt}”
                </blockquote>
                <h3>Languages & life</h3>
                <div className="full-tags">
                  {profile.languages.map(language => <span key={language}>{language}</span>)}
                  <span>Open to relocate</span>
                  <span>Family-minded</span>
                </div>
              </div>
              <div className="profile-safety-actions">
                <button onClick={shareProfile}>
                  <Share2 /> Share
                </button>
                <button onClick={blockProfile}>
                  <Ban /> Block
                </button>
                <button onClick={reportProfile}>
                  <Flag /> Report
                </button>
              </div>
              <div className="full-actions">
                <button onClick={() => onProfileOpen(false)}>
                  <X /> Pass
                </button>
                <button
                  onClick={() => {
                    onDecision("liked");
                    onProfileOpen(false);
                  }}
                >
                  <Heart /> Like {profile.name}
                </button>
              </div>
            </section>
          )}
          {editorOpen && (
            <section className="profile-builder">
              <header>
                <button
                  onClick={() => setEditorOpen(false)}
                  aria-label="Back to profile"
                >
                  <ArrowLeft />
                </button>
                <span>
                  <b>Edit profile</b>
                  <small>
                    {saved
                      ? "Changes saved"
                      : "Visible details are your choice"}
                  </small>
                </span>
                <button
                  className="save-profile"
                  onClick={() => {
                    setSaved(true);
                    setTimeout(() => setEditorOpen(false), 650);
                  }}
                >
                  <Save /> Save
                </button>
              </header>
              <div className="builder-scroll">
                <div className="completion-card">
                  <div>
                    <strong>{completeness}%</strong>
                    <span>Profile complete</span>
                  </div>
                  <i>
                    <b style={{ width: `${completeness}%` }} />
                  </i>
                  <p>
                    Add authentic details to improve introductions. Optional
                    fields never block your profile.
                  </p>
                </div>
                <div className="builder-section">
                  <h3>Identity</h3>
                  <label>
                    <span>
                      <UserRound /> Gender identity{" "}
                      <small>Used for matching</small>
                    </span>
                    <NativeSelect
                      size="sm"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <NativeSelectOption>Woman</NativeSelectOption>
                      <NativeSelectOption>Man</NativeSelectOption>
                      <NativeSelectOption>Non-binary</NativeSelectOption>
                      <NativeSelectOption>Self-described</NativeSelectOption>
                    </NativeSelect>
                  </label>
                  <div className="visibility-row">
                    <span>Show “{gender}” on my profile</span>
                    <Switch
                      size="sm"
                      checked={showGender}
                      onCheckedChange={setShowGender}
                    />
                  </div>
                </div>
                <div className="builder-section story-section">
                  <h3>
                    Your story <small>{about.length}/300</small>
                  </h3>
                  <label className="about-field">
                    <span>
                      <UserRound /> About me
                      <small>A quick introduction in your own words</small>
                    </span>
                    <textarea
                      value={about}
                      maxLength={300}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="What should someone know about you?"
                    />
                  </label>
                </div>
                <div className="builder-section">
                  <h3>Work &amp; education</h3>
                  <label>
                    <span>
                      <BriefcaseBusiness /> Work title <small>Optional</small>
                    </span>
                    <Input
                      value={workTitle}
                      maxLength={60}
                      onChange={(e) => setWorkTitle(e.target.value)}
                      placeholder="e.g. Product designer"
                    />
                  </label>
                  <label>
                    <span>
                      <GraduationCap /> Education <small>Optional</small>
                    </span>
                    <NativeSelect
                      size="sm"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                    >
                      <NativeSelectOption value="">Prefer not to say</NativeSelectOption>
                      <NativeSelectOption>High school</NativeSelectOption>
                      <NativeSelectOption>Trade school</NativeSelectOption>
                      <NativeSelectOption>Associate degree</NativeSelectOption>
                      <NativeSelectOption>Bachelor’s degree</NativeSelectOption>
                      <NativeSelectOption>Master’s degree</NativeSelectOption>
                      <NativeSelectOption>Doctorate</NativeSelectOption>
                    </NativeSelect>
                  </label>
                  <label>
                    <span>
                      <GraduationCap /> School name <small>Optional</small>
                    </span>
                    <Input
                      value={schoolName}
                      maxLength={80}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="College or university"
                    />
                  </label>
                </div>
                <div className="builder-section">
                  <h3>About you</h3>
                  <label>
                    <span>
                      <Ruler /> Height <small>Optional</small>
                    </span>
                    <div className="unit-input">
                      <Input
                        type="number"
                        min="120"
                        max="230"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                      <b>cm</b>
                    </div>
                  </label>
                  <label>
                    <span>
                      <CakeSlice /> Date of birth <small>Always private</small>
                    </span>
                    <Input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </label>
                  <div className="zodiac-result">
                    <span>{zodiacSymbol[zodiac]}</span>
                    <div>
                      <b>{zodiac}</b>
                      <small>
                        Calculated automatically · Choose whether to display
                      </small>
                    </div>
                    <Switch
                      size="sm"
                      checked={astrology}
                      onCheckedChange={setAstrology}
                    />
                  </div>
                </div>
                <div className="builder-section">
                  <h3>
                    Interests <small>{interests.length}/5 selected</small>
                  </h3>
                  <div className="interest-cloud">
                    {interestOptions.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleInterest(item)}
                        aria-pressed={interests.includes(item)}
                      >
                        {interests.includes(item) && <Check />}
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="astrology-card">
                  <div>
                    <Sparkles />
                    <span>
                      <b>Astrology mode</b>
                      <small>
                        Fun context, never a scientific match score.
                      </small>
                    </span>
                    <Switch
                      size="sm"
                      checked={astrology}
                      onCheckedChange={setAstrology}
                    />
                  </div>
                  {astrology && (
                    <p>
                      <strong>
                        {zodiac} {zodiacSymbol[zodiac]} + Libra ♎
                      </strong>
                      {zodiac === "Libra"
                        ? "Balanced mirror—similar social energy and communication style."
                        : "Curious connection—different rhythms can create good conversation."}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
          <nav className="bottom-nav" aria-label={`${platform} preview pages`}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTab(item.id)}
                  aria-current={activeTab === item.id ? "page" : undefined}
                >
                  <Icon />
                  <span>{item.label}</span>
                  {item.id === "chats" && <i>2</i>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="home-indicator" />
      </div>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("sunrise");
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [decisionIos, setDecisionIos] = useState<
    "idle" | "liked" | "passed" | "intro"
  >("idle");
  const [decisionAndroid, setDecisionAndroid] = useState<
    "idle" | "liked" | "passed" | "intro"
  >("idle");
  const [showReason, setShowReason] = useState(false);
  const [profileOpenIos, setProfileOpenIos] = useState(false);
  const [profileOpenAndroid, setProfileOpenAndroid] = useState(false);
  const [safetyOpenIos, setSafetyOpenIos] = useState(false);
  const [safetyOpenAndroid, setSafetyOpenAndroid] = useState(false);
  const [blockedIos, setBlockedIos] = useState(false);
  const [blockedAndroid, setBlockedAndroid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mediaIndexIos, setMediaIndexIos] = useState(0);
  const [mediaIndexAndroid, setMediaIndexAndroid] = useState(0);
  const [radius, setRadius] = useState(5);
  const matched = decisionIos === "liked" && decisionAndroid === "liked";
  const sharedPreview = {
    activeTab,
    onTab: setActiveTab,
    theme,
    onTheme: setTheme,
    showReason,
    onReason: () => setShowReason(!showReason),
    hidden,
    onHidden: setHidden,
    radius,
    onRadius: setRadius,
  };
  return (
    <main className={`preview-shell theme-${theme}`}>
      <header className="preview-header">
        <a className="mila-brand" href="#preview">
          <span className="mila-mark">m</span>
          <span>mila</span>
        </a>
        <div className="preview-label">
          <span /> iOS + Android product preview
        </div>
        <Button
          className="feature-link"
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Feature plan <ChevronDown />
        </Button>
      </header>
      <section className="compare-stage" id="preview">
        <div className="compare-heading">
          <span className="section-kicker">
            <Globe2 /> Worldwide dating, made personal
          </span>
          <h1>
            Discover people
            <br />
            <em>near your life.</em>
          </h1>
          <p>
            Arjun sees Maya on iPhone while Maya sees Arjun on Android. Like
            each profile independently to create a mutual match and unlock
            chat on both phones.
          </p>
        </div>
        <div className="preview-controls">
          <div className="control-group">
            <span>Preview page</span>
            <div className="page-tabs">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    aria-pressed={activeTab === item.id}
                  >
                    <Icon />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="control-group">
            <span>
              <Palette /> Theme
            </span>
            <div className="compact-themes">
              {themes.map((item) => (
                <button
                  key={item.id}
                  title={item.note}
                  onClick={() => setTheme(item.id)}
                  aria-label={`${item.name} theme`}
                  aria-pressed={theme === item.id}
                >
                  <i style={{ background: item.color }} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="device-grid">
          <MobileScreen
            platform="ios"
            viewerName="Arjun"
            profile={demoProfiles.maya}
            decision={decisionIos}
            onDecision={setDecisionIos}
            matched={matched}
            targetLikedYou={decisionAndroid === "liked"}
            profileOpen={profileOpenIos}
            onProfileOpen={setProfileOpenIos}
            safetyOpen={safetyOpenIos}
            onSafetyOpen={setSafetyOpenIos}
            blocked={blockedIos}
            onBlocked={setBlockedIos}
            mediaIndex={mediaIndexIos}
            onMediaIndex={setMediaIndexIos}
            {...sharedPreview}
          />
          <MobileScreen
            platform="android"
            viewerName="Maya"
            profile={demoProfiles.arjun}
            decision={decisionAndroid}
            onDecision={setDecisionAndroid}
            matched={matched}
            targetLikedYou={decisionIos === "liked"}
            profileOpen={profileOpenAndroid}
            onProfileOpen={setProfileOpenAndroid}
            safetyOpen={safetyOpenAndroid}
            onSafetyOpen={setSafetyOpenAndroid}
            blocked={blockedAndroid}
            onBlocked={setBlockedAndroid}
            mediaIndex={mediaIndexAndroid}
            onMediaIndex={setMediaIndexAndroid}
            {...sharedPreview}
          />
        </div>
        <div className="platform-notes">
          <div>
            <strong>Step 1 · Arjun likes Maya</strong>
            <span>
              Tap the heart on the iPhone. Maya appears under Arjun’s “You
              liked” history while he waits.
            </span>
          </div>
          <div>
            <strong>Step 2 · Maya likes Arjun</strong>
            <span>
              Tap the heart on Android. Mila recognizes the mutual like and
              opens chat for both people.
            </span>
          </div>
        </div>
      </section>
      <section className="feature-plan" id="features">
        <div className="plan-heading">
          <span className="section-kicker">
            <Sparkles /> Proposed product scope
          </span>
          <h2>
            Everything Mila should do—
            <br />
            <em>in the right order.</em>
          </h2>
          <p>
            The first release creates a complete dating loop on both platforms.
            Advanced AI strengthens compatibility and confidence without
            replacing human judgment.
          </p>
        </div>
        <div className="feature-groups">
          {featureGroups.map((group) => (
            <article key={group.label} className="feature-group">
              <header>
                <span>{group.label}</span>
                <b>{group.timing}</b>
              </header>
              {group.features.map(([title, description, Icon]) => (
                <div className="feature-row" key={title as string}>
                  <i>
                    <Icon />
                  </i>
                  <span>
                    <strong>{title as string}</strong>
                    <small>{description as string}</small>
                  </span>
                  <Check />
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
      <section className="product-rules">
        <div>
          <span>01</span>
          <strong>Shared product system</strong>
          <p>
            Features and brand stay consistent while controls respect each
            platform.
          </p>
        </div>
        <div>
          <span>02</span>
          <strong>AI with permission</strong>
          <p>
            Every suggestion is visible, explainable and controlled by the
            member.
          </p>
        </div>
        <div>
          <span>03</span>
          <strong>Safety is free</strong>
          <p>
            Verification, blocking, reporting and essential protections never
            require payment.
          </p>
        </div>
      </section>
    </main>
  );
}
