"use client";

import { useEffect, useRef, useState } from "react";
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
  ChevronUp,
  Clock3,
  Compass,
  EyeOff,
  Eye,
  Flag,
  Globe2,
  GraduationCap,
  Heart,
  Languages,
  LocateFixed,
  MapPin,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Pencil,
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
  Volume2,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  id: "maya" | "arjun" | "priya" | "marcus" | "hana" | "leo";
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
type IntroRequest = {
  from: string;
  to: string;
  text: string;
  status: "pending" | "accepted" | "declined";
};
type ChatMessage = {
  id: string;
  sender: string;
  text: string;
};
type VoiceRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  abort: () => void;
  onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
  onerror: () => void;
  onend: () => void;
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
  priya: {
    id: "priya", name: "Priya", age: 31, job: "Healthcare strategist", city: "Queens", distance: 6,
    languages: ["English", "Tamil"], tags: ["Sunday markets", "Marriage-minded"],
    about: "Healthcare strategist who plans thoughtful trips, hosts lively brunches and always has a book recommendation.",
    prompt: "My ideal Sunday includes a farmers market, filter coffee and a long walk without checking the time.",
  },
  marcus: {
    id: "marcus", name: "Marcus", age: 32, job: "Architect", city: "Manhattan", distance: 4,
    languages: ["English", "French"], tags: ["Design", "Live jazz"],
    about: "Architect, amateur pianist and believer that a great neighborhood is best explored on foot.",
    prompt: "I will sketch the building, find the jazz bar and order dessert for the table.",
  },
  hana: {
    id: "hana", name: "Hana", age: 29, job: "Documentary producer", city: "Jersey City", distance: 8,
    languages: ["English", "Korean"], tags: ["Documentaries", "Waterfront walks"],
    about: "Documentary producer who loves quiet bookstores, waterfront walks and stories that change how we see people.",
    prompt: "Ask me about the tiny noodle shop I plan every trip around.",
  },
  leo: {
    id: "leo", name: "Leo", age: 31, job: "Literary editor", city: "Brooklyn", distance: 5,
    languages: ["English", "Spanish"], tags: ["Bookshops", "Home cooking"],
    about: "Literary editor, patient home cook and regular at independent bookshops around Brooklyn.",
    prompt: "I make a very good tortilla española and maintain an unnecessarily detailed reading list.",
  },
};

const discoveryProfiles: Record<Platform, DemoProfile[]> = {
  ios: [demoProfiles.maya, demoProfiles.priya, demoProfiles.hana],
  android: [demoProfiles.arjun, demoProfiles.marcus, demoProfiles.leo],
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
  { id: "discover", label: "Match", icon: Sparkles },
  { id: "explore", label: "Discover", icon: Compass },
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
        "Discover by intention",
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
  profile: initialProfile,
  matched,
  chatOpen,
  targetLikedYou,
  introRequest,
  onSendIntro,
  onAcceptIntro,
  onDeclineIntro,
  messages,
  onSendMessage,
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
  chatOpen: boolean;
  targetLikedYou: boolean;
  introRequest: IntroRequest | null;
  onSendIntro: (from: string, to: string, text: string) => void;
  onAcceptIntro: () => void;
  onDeclineIntro: () => void;
  messages: ChatMessage[];
  onSendMessage: (sender: string, text: string) => void;
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
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const suppressClick = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const [discoveryHistory, setDiscoveryHistory] = useState<number[]>([]);
  const [cardDecision, setCardDecision] = useState<"idle" | "liked" | "passed" | "intro">("idle");
  const [discoverNotice, setDiscoverNotice] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [introComposerOpen, setIntroComposerOpen] = useState(false);
  const [connectReview, setConnectReview] = useState(false);
  const [connectPage, setConnectPage] = useState(0);
  const connectTrackRef = useRef<HTMLDivElement | null>(null);
  const connectDragRef = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const [introMessage, setIntroMessage] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [selfPreviewOpen, setSelfPreviewOpen] = useState(false);
  const [selfMediaIndex, setSelfMediaIndex] = useState(0);
  const [editorSection, setEditorSection] = useState<
    "basics" | "story" | "work" | "lifestyle"
  >("basics");
  const [profileNotice, setProfileNotice] = useState("");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceStep, setVoiceStep] = useState<"matches" | "likes" | "profiles" | "messages" | "reply" | "done">("matches");
  const [voiceReply, setVoiceReply] = useState("");
  const [dictatingReply, setDictatingReply] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<VoiceRecognition | null>(null);
  useEffect(() => () => recognitionRef.current?.abort(), []);
  const [voiceResponse, setVoiceResponse] = useState(
    "Say “brief me” or choose a command below.",
  );
  const [briefScheduled, setBriefScheduled] = useState(false);
  const [briefTime, setBriefTime] = useState("9:00 PM");
  const [introDraft, setIntroDraft] = useState(false);
  const [introSent, setIntroSent] = useState(false);
  const [likesView, setLikesView] = useState<
    "incoming" | "sent" | "favorites"
  >("incoming");
  const [favoriteIds, setFavoriteIds] = useState<DemoProfile["id"][]>([
    initialProfile.id,
  ]);
  const [likedProfileIds, setLikedProfileIds] = useState<DemoProfile["id"][]>([]);
  const [likesLoaded, setLikesLoaded] = useState(false);
  const [calmMode, setCalmMode] = useState(false);
  const [preferenceStrength, setPreferenceStrength] = useState<"Must-have" | "Prefer" | "Open-minded">("Prefer");
  const [safeDateOpen, setSafeDateOpen] = useState(false);
  const [datePlanSaved, setDatePlanSaved] = useState(false);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(`mila-liked-${platform}`);
      if (stored) setLikedProfileIds(JSON.parse(stored));
    } catch {}
    setLikesLoaded(true);
  }, [platform]);
  useEffect(() => {
    if (!likesLoaded) return;
    window.localStorage.setItem(`mila-liked-${platform}`, JSON.stringify(likedProfileIds));
  }, [likedProfileIds, likesLoaded, platform]);
  const [birthDate, setBirthDate] = useState("1994-10-08");
  const [gender, setGender] = useState("Non-binary");
  const [showGender, setShowGender] = useState(true);
  const [height, setHeight] = useState("170");
  const [about, setAbout] = useState(
    "Curious by nature, happiest around good food, live music and thoughtful conversation.",
  );
  const [workTitle, setWorkTitle] = useState(
    platform === "ios" ? "Climate-tech engineer" : "Product designer",
  );
  const [education, setEducation] = useState("Bachelor’s degree");
  const [schoolName, setSchoolName] = useState("Parsons School of Design");
  const [interests, setInterests] = useState(["Travel", "Films", "Cooking"]);
  const [astrology, setAstrology] = useState(true);
  const [saved, setSaved] = useState(false);
  const profileSnapshotRef = useRef<{
    birthDate: string;
    gender: string;
    showGender: boolean;
    height: string;
    about: string;
    workTitle: string;
    education: string;
    schoolName: string;
    interests: string[];
    astrology: boolean;
  } | null>(null);
  const queue = discoveryProfiles[platform];
  const profile = queue[discoveryIndex] || initialProfile;
  const isFavorite = favoriteIds.includes(profile.id);
  const isLiked = likedProfileIds.includes(profile.id);
  const connectMoments = [
    ...Array.from({ length: 4 }, (_, index) => ({
      label: index === 3 ? "Video prompt" : `Photo ${index + 1}`,
      hint: index === 3 ? "this video" : "this photo",
    })),
    { label: "About me", hint: `${profile.name}’s story` },
    { label: "Looking for", hint: "relationship goals" },
    { label: "A personal prompt", hint: "this answer" },
  ];
  const selectedConnectMoment = connectMoments[connectPage];
  const showConnectPage = (
    index: number,
    behavior: ScrollBehavior = "smooth",
  ) => {
    const page = (index + connectMoments.length) % connectMoments.length;
    setConnectPage(page);
    const track = connectTrackRef.current;
    const card = track?.children.item(page) as HTMLElement | null;
    if (track && card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior });
    }
  };
  const receivedIntro = introRequest?.to === viewerName ? introRequest : null;
  const sentIntro = introRequest?.from === viewerName ? introRequest : null;
  const connectionPending = sentIntro?.to === profile.name && sentIntro.status === "pending";
  const conversationPartner = introRequest
    ? introRequest.from === viewerName
      ? introRequest.to
      : introRequest.from
    : initialProfile.name;
  const suggestedIntro = `Hi ${profile.name}—I noticed we both enjoy ${profile.tags[0].toLowerCase()}. I’d love to hear what got you into it.`;
  const zodiac = zodiacFor(birthDate);
  const selfProfile = platform === "ios" ? demoProfiles.arjun : demoProfiles.maya;
  const openEditor = (
    section: "basics" | "story" | "work" | "lifestyle" = "basics",
  ) => {
    if (!profileSnapshotRef.current) {
      profileSnapshotRef.current = {
        birthDate,
        gender,
        showGender,
        height,
        about,
        workTitle,
        education,
        schoolName,
        interests: [...interests],
        astrology,
      };
    }
    setSaved(false);
    setEditorSection(section);
    setSelfPreviewOpen(false);
    setEditorOpen(true);
  };
  const discardProfileChanges = () => {
    const snapshot = profileSnapshotRef.current;
    if (snapshot) {
      setBirthDate(snapshot.birthDate);
      setGender(snapshot.gender);
      setShowGender(snapshot.showGender);
      setHeight(snapshot.height);
      setAbout(snapshot.about);
      setWorkTitle(snapshot.workTitle);
      setEducation(snapshot.education);
      setSchoolName(snapshot.schoolName);
      setInterests(snapshot.interests);
      setAstrology(snapshot.astrology);
    }
    profileSnapshotRef.current = null;
    setSaved(false);
    setEditorOpen(false);
  };
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
  const toggleFavorite = (profileId: DemoProfile["id"] = profile.id) =>
    setFavoriteIds((current) =>
      current.includes(profileId)
        ? current.filter((id) => id !== profileId)
        : [...current, profileId],
    );
  const advanceProfile = (action: "liked" | "passed" | "intro" | "next") => {
    const actedOn = profile.name;
    if (action === "liked") {
      setLikedProfileIds((current) =>
        current.includes(profile.id) ? current : [...current, profile.id],
      );
    }
    setDiscoveryHistory((items) => [...items, discoveryIndex]);
    if (action !== "next") onDecision(action);
    setCardDecision(action === "next" ? "idle" : action);
    setDiscoverNotice(
      action === "liked" ? `You liked ${actedOn}` :
      action === "intro" ? `Introduction sent to ${actedOn}` :
      action === "passed" ? `Passed on ${actedOn}` : `Showing another profile`,
    );
    setTimeout(() => {
      setDiscoveryIndex((current) => (current + 1) % queue.length);
      onMediaIndex(0);
      setCardDecision("idle");
    }, action === "liked" ? 700 : action === "intro" ? 500 : 260);
  };
  const undoProfile = () => {
    const previous = discoveryHistory.at(-1);
    if (previous === undefined) {
      setDiscoverNotice("Nothing to undo yet");
      return;
    }
    setDiscoveryIndex(previous);
    const previousProfile = queue[previous];
    if (previousProfile) {
      setLikedProfileIds((current) => current.filter((id) => id !== previousProfile.id));
    }
    setDiscoveryHistory((items) => items.slice(0, -1));
    onDecision("idle");
    setCardDecision("idle");
    setDiscoverNotice("Previous profile restored");
  };
  const finishSwipe = () => {
    const { x, y } = dragOffset.current;
    const didSwipe = Math.max(Math.abs(x), Math.abs(y)) > 58;
    suppressClick.current = didSwipe;

    if (Math.abs(y) > Math.abs(x)) {
      if (y < -58) onProfileOpen(true);
      else if (y > 58) advanceProfile("next");
    } else if (x > 58) advanceProfile("liked");
    else if (x < -58) advanceProfile("passed");

    dragOffset.current = { x: 0, y: 0 };
    setDragX(0);
    setDragY(0);
    dragStart.current = null;

    if (didSwipe) {
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    }
  };
  const cycleRadius = () =>
    onRadius(radius === 5 ? 10 : radius === 10 ? 25 : 5);
  const openExploreFeed = (label: string) => {
    setDiscoveryIndex(0);
    onMediaIndex(0);
    setDiscoverNotice(`${label} selected · Showing your best matches`);
    onTab("discover");
  };
  const startIntroduction = () => {
    setIntroMessage(suggestedIntro);
    setConnectReview(true);
    setConnectPage(mediaIndex);
    setIntroComposerOpen(true);
    window.requestAnimationFrame(() => showConnectPage(mediaIndex, "auto"));
  };
  const sendIntroduction = () => {
    const text = introMessage.trim();
    if (!text) return;
    onSendIntro(
      viewerName,
      profile.name,
      connectReview ? `${selectedConnectMoment.label}: ${text}` : text,
    );
    setIntroComposerOpen(false);
    setIntroSent(true);
    if (connectReview) onProfileOpen(false);
    setConnectReview(false);
    advanceProfile("intro");
  };
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
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  };
  const answerVoice = (text: string) => {
    setVoiceResponse(text);
    speak(text);
  };
  const beginVoice = () => {
    setVoiceOpen(true);
    setVoiceStep("matches");
    setDictatingReply(false);
    setVoiceReply("");
    answerVoice(`Hi ${viewerName}. Would you like me to read your matched profiles today? Say yes, or skip to likes.`);
  };
  const guideVoice = (skip = false) => {
    if (voiceStep === "matches") {
      setVoiceStep("likes");
      const person = Object.values(demoProfiles).find(item => item.name === conversationPartner);
      answerVoice(`${skip ? "" : chatOpen ? `You are connected with ${conversationPartner}. ${person ? `${person.age}, ${person.job}, in ${person.city}. ${person.about}` : "Your conversation is open."}` : "No mutual matches in this preview yet."} Would you like me to go over your likes?`);
    } else if (voiceStep === "likes") {
      setVoiceStep("profiles");
      answerVoice(`${skip ? "" : `${targetLikedYou ? `${initialProfile.name} liked you. ` : "No new reciprocal likes in this demo session. "}${receivedIntro?.status === "pending" ? `${receivedIntro.from} also sent an introduction. ` : ""}`} Would you like to hear a profile from today's demo list?`);
    } else if (voiceStep === "profiles") {
      if (skip) {
        setVoiceStep("messages");
        answerVoice("Would you like me to read your messages aloud? Only continue if you are comfortable hearing them here.");
      } else {
        answerVoice(`${profile.name}, ${profile.age}. ${profile.job}, in ${profile.city}, ${profile.distance} miles away. ${profile.about} Would you like to like this profile, draft an introduction, hear the next profile, or go to messages?`);
      }
    } else if (voiceStep === "messages") {
      const incoming = messages.filter(message => message.sender !== viewerName);
      setVoiceStep(!skip && chatOpen && incoming.length ? "reply" : "done");
      answerVoice(skip ? "All done. You can restart your briefing whenever you like." : !chatOpen || !incoming.length ? "You have no received messages in this demo conversation. You're all caught up." : `${incoming.slice(-3).map(message => `${message.sender} says: ${message.text}`).join(" ")} Would you like to reply to ${conversationPartner}?`);
    } else if (voiceStep === "reply") {
      if (skip) { setVoiceStep("done"); setDictatingReply(false); answerVoice("No reply sent. You're all caught up."); }
      else { setDictatingReply(true); answerVoice(`What would you like to say to ${conversationPartner}? Tap the microphone to dictate, or type below. I'll show the draft before you send it.`); }
    } else beginVoice();
  };
  const runVoiceCommand = (command: string) => {
    const words = command.toLowerCase().trim();
    if (words === "stop" || words === "pause") { window.speechSynthesis?.cancel(); setDictatingReply(false); return; }
    if (dictatingReply) { setVoiceReply(command); setDictatingReply(false); answerVoice(`Your reply draft is: ${command}. Review it below, then tap Confirm and send reply.`); return; }
    if (["yes", "yes please", "continue", "read them", "read matches", "read likes", "read profile", "read messages", "reply"].includes(words)) { guideVoice(); return; }
    if (["no", "no thanks", "skip"].includes(words)) { guideVoice(true); return; }
    if (words.includes("restart")) { beginVoice(); return; }
    if (words.includes("messages")) { setVoiceStep("messages"); answerVoice("Would you like me to read your messages aloud? Say yes or skip."); return; }
    if (words.includes("skip to likes")) { setVoiceStep("likes"); answerVoice("Would you like me to go over your likes?"); return; }
    if (words.includes("next profile")) { setDiscoveryIndex((discoveryIndex + 1) % queue.length); onMediaIndex(0); const next = queue[(discoveryIndex + 1) % queue.length]; answerVoice(`${next.name}, ${next.age}. ${next.job}, in ${next.city}. ${next.about} Say like this profile, draft an intro, next profile, or messages.`); return; }
    if (words.includes("brief")) {
      answerVoice(
        `Good evening ${viewerName}. ${chatOpen ? `You connected with ${conversationPartner}, and your chat is ready.` : targetLikedYou ? `${profile.name} liked you. Like them back to open chat.` : `You have three new likes. ${profile.name} is today’s strongest recommendation.`}`,
      );
    } else if (words.includes("next")) {
      onMediaIndex((mediaIndex + 1) % 4);
      answerVoice(`Showing the next ${profile.name} photo.`);
    } else if (words.includes("favorite") || words.includes("save")) {
      setFavoriteIds((current) =>
        current.includes(profile.id) ? current : [...current, profile.id],
      );
      answerVoice(`${profile.name} is saved privately to Favorites.`);
    } else if (words.includes("like")) {
      advanceProfile("liked");
      answerVoice(`You liked ${profile.name}. You can undo this from your sent likes.`);
    } else if (words.includes("intro") || words.includes("connect")) {
      setIntroDraft(true);
      setIntroSent(false);
      answerVoice(`I drafted an introduction for ${profile.name}. Please review it before sending.`);
    } else if (words.includes("schedule") || words.includes("nine") || words.includes("9")) {
      setBriefScheduled(true);
      answerVoice(`Your private Mila Daily briefing is scheduled for ${briefTime}.`);
    } else {
      answerVoice("Try saying: brief me, like this profile, save as favorite, next photo, or draft an intro.");
    }
  };
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
      setListening(false);
      return;
    }
    const voiceWindow = window as typeof window & {
      SpeechRecognition?: new () => VoiceRecognition;
      webkitSpeechRecognition?: new () => VoiceRecognition;
    };
    const Recognition =
      voiceWindow.SpeechRecognition || voiceWindow.webkitSpeechRecognition;
    if (!Recognition) {
      answerVoice("Microphone commands are not available in this browser. The tap commands below still work.");
      return;
    }
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => runVoiceCommand(event.results[0][0].transcript);
    recognition.onerror = () => answerVoice("I could not hear that. Please try again or tap a command.");
    recognition.onend = () => { setListening(false); recognitionRef.current = null; };
    setListening(true);
    try {
      window.speechSynthesis?.cancel();
      recognition.start();
    } catch {
      setListening(false);
      answerVoice("Microphone could not start. Try again or use the tap commands below.");
    }
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
            <button aria-label="Settings" onClick={() => onTab("you")}>
              <Settings2 />
            </button>
          </div>
          <div className="screen-content">
            {activeTab === "discover" && (
              <div className="discover-screen">
                {discoverNotice && <div className="discover-notice" role="status"><Check /> {discoverNotice}</div>}
                <div className="today-bar" aria-label="Today at a glance">
                  <span><Sparkles /><b>Today</b><small>{calmMode ? "1 calm pick" : `${queue.length} picks`}</small></span>
                  <button onClick={() => onTab("likes")}><Heart /> Likes</button>
                  <button onClick={() => onTab("chats")}><MessageCircle /> Messages</button>
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
                      className={`profile-card card-${cardDecision} ${dragX !== 0 || dragY !== 0 ? "is-dragging" : ""}`}
                      style={
                        dragX || dragY
                          ? {
                              transform: `translate3d(${dragX}px, ${dragY}px, 0) rotate(${dragX / 20}deg)`,
                            }
                          : undefined
                      }
                      onPointerDown={(e) => {
                        if (!e.isPrimary) return;
                        dragStart.current = { x: e.clientX, y: e.clientY };
                        dragOffset.current = { x: 0, y: 0 };
                        (e.target as Element).setPointerCapture(e.pointerId);
                      }}
                      onPointerMove={(e) => {
                        if (dragStart.current !== null) {
                          const nextOffset = {
                            x: e.clientX - dragStart.current.x,
                            y: e.clientY - dragStart.current.y,
                          };
                          dragOffset.current = nextOffset;
                          setDragX(nextOffset.x);
                          setDragY(nextOffset.y);
                        }
                      }}
                      onPointerUp={finishSwipe}
                      onPointerCancel={finishSwipe}
                      onClickCapture={(e) => {
                        if (!suppressClick.current) return;
                        e.preventDefault();
                        e.stopPropagation();
                        suppressClick.current = false;
                      }}
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
                        <div className="nearby-on-photo">
                          <span>
                            <LocateFixed /> Nearby · {queue.length} profiles
                          </span>
                          <button onClick={cycleRadius}>
                            Within {radius} mi <ChevronDown />
                          </button>
                        </div>
                        <span className="verified-pill">
                          <BadgeCheck /> Verified
                        </span>
                        {mediaIndex === 3 && (
                          <span className="video-pill">
                            <Play /> Video · 0:12
                          </span>
                        )}
                        {cardDecision !== "idle" && (
                          <div className="decision-stamp">
                            {cardDecision === "passed"
                              ? "Maybe later"
                              : cardDecision === "intro"
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
                            aria-label={`View ${profile.name}'s full profile`}
                            title={`View ${profile.name}'s full profile`}
                          >
                            <ChevronUp />
                          </button>
                        </div>
                        <div className="swipe-actions overlay-actions">
                          <button aria-label="Pass" onClick={() => advanceProfile("passed")}>
                            <X />
                          </button>
                          <button aria-label="Undo" onClick={undoProfile}>
                            <RotateCcw />
                          </button>
                          <button
                            className="priority"
                            aria-label={`Send intro to ${profile.name}`}
                            onClick={startIntroduction}
                          >
                            <Star />
                            <span>Send intro</span>
                          </button>
                          <button
                            className={`like ${isLiked ? "is-liked" : ""}`}
                            aria-label={isLiked ? `${profile.name} liked` : `Like ${profile.name}`}
                            aria-pressed={isLiked}
                            disabled={isLiked}
                            onClick={() => advanceProfile("liked")}
                          >
                            <Heart fill={isLiked ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                    </article>
                    {introComposerOpen && (
                      <div className={`intro-composer ${connectReview ? "connect-review" : ""}`} role="dialog" aria-modal="true" aria-labelledby={`${platform}-intro-title`}>
                        {connectReview && <button className="connect-close" onClick={() => { setIntroComposerOpen(false); setConnectReview(false); }} aria-label="Close connection composer"><X /></button>}
                        <span className={`intro-avatar profile-${profile.id}`} />
                        <div>
                          <small>{connectReview ? "First impression" : "Meaningful introduction"}</small>
                          <h3 id={`${platform}-intro-title`}>{connectReview ? `Connect with ${profile.name}` : `Message ${profile.name}`}</h3>
                          <p>{connectReview ? `Tap for the next page, or swipe and drag through ${profile.name}’s profile.` : `${profile.name} can read this before deciding whether to connect.`}</p>
                        </div>
                        {connectReview && <>
                          <div className="connect-pager">
                            <div className="connect-page-head">
                              <span>{selectedConnectMoment.label}</span>
                              <b>{connectPage + 1}/{connectMoments.length}</b>
                            </div>
                            <div
                              className="connect-page-track"
                              ref={connectTrackRef}
                              aria-label={`${profile.name}'s profile pages`}
                              onPointerDown={(event) => {
                                connectDragRef.current = {
                                  active: event.pointerType === "mouse",
                                  moved: false,
                                  startX: event.clientX,
                                  scrollLeft: event.currentTarget.scrollLeft,
                                };
                                if (event.pointerType === "mouse") event.currentTarget.setPointerCapture(event.pointerId);
                              }}
                              onPointerMove={(event) => {
                                if (Math.abs(event.clientX - connectDragRef.current.startX) > 8) connectDragRef.current.moved = true;
                                if (!connectDragRef.current.active) return;
                                event.currentTarget.scrollLeft = connectDragRef.current.scrollLeft - (event.clientX - connectDragRef.current.startX);
                              }}
                              onPointerUp={(event) => {
                                connectDragRef.current.active = false;
                                if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                                const track = event.currentTarget;
                                const center = track.scrollLeft + track.clientWidth / 2;
                                const pages = Array.from(track.children) as HTMLElement[];
                                const nearest = pages.reduce((best, page, index) => {
                                  const distance = Math.abs(page.offsetLeft + page.offsetWidth / 2 - center);
                                  return distance < best.distance ? { index, distance } : best;
                                }, { index: 0, distance: Number.POSITIVE_INFINITY });
                                showConnectPage(nearest.index);
                              }}
                              onPointerCancel={() => { connectDragRef.current.active = false; }}
                              onClick={(event) => {
                                if ((event.target as HTMLElement).closest("button, input, textarea, a")) return;
                                if (connectDragRef.current.moved) {
                                  connectDragRef.current.moved = false;
                                  return;
                                }
                                showConnectPage(connectPage + 1);
                              }}
                              onScroll={(event) => {
                                const track = event.currentTarget;
                                const center = track.scrollLeft + track.clientWidth / 2;
                                const pages = Array.from(track.children) as HTMLElement[];
                                const nearest = pages.reduce((best, page, index) => {
                                  const distance = Math.abs(page.offsetLeft + page.offsetWidth / 2 - center);
                                  return distance < best.distance ? { index, distance } : best;
                                }, { index: 0, distance: Number.POSITIVE_INFINITY });
                                if (nearest.index !== connectPage) setConnectPage(nearest.index);
                              }}
                            >
                              {connectMoments.map((moment, index) => (
                                <article
                                  key={moment.label}
                                  className={`connect-page connect-page-${index} ${index < 4 ? `connect-page-media profile-${profile.id} media-${index}` : ""}`}
                                  aria-label={`${moment.label}, page ${index + 1} of ${connectMoments.length}`}
                                >
                                  {index < 4 && <div>{index === 3 && <Play className="connect-video-icon" fill="currentColor" />}<b>{profile.name}, {profile.age}</b><small>{index === 3 ? "Video prompt · tap for the next page" : "Tap for next · or swipe"}</small></div>}
                                  {index === 4 && <><h4>About {profile.name}</h4><p>{profile.about}</p></>}
                                  {index === 5 && <><h4>Looking for</h4><strong>Long-term relationship</strong><p>Marriage-minded · Open to children · Open to relocation</p></>}
                                  {index === 6 && <><h4>A personal prompt</h4><blockquote>“{profile.prompt}”</blockquote><div className="connect-tags">{profile.tags.map(tag => <span key={tag}>{tag}</span>)}</div></>}
                                </article>
                              ))}
                            </div>
                            <div
                              className="connect-progress"
                              role="progressbar"
                              aria-label="Profile page progress"
                              aria-valuemin={1}
                              aria-valuemax={connectMoments.length}
                              aria-valuenow={connectPage + 1}
                            >
                              {connectMoments.map((moment, index) => <span key={moment.label} className={connectPage === index ? "is-active" : ""} />)}
                            </div>
                          </div>
                          <div className="connection-includes">
                            <span className={`connection-owner profile-${selfProfile.id} media-0`} />
                            <span><b>Your complete Mila profile is included</b><small>Photos and video · About · Interests · Lifestyle</small></span>
                            <Check />
                          </div>
                        </>}
                        <Textarea
                          value={introMessage}
                          onChange={(event) => setIntroMessage(event.target.value)}
                          aria-label={`Introduction to ${profile.name}`}
                          placeholder={connectReview ? `Write about ${selectedConnectMoment.hint}…` : undefined}
                          maxLength={240}
                        />
                        <small className="intro-count">{introMessage.length}/240</small>
                        <div className="intro-compose-actions">
                          <button onClick={() => { setIntroComposerOpen(false); setConnectReview(false); }}>Cancel</button>
                          <button disabled={!introMessage.trim()} onClick={sendIntroduction}>
                            <Send /> {connectReview ? "Send connection" : "Send introduction"}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {matched && (
                  <div className="match-moment">
                    <span className={`match-photo profile-${initialProfile.id}`} />
                    <Sparkles />
                    <h3>It’s a match!</h3>
                    <p>{viewerName} and {initialProfile.name} liked each other. Chat is now open.</p>
                    <button onClick={() => onTab("chats")}>
                      Say hello <MessageCircle />
                    </button>
                  </div>
                )}
              </div>
            )}
            {activeTab === "explore" && (
              <div className="inner-screen">
                <span className="screen-kicker">Discover</span>
                <h2>Date with intention.</h2>
                <p>Choose a space that matches what you want today.</p>
                <div className="explore-grid">
                  <button className="wide" onClick={() => openExploreFeed("Ready for real")}>
                    <Heart />
                    <span>
                      <b>Ready for real</b>
                      <small>Long-term connections</small>
                    </span>
                  </button>
                  <button onClick={() => openExploreFeed("New in town")}>
                    <MapPin />
                    <span>
                      <b>New in town</b>
                      <small>Meet nearby</small>
                    </span>
                  </button>
                  <button onClick={() => openExploreFeed("Across borders")}>
                    <Globe2 />
                    <span>
                      <b>Across borders</b>
                      <small>Open to distance</small>
                    </span>
                  </button>
                  <button onClick={() => openExploreFeed("Free tonight")}>
                    <Zap />
                    <span>
                      <b>Free tonight</b>
                      <small>Spontaneous plans</small>
                    </span>
                  </button>
                  <button onClick={() => openExploreFeed("Culture & roots")}>
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
                <h2>Likes</h2>
                <p>A little interest. A new possibility.</p>
                <div className="likes-tabs" aria-label="Likes views">
                  <button
                    onClick={() => setLikesView("incoming")}
                    aria-pressed={likesView === "incoming"}
                  >
                    Requests <i>{receivedIntro?.status === "pending" ? 1 : 0}</i>
                  </button>
                  <button
                    onClick={() => setLikesView("sent")}
                    aria-pressed={likesView === "sent"}
                  >
                    Sent <i>{likedProfileIds.length + (sentIntro ? 1 : 0)}</i>
                  </button>
                  <button
                    onClick={() => setLikesView("favorites")}
                    aria-pressed={likesView === "favorites"}
                  >
                    Saved <i>{favoriteIds.length}</i>
                  </button>
                </div>
                {likesView === "incoming" && (
                  <div className="likes-list">
                    {receivedIntro?.status === "pending" && (
                      <article className="intro-request-card">
                        <header>
                          <span className={`like-avatar target-mini profile-${initialProfile.id}`}>{receivedIntro.from[0]}</span>
                          <span>
                            <b>{receivedIntro.from} sent an introduction</b>
                            <small>Only accept if you want to start chatting.</small>
                          </span>
                        </header>
                        <blockquote>“{receivedIntro.text}”</blockquote>
                        <div>
                          <button onClick={onDeclineIntro}>Decline</button>
                          <button onClick={() => { onAcceptIntro(); onTab("chats"); }}>
                            <Check /> Accept &amp; chat
                          </button>
                        </div>
                      </article>
                    )}
                    {receivedIntro?.status === "accepted" && (
                      <button className="accepted-request" onClick={() => onTab("chats")}>
                        <Check /> Connected with {receivedIntro.from} · Open chat
                      </button>
                    )}
                    {receivedIntro?.status === "declined" && (
                      <div className="request-empty">Introduction declined. No chat was opened.</div>
                    )}
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
                    <div className="people-photo-grid">
                      {queue.map((person, index) => (
                        <button className={`people-photo profile-${person.id} media-0`} key={person.id}
                          onClick={() => { setDiscoveryIndex(index); onMediaIndex(0); onProfileOpen(true); }}
                          aria-label={`View ${person.name}'s profile`}>
                          <span className="people-photo-copy"><b>{person.name}, {person.age}</b><small>{person.city} · {person.distance} mi</small></span>
                          <span className="people-photo-open"><ArrowLeft /></span>
                        </button>
                      ))}
                    </div>
                    <small className="likes-note">
                      Introductions stay private until you accept. Likes still require a mutual match.
                    </small>
                  </div>
                )}
                {likesView === "sent" && (
                  <div className="likes-list">
                    {sentIntro && (
                      <article className="sent-intro-card">
                        <span className={`like-avatar target-mini profile-${initialProfile.id}`}>{sentIntro.to[0]}</span>
                        <span>
                          <b>Introduction to {sentIntro.to}</b>
                          <small>{sentIntro.status === "pending" ? "Waiting for a response" : sentIntro.status === "accepted" ? "Accepted · Chat is open" : "Declined"}</small>
                        </span>
                        <em>{sentIntro.status}</em>
                      </article>
                    )}
                    {likedProfileIds.map((profileId) => {
                      const likedProfile = demoProfiles[profileId];
                      const savedLikedProfile = favoriteIds.includes(profileId);
                      return <div className="like-person" key={profileId}>
                        <span className={`like-avatar target-mini profile-${profileId}`}>{likedProfile.name[0]}</span>
                        <span><b>{likedProfile.name}, {likedProfile.age}</b><small>Liked just now · Awaiting response</small></span>
                        <button className="save-person" onClick={() => toggleFavorite(profileId)}
                          aria-label={savedLikedProfile ? `Remove ${likedProfile.name} from favorites` : `Save ${likedProfile.name} to favorites`}>
                          <Bookmark fill={savedLikedProfile ? "currentColor" : "none"} />
                        </button>
                      </div>;
                    })}
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
                    {favoriteIds.length ? (
                      favoriteIds.map((profileId) => {
                        const favoriteProfile = demoProfiles[profileId];
                        return <div className="like-person" key={profileId}>
                          <span className={`like-avatar target-mini profile-${profileId}`}>{favoriteProfile.name[0]}</span>
                          <span><b>{favoriteProfile.name}, {favoriteProfile.age}</b><small>Saved privately · {favoriteProfile.city}</small></span>
                          <button className="save-person" onClick={() => toggleFavorite(profileId)} aria-label={`Remove ${favoriteProfile.name} from favorites`}>
                            <Bookmark fill="currentColor" />
                          </button>
                        </div>;
                      })
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
                <h2>Chats</h2>
                <h3 className="section-title">New connections</h3>
                <div className="new-matches">
                  <span className={`mini-avatar target-mini profile-${profile.id}`}>{profile.name[0]}</span>
                  <span className="mini-avatar alt">A</span>
                  <button onClick={() => onTab("likes")} aria-label="View new connections">
                    <Heart /> New match
                  </button>
                </div>
                {chatOpen ? (
                  <>
                    <div className="chat-row new-match-chat">
                      <span className={`chat-avatar target-mini profile-${initialProfile.id}`}>{initialProfile.name[0]}</span>
                      <div><b>{conversationPartner} <BadgeCheck /></b><small>Connected · Messages are now open</small></div>
                      <time>Now</time>
                    </div>
                    <div className="chat-thread" aria-label={`Conversation with ${conversationPartner}`}>
                      {messages.map((message) => (
                        <div key={message.id} className={`chat-bubble ${message.sender === viewerName ? "is-mine" : "is-theirs"}`}>
                          <small>{message.sender === viewerName ? "You" : message.sender}</small>
                          <p>{message.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="quick-message">
                      <Input
                        value={messageDraft}
                        onChange={(event) => setMessageDraft(event.target.value)}
                        placeholder={`Message ${conversationPartner}…`}
                        aria-label={`Message ${conversationPartner}`}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && messageDraft.trim()) {
                            onSendMessage(viewerName, messageDraft.trim());
                            setMessageDraft("");
                          }
                        }}
                      />
                      <button
                        disabled={!messageDraft.trim()}
                        onClick={() => {
                          onSendMessage(viewerName, messageDraft.trim());
                          setMessageDraft("");
                        }}
                        aria-label="Send message"
                      ><Send /></button>
                    </div>
                  </>
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
                  <button
                    aria-label="Try copilot"
                    onClick={() => setMessageDraft(`What first got you interested in ${profile.tags[0].toLowerCase()}?`)}
                  >
                    <Send />
                  </button>
                </div>
                {chatOpen && (
                  <div className="safe-date-card">
                    <ShieldCheck />
                    <span><b>Plan a safer first date</b><small>Public place · Share plan · Check in</small></span>
                    <button onClick={() => setSafeDateOpen(!safeDateOpen)}>{safeDateOpen ? "Close" : "Plan"}</button>
                    {safeDateOpen && (
                      <div className="safe-date-plan">
                        <p><Check /> Meet at a busy public café</p>
                        <p><Check /> Share time and place with a trusted contact</p>
                        <p><Check /> Schedule a private check-in</p>
                        <button onClick={() => setDatePlanSaved(true)}>{datePlanSaved ? "Plan saved" : "Save date plan"}</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === "you" && (
              <div className="inner-screen you-screen">
                <span className="screen-kicker">Your space</span>
                <h2>My profile</h2>
                <p>Keep your story current.</p>
                <div className={`owner-card profile-${selfProfile.id} media-0`}>
                  <div className="owner-card-shade" />
                  <span className="owner-score">{completeness}% complete</span>
                  <button className="owner-edit-button" onClick={() => openEditor("basics")}>
                    <Pencil /> Edit
                  </button>
                  <div className="owner-card-copy">
                    <button className="owner-preview-button" onClick={() => setSelfPreviewOpen(true)}>
                      <Eye /> Preview
                    </button>
                    <div>
                      <b>{viewerName}, {selfProfile.age}</b>
                      <BadgeCheck />
                    </div>
                    <small>{workTitle || "Add your work"} · {selfProfile.city}</small>
                  </div>
                </div>
                <div className="profile-quick-links">
                  <button onClick={() => openEditor("basics")}><Ruler /> Height</button>
                  <button onClick={() => openEditor("work")}><BriefcaseBusiness /> Work</button>
                  <button onClick={() => openEditor("work")}><GraduationCap /> Education</button>
                  <button onClick={() => openEditor("lifestyle")}><Heart /> Lifestyle</button>
                </div>
                <div className="profile-media-heading"><h3>My photos</h3><span>3 photos · 1 video preview</span></div>
                <div className="owner-photo-strip">
                  {[0, 1, 2, 3].map(index => (
                    <button key={index} className={`profile-${selfProfile.id} media-${index}`}
                      onClick={() => { setSelfMediaIndex(index); setSelfPreviewOpen(true); }}
                      aria-label={index === 3 ? "Preview my video" : `Preview my photo ${index + 1}`}>
                      {index === 3 ? <Play /> : <span>{index + 1}</span>}
                    </button>
                  ))}
                </div>
                <div className="profile-section-list">
                  <button onClick={() => openEditor("basics")}>
                    <UserRound /><span><b>Basics</b><small>Identity, height and birthday</small></span><strong>Complete</strong>
                  </button>
                  <button onClick={() => openEditor("story")}>
                    <MessageCircle /><span><b>Your story</b><small>About you and interests</small></span><strong>Complete</strong>
                  </button>
                  <button onClick={() => openEditor("work")}>
                    <BriefcaseBusiness /><span><b>Work &amp; education</b><small>Title, degree and school</small></span><strong>Complete</strong>
                  </button>
                  <button onClick={() => openEditor("lifestyle")}>
                    <Heart /><span><b>Dating &amp; lifestyle</b><small>Intent, family plans and habits</small></span><strong>Complete</strong>
                  </button>
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
                        : "Stop appearing in Match without losing matches."}
                    </small>
                  </span>
                  <Switch
                    size="sm"
                    checked={hidden}
                    onCheckedChange={onHidden}
                    aria-label="Hide my profile"
                  />
                </div>
                <div className="calm-mode-card">
                  <Sparkles />
                  <span><b>Calm Mode</b><small>{calmMode ? "One thoughtful recommendation each day" : "Choose a smaller daily set of profiles"}</small></span>
                  <Switch size="sm" checked={calmMode} onCheckedChange={setCalmMode} aria-label="Calm Mode" />
                </div>
                <h3>Choose your look</h3>
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
                <div className="story-dots" aria-label={`${mediaIndex + 1} of 4 media items`}>
                  {[0, 1, 2, 3].map((index) => <i key={index} className={mediaIndex === index ? "active" : ""} />)}
                </div>
                <button
                  className="profile-back"
                  onClick={() => {
                    onProfileOpen(false);
                    onSafetyOpen(false);
                  }}
                  aria-label="Close full profile"
                  title="Close full profile"
                >
                  <ChevronDown />
                </button>
                <button
                  className="profile-more"
                  onClick={() => onSafetyOpen(!safetyOpen)}
                  aria-label="Safety options"
                >
                  <MoreHorizontal />
                </button>
                <button
                  className={`full-connect ${connectionPending ? "is-sent" : ""}`}
                  onClick={startIntroduction}
                  disabled={connectionPending}
                  aria-label={connectionPending ? `Connection request sent to ${profile.name}` : `Connect with ${profile.name}`}
                >
                  {connectionPending ? <Check /> : <Send />}
                  {connectionPending ? "Request sent" : "Connect"}
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
                    {videoPlaying ? "Demo video preview · tap to close" : "Preview video prompt"}
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
              <div className="gallery-hint"><ArrowLeft /> Tap left for previous <span>Tap photo for next</span></div>
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
                    onClick={() => toggleFavorite()}
                    aria-pressed={isFavorite}
                  >
                    <Bookmark fill={isFavorite ? "currentColor" : "none"} />
                    {isFavorite ? "Saved" : "Save profile"}
                  </button>
                </div>
                <button className="ai-match-summary" onClick={onReason} aria-expanded={showReason}>
                  <Sparkles />
                  <span><b>Why Mila recommends {profile.name}</b><small>{showReason ? `You both value long-term connection, ${profile.tags[0].toLowerCase()}, and an intentional pace.` : "See the profile details behind this recommendation"}</small></span>
                  <ChevronDown />
                </button>
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
                  className={isLiked ? "is-liked" : ""}
                  aria-pressed={isLiked}
                  disabled={isLiked}
                  onClick={() => {
                    setLikedProfileIds((current) => current.includes(profile.id) ? current : [...current, profile.id]);
                    onDecision("liked");
                    setProfileNotice(`Like sent to ${profile.name}`);
                  }}
                >
                  <Heart fill={isLiked ? "currentColor" : "none"} /> {isLiked ? "Liked" : `Like ${profile.name}`}
                </button>
              </div>
            </section>
          )}
          {selfPreviewOpen && (
            <section className="self-profile-preview">
              <header>
                <button
                  onClick={() => {
                    setSelfPreviewOpen(false);
                    if (profileSnapshotRef.current) setEditorOpen(true);
                  }}
                  aria-label={profileSnapshotRef.current ? "Back to editor" : "Back to profile"}
                >
                  <ArrowLeft />
                </button>
                <span>
                  <b>Preview profile</b>
                  <small>Previewed as a potential match</small>
                </span>
                <button className="preview-edit" onClick={() => openEditor("basics")}>Edit</button>
              </header>
              <div className="self-preview-scroll">
                <div className={`self-preview-hero profile-${selfProfile.id} media-${selfMediaIndex}`}>
                  <div className="story-dots">{[0,1,2,3].map(index => <i key={index} className={index === selfMediaIndex ? "active" : ""}/>)}</div>
                  <button className="media-prev" aria-label="Previous profile photo" onClick={() => setSelfMediaIndex((selfMediaIndex + 3) % 4)} />
                  <button className="media-next" aria-label="Next profile photo" onClick={() => setSelfMediaIndex((selfMediaIndex + 1) % 4)} />
                  {selfMediaIndex === 3 && <span className="video-pill"><Play /> Video preview</span>}
                  <span className="verified-pill"><BadgeCheck /> Verified</span>
                  <div className="owner-card-shade" />
                  <div className="self-preview-name">
                    <h2>{viewerName}, {selfProfile.age}</h2>
                    <BadgeCheck />
                    <p><MapPin /> {selfProfile.city}</p>
                  </div>
                </div>
                <div className={`preview-visibility ${hidden ? "is-hidden" : ""}`}>
                  {hidden ? <EyeOff /> : <Eye />}
                  {hidden ? "Hidden from new people; existing matches can still chat" : "Visible to people you meet in Match"}
                </div>
                <article className="preview-section">
                  <header><h3>About me</h3><button onClick={() => openEditor("story")}>Edit</button></header>
                  <p>{about || "Add a short introduction so people can understand your personality."}</p>
                </article>
                <article className="preview-section">
                  <header><h3>What I’m looking for</h3><button onClick={() => openEditor("lifestyle")}>Edit</button></header>
                  <span className="intent-pill"><Heart /> Long-term relationship</span>
                  <div className="preview-kickers">
                    <span>Marriage-minded</span><span>Open to children</span><span>Open to relocate</span>
                  </div>
                </article>
                <article className="preview-section">
                  <header><h3>Life at a glance</h3><button onClick={() => openEditor("work")}>Edit</button></header>
                  <div className="preview-facts">
                    <span><BriefcaseBusiness></BriefcaseBusiness><b>{workTitle || "Work title"}</b><small>Career</small></span>
                    <span><GraduationCap></GraduationCap><b>{education || "Education"}</b><small>{schoolName || "School"}</small></span>
                    <span><Ruler></Ruler><b>{height} cm</b><small>Height</small></span>
                    {showGender && <span><UserRound></UserRound><b>{gender}</b><small>Gender</small></span>}
                    {astrology && <span><Sparkles></Sparkles><b>{zodiac}</b><small>From birthday</small></span>}
                  </div>
                </article>
                <article className="preview-section">
                  <header><h3>Interests</h3><button onClick={() => openEditor("story")}>Edit</button></header>
                  <div className="preview-kickers">{interests.map(item => <span key={item}>{item}</span>)}</div>
                </article>
                <div className="preview-note"><EyeOff></EyeOff><span><b>Private details stay private</b><small>Your birth date, preference filters and other private choices are never shown here.</small></span></div>
              </div>
            </section>
          )}
          {editorOpen && (
            <section className="profile-builder">
              <header>
                <button
                  onClick={discardProfileChanges}
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
                    profileSnapshotRef.current = null;
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
                  <button className="preview-from-editor" onClick={() => {
                    setEditorOpen(false);
                    setSelfPreviewOpen(true);
                  }}><Eye /> Preview profile</button>
                </div>
                <div className="editor-section-tabs" aria-label="Edit profile section">
                  <button aria-pressed={editorSection === "basics"} onClick={() => setEditorSection("basics")}>Basics</button>
                  <button aria-pressed={editorSection === "story"} onClick={() => setEditorSection("story")}>Story</button>
                  <button aria-pressed={editorSection === "work"} onClick={() => setEditorSection("work")}>Work</button>
                  <button aria-pressed={editorSection === "lifestyle"} onClick={() => setEditorSection("lifestyle")}>Lifestyle</button>
                </div>
                {editorSection === "basics" && <>
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
                      aria-label="Show gender on my profile"
                    />
                  </div>
                </div>
                <div className="builder-section">
                  <h3>About you</h3>
                  <label>
                    <span>
                      <Ruler /> Height <small>Optional</small>
                    </span>
                    <div className="unit-input"><Input type="number" min="120" max="230" value={height} onChange={(e) => setHeight(e.target.value)} /><b>cm</b></div>
                  </label>
                  <label>
                    <span>
                      <CakeSlice /> Date of birth <small>Always private</small>
                    </span>
                    <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                  </label>
                  <div className="zodiac-result"><span>{zodiacSymbol[zodiac]}</span><div><b>{zodiac}</b><small>Calculated automatically · Choose whether to display</small></div><Switch size="sm" checked={astrology} onCheckedChange={setAstrology} aria-label="Show zodiac on my profile" /></div>
                </div>
                </>}
                {editorSection === "story" && <>
                <div className="builder-section story-section">
                  <h3>About you <small>{about.length}/300</small></h3>
                  <label className="about-field">
                    <span><UserRound /> About me <small>Write a friendly, specific introduction</small></span>
                    <textarea value={about} maxLength={300} onChange={(e) => setAbout(e.target.value)} placeholder="What should someone know about you?" />
                  </label>
                </div>
                <div className="builder-section">
                  <h3>Interests <small>{interests.length}/5 selected</small></h3>
                  <div className="interest-cloud">
                    {interestOptions.map((item) => (
                      <button key={item} onClick={() => toggleInterest(item)} aria-pressed={interests.includes(item)}>
                        {interests.includes(item) && <Check />} {item}
                      </button>
                    ))}
                  </div>
                </div>
                </>}
                {editorSection === "work" && <div className="builder-section">
                  <h3>Work &amp; education</h3>
                  <label><span><BriefcaseBusiness /> Work title <small>Optional</small></span><Input value={workTitle} maxLength={60} onChange={(e) => setWorkTitle(e.target.value)} placeholder="e.g. Product designer" /></label>
                  <label><span><GraduationCap /> Education <small>Optional</small></span><NativeSelect size="sm" value={education} onChange={(e) => setEducation(e.target.value)}><NativeSelectOption value="">Prefer not to say</NativeSelectOption><NativeSelectOption>High school</NativeSelectOption><NativeSelectOption>Trade school</NativeSelectOption><NativeSelectOption>Associate degree</NativeSelectOption><NativeSelectOption>Bachelor’s degree</NativeSelectOption><NativeSelectOption>Master’s degree</NativeSelectOption><NativeSelectOption>Doctorate</NativeSelectOption></NativeSelect></label>
                  <label><span><GraduationCap /> School name <small>Optional</small></span><Input value={schoolName} maxLength={80} onChange={(e) => setSchoolName(e.target.value)} placeholder="College or university" /></label>
                </div>}
                {editorSection === "lifestyle" && <div className="builder-section lifestyle-editor">
                  <h3>Dating &amp; lifestyle</h3>
                  <label><span><Heart /> Dating intent <small>Shown on profile</small></span><NativeSelect size="sm"><NativeSelectOption>Long-term relationship</NativeSelectOption><NativeSelectOption>Marriage-minded</NativeSelectOption><NativeSelectOption>Exploring</NativeSelectOption></NativeSelect></label>
                  <label><span><UsersRound /> Family plans <small>Optional</small></span><NativeSelect size="sm"><NativeSelectOption>Open to children</NativeSelectOption><NativeSelectOption>Wants children</NativeSelectOption><NativeSelectOption>Does not want children</NativeSelectOption><NativeSelectOption>Unsure</NativeSelectOption></NativeSelect></label>
                  <label><span><Globe2 /> Relocation <small>Optional</small></span><NativeSelect size="sm"><NativeSelectOption>Open to relocate</NativeSelectOption><NativeSelectOption>Not open to relocate</NativeSelectOption><NativeSelectOption>Open to discuss</NativeSelectOption></NativeSelect></label>
                  <div className="preference-strength">
                    <span><b>Preference strength</b><small>How Mila should use these choices</small></span>
                    <div>{(["Must-have", "Prefer", "Open-minded"] as const).map(option => <button key={option} aria-pressed={preferenceStrength === option} onClick={() => setPreferenceStrength(option)}>{option}</button>)}</div>
                  </div>
                  <div className="lifestyle-quick">
                    <button><span>Smoking</span><b>Never</b></button><button><span>Drinking</span><b>Socially</b></button><button><span>Pets</span><b>Enjoys pets</b></button><button><span>Communication</span><b>Balanced</b></button>
                  </div>
                </div>}
                {editorSection === "basics" && <div className="astrology-card">
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
                      aria-label="Use astrology compatibility insights"
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
                </div>}
              </div>
            </section>
          )}
          {!voiceOpen && !editorOpen && !profileOpen && !selfPreviewOpen && (
            <button
              className="voice-fab"
              onClick={beginVoice}
              aria-label="Open Mila Voice"
            >
              <Mic />
              <span>Mila Voice</span>
            </button>
          )}
          {voiceOpen && (
            <section className="voice-assistant">
              <header>
                <button onClick={() => { recognitionRef.current?.abort(); recognitionRef.current = null; setListening(false); window.speechSynthesis?.cancel(); setVoiceOpen(false); }} aria-label="Close Mila Voice">
                  <ArrowLeft />
                </button>
                <span>
                  <b>Mila Voice</b>
                  <small>Private voice dating assistant</small>
                </span>
                <i>{briefScheduled ? `${briefTime} daily` : "On demand"}</i>
              </header>
              <div className="voice-scroll">
                <div className="voice-hero">
                  <button
                    className={listening ? "is-listening" : ""}
                    onClick={startListening}
                    aria-label={listening ? "Stop listening" : "Start voice command"}
                  >
                    <Mic />
                  </button>
                  <strong>{listening ? "Listening…" : "Tap, then speak"}</strong>
                  <small>No always-on microphone</small>
                </div>
                <div className="voice-response" aria-live="polite">
                  <Volume2 />
                  <p>{voiceResponse}</p>
                  <button onClick={() => speak(voiceResponse)} aria-label="Replay response">
                    Replay
                  </button>
                </div>
                <div className="voice-section">
                  <h3>Your daily conversation · {voiceStep}</h3>
                  <small className="prototype-note">Uses this demo session; not a live daily inbox.</small>
                  <div className="voice-commands">
                    <button onClick={() => guideVoice()}>{voiceStep === "done" ? "Start again" : voiceStep === "reply" ? "Draft a reply" : "Yes, continue"}</button>
                    {voiceStep !== "done" && <button onClick={() => guideVoice(true)}>Skip</button>}
                    <button onClick={() => window.speechSynthesis?.cancel()}>Pause audio</button>
                  </div>
                  {voiceStep === "profiles" && <div className="voice-commands">
                    {["Read profile", "Next profile", `Like ${profile.name}`, "Draft an intro", "Messages"].map(command => <button key={command} onClick={() => runVoiceCommand(command)}>{command}</button>)}
                  </div>}
                  {voiceStep === "reply" && <div className="intro-review">
                    <span>Reply to {conversationPartner} · review before sending</span>
                    <Textarea aria-label="Voice reply draft" placeholder="Type or dictate your reply…" value={voiceReply} onChange={event => setVoiceReply(event.target.value)} />
                    <div><button onClick={() => { setVoiceReply(""); setDictatingReply(false); }}>Discard draft</button>
                    <button disabled={!voiceReply.trim() || !chatOpen} onClick={() => {
                      onSendMessage(viewerName, voiceReply.trim()); setVoiceReply(""); setDictatingReply(false); setVoiceStep("done"); answerVoice(`Your reply to ${conversationPartner} was sent.`);
                    }}>Confirm &amp; send reply</button></div>
                  </div>}
                  <h3 style={{marginTop:16}}>Quick actions</h3>
                  <div className="voice-commands">
                    {["Brief me", `Like ${profile.name}`, "Save favorite", "Next photo", "Draft an intro"].map(command => (
                      <button key={command} onClick={() => runVoiceCommand(command)}>
                        {command}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="voice-section schedule-card">
                  <div>
                    <Clock3 />
                    <span>
                      <b>Mila Daily</b>
                      <small>Matches, likes and recommended profiles</small>
                    </span>
                    <Switch
                      size="sm"
                      checked={briefScheduled}
                      onCheckedChange={(checked) => {
                        setBriefScheduled(checked);
                        answerVoice(checked ? `Daily briefing scheduled for ${briefTime}.` : "Daily briefing turned off.");
                      }}
                    />
                  </div>
                  <label>
                    Briefing time
                    <NativeSelect value={briefTime} onChange={(event) => setBriefTime(event.target.value)}>
                      <NativeSelectOption>7:00 PM</NativeSelectOption>
                      <NativeSelectOption>8:00 PM</NativeSelectOption>
                      <NativeSelectOption>9:00 PM</NativeSelectOption>
                      <NativeSelectOption>10:00 PM</NativeSelectOption>
                    </NativeSelect>
                  </label>
                  <small className="prototype-note">Preview setting only—background notifications come with the native app.</small>
                </div>
                {introDraft && (
                  <div className="intro-review">
                    <span><Sparkles /> AI draft · review required</span>
                    <p>Hi {profile.name}—I noticed we both enjoy {profile.tags[0].toLowerCase()}. I’d love to hear what got you into it.</p>
                    <div>
                      <button onClick={() => setIntroDraft(false)}>Discard</button>
                      <button onClick={() => {
                        onSendIntro(viewerName, profile.name, suggestedIntro);
                        setIntroSent(true);
                        setIntroDraft(false);
                        answerVoice(`Your introduction to ${profile.name} was sent after your confirmation.`);
                      }}><Send /> Confirm &amp; send</button>
                    </div>
                  </div>
                )}
                {introSent && <div className="voice-success"><Check /> Introduction sent with your approval</div>}
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
  const [hiddenIos, setHiddenIos] = useState(false);
  const [hiddenAndroid, setHiddenAndroid] = useState(false);
  const [mediaIndexIos, setMediaIndexIos] = useState(0);
  const [mediaIndexAndroid, setMediaIndexAndroid] = useState(0);
  const [radius, setRadius] = useState(5);
  const [introRequest, setIntroRequest] = useState<IntroRequest | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const matched = decisionIos === "liked" && decisionAndroid === "liked";
  const chatOpen = matched || introRequest?.status === "accepted";
  const sendIntro = (from: string, to: string, text: string) => {
    setIntroRequest({ from, to, text, status: "pending" });
    setMessages([{ id: `intro-${Date.now()}`, sender: from, text }]);
  };
  const acceptIntro = () =>
    setIntroRequest((request) => request ? { ...request, status: "accepted" } : request);
  const declineIntro = () =>
    setIntroRequest((request) => request ? { ...request, status: "declined" } : request);
  const sendMessage = (sender: string, text: string) => {
    if (!text.trim() || !chatOpen) return;
    setMessages((items) => [
      ...items,
      { id: `message-${Date.now()}-${items.length}`, sender, text: text.trim() },
    ]);
  };
  const sharedPreview = {
    activeTab,
    onTab: setActiveTab,
    theme,
    onTheme: setTheme,
    showReason,
    onReason: () => setShowReason(!showReason),
    radius,
    onRadius: setRadius,
    chatOpen,
    introRequest,
    onSendIntro: sendIntro,
    onAcceptIntro: acceptIntro,
    onDeclineIntro: declineIntro,
    messages,
    onSendMessage: sendMessage,
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
            A connection starts <em>with you.</em>
          </h1>
          <p>
            Explore the mobile preview. Switch pages and themes, browse profiles,
            and try an introduction between Arjun and Maya.
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
            hidden={hiddenIos}
            onHidden={setHiddenIos}
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
            hidden={hiddenAndroid}
            onHidden={setHiddenAndroid}
            mediaIndex={mediaIndexAndroid}
            onMediaIndex={setMediaIndexAndroid}
            {...sharedPreview}
          />
        </div>
        <div className="platform-notes">
          <div>
            <strong>Step 1 · Arjun messages Maya</strong>
            <span>
              Tap the star on iPhone, personalize the introduction, and send
              it for Maya to review.
            </span>
          </div>
          <div>
            <strong>Step 2 · Maya accepts and replies</strong>
            <span>
              Open Requests on Android, accept Arjun’s introduction, and reply
              from the shared conversation.
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
