"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Bell,
  Bookmark,
  Bot,
  BriefcaseBusiness,
  CakeSlice,
  CalendarHeart,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock3,
  Compass,
  CreditCard,
  Crown,
  EyeOff,
  Eye,
  Flag,
  FileText,
  Globe2,
  GraduationCap,
  Heart,
  Languages,
  LocateFixed,
  LockKeyhole,
  LogOut,
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
  SlidersHorizontal,
  Smartphone,
  Star,
  UserPlus,
  UserRound,
  UsersRound,
  UserX,
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
import {
  addBoostCredits,
  canSendPreMatchIntroduction,
  consumeBoostCredit,
} from "@/lib/product-rules";

const themes = [
  { id: "sunrise", name: "Sunrise", note: "Warm & human", color: "#f56300" },
  { id: "bloom", name: "Bloom", note: "Playful & social", color: "#d93675" },
  {
    id: "midnight",
    name: "Midnight",
    note: "Premium & cinematic",
    color: "#000000",
  },
  { id: "paper", name: "Evergreen", note: "Minimal & direct", color: "#147d64" },
] as const;
type Theme = (typeof themes)[number]["id"];
type Tab = "discover" | "explore" | "likes" | "chats" | "you";
type Platform = "ios" | "android";
type AccountPanel = "settings" | "preferences" | "membership" | "registration" | "mila-lab" | "search" | null;
type WomanProfileId = "maya" | "priya" | "hana" | "sofia";
type ManProfileId = "arjun" | "marcus" | "leo" | "ravi";
type DemoProfileId = "maya" | "arjun" | "priya" | "marcus" | "hana" | "leo" | "sofia" | "amira" | "yuki" | "ravi" | "theo" | "mateo";
type DiscoveryMode = "nearby" | "global" | "longterm" | "week" | "culture" | "voice" | "search";
type DemoProfile = {
  id: DemoProfileId;
  photoId?: "maya" | "arjun" | "priya" | "marcus" | "hana" | "leo";
  name: string;
  age: number;
  job: string;
  city: string;
  distance: number;
  distanceLabel?: string;
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

const membershipPlans = [
  { id: "weekly", label: "Weekly", total: "$9.99", cadence: "per week", note: "Try it short-term" },
  { id: "monthly", label: "Monthly", total: "$24.99", cadence: "per month", note: "Flexible" },
  { id: "six-month", label: "6 months", total: "$89.94", cadence: "$14.99 / month", note: "Save 40%" },
  { id: "yearly", label: "Yearly", total: "$119.88", cadence: "$9.99 / month", note: "Best value · Save 60%" },
] as const;

const boostPackages = [
  { id: "one", count: 1, price: "$7.99", unit: "$7.99 each" },
  { id: "five", count: 5, price: "$29.99", unit: "$6.00 each" },
  { id: "ten", count: 10, price: "$49.99", unit: "$5.00 each" },
] as const;

const preferenceFields = [
  { key: "relationship", label: "Relationship goal", options: ["Long-term", "Marriage-minded", "Open to exploring"] },
  { key: "languages", label: "Languages", options: ["Any", "English", "English + Hindi", "English + Spanish"] },
  { key: "family", label: "Family plans", options: ["Open", "Wants children", "Doesn’t want children", "Unsure"] },
  { key: "communication", label: "Communication style", options: ["Any", "Balanced", "Frequent", "In person first"] },
  { key: "pets", label: "Pets", options: ["Any", "Likes pets", "Has pets", "No pets"] },
  { key: "education", label: "Education", options: ["Any", "College", "Graduate degree", "Trade school"] },
  { key: "smoking", label: "Smoking", options: ["Any", "Never", "Occasionally"] },
  { key: "drinking", label: "Drinking", options: ["Any", "Never", "Socially"] },
  { key: "workout", label: "Activity", options: ["Any", "Sometimes", "Often"] },
] as const;

const registrationSteps = [
  {
    title: "Create your account",
    note: "Only the essentials to start.",
    items: [["Phone or email", "Required"], ["Birthday", "Required · always private"], ["Name and pronouns", "Name required · pronouns optional"]],
  },
  {
    title: "Build trust early",
    note: "Safety choices before discovery.",
    items: [["Photo + liveness check", "Required"], ["Community commitment", "Required"], ["Block contacts", "Optional and private"]],
  },
  {
    title: "Show who you are",
    note: "A strong profile without a long form.",
    items: [["3 clear photos", "Required"], ["Short introduction", "Required"], ["Voice or video prompt", "Optional"], ["Work and education", "Optional"]],
  },
  {
    title: "Choose who you meet",
    note: "Set intent first; fine-tune later.",
    items: [["Relationship goal", "Required"], ["Who you want to meet", "Required"], ["Age and distance", "Required"], ["Dealbreakers", "Optional"]],
  },
  {
    title: "Review and go live",
    note: "You control visibility and notifications.",
    items: [["Profile preview", "Review"], ["Location precision", "Choose city or approximate"], ["Notification schedule", "Optional"], ["Terms and privacy", "Required"]],
  },
] as const;

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
  sofia: {
    id: "sofia", photoId: "maya", name: "Sofia", age: 30, job: "Service designer", city: "Toronto, Canada", distance: 356,
    distanceLabel: "Across borders", languages: ["English", "Portuguese"], tags: ["Film festivals", "Long-term"],
    about: "Service designer who collects neighborhood stories, plans trips around film festivals and always finds the best small coffee shop.",
    prompt: "Tell me which city you would revisit tomorrow and the meal you would order first.",
  },
  amira: {
    id: "amira", photoId: "priya", name: "Amira", age: 31, job: "Public health researcher", city: "London, UK", distance: 3460,
    distanceLabel: "Across borders", languages: ["English", "Arabic"], tags: ["Museum Sundays", "Marriage-minded"],
    about: "Public health researcher, curious traveler and enthusiastic host of long Sunday lunches with friends from everywhere.",
    prompt: "My favorite way to know a place is through its markets, museums and family recipes.",
  },
  yuki: {
    id: "yuki", photoId: "hana", name: "Yuki", age: 29, job: "Documentary editor", city: "Tokyo, Japan", distance: 6740,
    distanceLabel: "Across borders", languages: ["Japanese", "English"], tags: ["Documentaries", "Slow travel"],
    about: "Documentary editor who loves quiet listening bars, early train journeys and conversations that make the world feel smaller.",
    prompt: "I will trade you one hidden Tokyo favorite for one place that matters to you.",
  },
  ravi: {
    id: "ravi", photoId: "arjun", name: "Ravi", age: 32, job: "Renewable energy lead", city: "Vancouver, Canada", distance: 2420,
    distanceLabel: "Across borders", languages: ["English", "Hindi"], tags: ["Mountain weekends", "Long-term"],
    about: "Renewable energy lead who spends weekends near the mountains and cooks an ambitious dinner after every hike.",
    prompt: "Choose our first adventure: a coastal trail, a tiny restaurant or a live show.",
  },
  theo: {
    id: "theo", photoId: "marcus", name: "Theo", age: 33, job: "Urban architect", city: "Paris, France", distance: 3630,
    distanceLabel: "Across borders", languages: ["French", "English"], tags: ["Architecture", "Live jazz"],
    about: "Urban architect, amateur pianist and patient explorer of old streets, new ideas and very small music venues.",
    prompt: "I can plan a walk around a city, but the best part should be unplanned.",
  },
  mateo: {
    id: "mateo", photoId: "leo", name: "Mateo", age: 31, job: "Publishing editor", city: "Mexico City, Mexico", distance: 2090,
    distanceLabel: "Across borders", languages: ["Spanish", "English"], tags: ["Bookshops", "Home cooking"],
    about: "Publishing editor, home cook and regular at independent bookshops who believes translation brings people closer.",
    prompt: "Bring a favorite book; I will bring the tacos and a walking route.",
  },
};

const discoveryProfiles: Record<Platform, DemoProfile[]> = {
  ios: [demoProfiles.maya, demoProfiles.priya, demoProfiles.hana],
  android: [demoProfiles.arjun, demoProfiles.marcus, demoProfiles.leo],
};

const globalDiscoveryProfiles: Record<Platform, DemoProfile[]> = {
  ios: [demoProfiles.sofia, demoProfiles.amira, demoProfiles.yuki],
  android: [demoProfiles.ravi, demoProfiles.theo, demoProfiles.mateo],
};

const curatedDiscoveryProfiles: Record<Exclude<DiscoveryMode, "nearby" | "search">, Record<Platform, DemoProfile[]>> = {
  global: globalDiscoveryProfiles,
  longterm: {
    ios: [demoProfiles.priya, demoProfiles.maya, demoProfiles.amira],
    android: [demoProfiles.leo, demoProfiles.arjun, demoProfiles.ravi],
  },
  week: {
    ios: [demoProfiles.hana, demoProfiles.sofia, demoProfiles.maya],
    android: [demoProfiles.marcus, demoProfiles.mateo, demoProfiles.arjun],
  },
  culture: {
    ios: [demoProfiles.amira, demoProfiles.priya, demoProfiles.maya],
    android: [demoProfiles.mateo, demoProfiles.ravi, demoProfiles.leo],
  },
  voice: {
    ios: [demoProfiles.yuki, demoProfiles.hana, demoProfiles.sofia],
    android: [demoProfiles.theo, demoProfiles.leo, demoProfiles.ravi],
  },
};

const discoveryModeLabels: Record<DiscoveryMode, string> = {
  nearby: "Nearby",
  global: "Across borders",
  longterm: "Long-term love",
  week: "Free this week",
  culture: "Culture & roots",
  voice: "Voice first",
  search: "Search results",
};

const scenarioWomen = [demoProfiles.maya, demoProfiles.priya, demoProfiles.hana, demoProfiles.sofia] as const;
const scenarioMen = [demoProfiles.arjun, demoProfiles.marcus, demoProfiles.leo, demoProfiles.ravi] as const;

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
const signatureNavigation = [
  { id: "discover", label: "Discover", icon: Compass },
  { id: "likes", label: "Likes", icon: Heart },
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "you", label: "You", icon: UserRound },
] as const;

const featureGroups = [
  {
    label: "Phase 1 · Trusted foundation",
    timing: "0–6 months",
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
    label: "Phase 2 · AI assistance",
    timing: "7–18 months",
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
    label: "Phase 3 · Mila advantage",
    timing: "Years 2–5",
    features: [
      [
        "Relationship Journey",
        "Mutual progress from introduction to a safe date.",
        CalendarHeart,
      ],
      [
        "Boundary Passport",
        "Private consent and communication preferences.",
        ShieldCheck,
      ],
      [
        "Reciprocal fairness",
        "Balanced exposure instead of popularity-only ranking.",
        UsersRound,
      ],
      [
        "Life Change Mode",
        "Adjust dating pace for travel, relocation or a break.",
        Globe2,
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
  testing,
}: {
  testing: boolean;
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
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); }, []);
  const suppressClick = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>(initialProfile.distance > 100 ? "global" : "nearby");
  const [discoveryHistory, setDiscoveryHistory] = useState<Array<{
    index: number;
    profileId: DemoProfile["id"];
    action: "liked" | "passed" | "intro" | "next";
  }>>([]);
  const [cardDecision, setCardDecision] = useState<"idle" | "liked" | "passed" | "intro">("idle");
  const [discoverNotice, setDiscoverNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
  const [accountPanel, setAccountPanel] = useState<AccountPanel>(null);
  const [membershipView, setMembershipView] = useState<"plans" | "boosts">("plans");
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [selectedBoost, setSelectedBoost] = useState("five");
  const [purchaseNotice, setPurchaseNotice] = useState("");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [pendingPremiumAction, setPendingPremiumAction] = useState<"intro" | null>(null);
  const [boostCredits, setBoostCredits] = useState(0);
  const [boostTime, setBoostTime] = useState("Now");
  const [boostActive, setBoostActive] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(0);
  const [interestedIn, setInterestedIn] = useState("Women");
  const [ageMin, setAgeMin] = useState(26);
  const [ageMax, setAgeMax] = useState(38);
  const [includeFarther, setIncludeFarther] = useState(true);
  const [includeOutsideAge, setIncludeOutsideAge] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasBioOnly, setHasBioOnly] = useState(true);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, string>>({
    relationship: "Long-term",
    languages: "Any",
    family: "Open",
    communication: "Balanced",
    pets: "Any",
    education: "Any",
    smoking: "Never",
    drinking: "Socially",
    workout: "Any",
  });
  const [safeDateOpen, setSafeDateOpen] = useState(false);
  const [datePlanSaved, setDatePlanSaved] = useState(false);
  const [connectionCapacity, setConnectionCapacity] = useState(4);
  const [lifeMode, setLifeMode] = useState("Ready to date");
  const [voiceMessagesAllowed, setVoiceMessagesAllowed] = useState(true);
  const [videoCallsAllowed, setVideoCallsAllowed] = useState(true);
  const [locationSharingAllowed, setLocationSharingAllowed] = useState(false);
  const [visibilityMode, setVisibilityMode] = useState<"Standard" | "Incognito">("Standard");
  const [rankingMode, setRankingMode] = useState<"Balanced" | "Recently active">("Balanced");
  const [verifiedChatOnly, setVerifiedChatOnly] = useState(false);
  const [messageReview, setMessageReview] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoplayVideos, setAutoplayVideos] = useState(true);
  const [activeStatus, setActiveStatus] = useState(true);
  const [pauseLength, setPauseLength] = useState("Not paused");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(`mila-liked-${platform}-${viewerName}`);
      if (stored) setLikedProfileIds(JSON.parse(stored));
    } catch {}
    setLikesLoaded(true);
  }, [platform, viewerName]);
  useEffect(() => {
    if (!likesLoaded) return;
    window.localStorage.setItem(`mila-liked-${platform}-${viewerName}`, JSON.stringify(likedProfileIds));
  }, [likedProfileIds, likesLoaded, platform, viewerName]);
  const [birthDate, setBirthDate] = useState("1994-10-08");
  const [gender, setGender] = useState(platform === "ios" ? "Man" : "Woman");
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
  const localQueue = discoveryProfiles[platform];
  const strictNearbyQueue = localQueue.filter((person) => person.distance <= radius);
  const selectedLocalProfile = localQueue.find((person) => person.id === initialProfile.id);
  const nearbyQueue = selectedLocalProfile && !strictNearbyQueue.some((person) => person.id === selectedLocalProfile.id)
    ? [selectedLocalProfile, ...strictNearbyQueue]
    : strictNearbyQueue;
  const searchableProfiles = [...localQueue, ...globalDiscoveryProfiles[platform]];
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const searchQueue = searchableProfiles.filter((person) =>
    !normalizedSearch || [person.name, person.city, person.job, ...person.tags, ...person.languages]
      .some((value) => value.toLocaleLowerCase().includes(normalizedSearch)),
  );
  const selectedQueue = discoveryMode === "nearby"
    ? nearbyQueue
    : discoveryMode === "search"
      ? searchQueue
      : curatedDiscoveryProfiles[discoveryMode][platform];
  const queue = selectedQueue.length ? selectedQueue : [localQueue[0]];
  const safeDiscoveryIndex = queue.length ? discoveryIndex % queue.length : 0;
  const profile = queue[safeDiscoveryIndex] || initialProfile;
  const profilePhotoId = profile.photoId ?? profile.id;
  useEffect(() => {
    const nextIndex = queue.findIndex((person) => person.id === initialProfile.id);
    setDiscoveryIndex(nextIndex >= 0 ? nextIndex : 0);
    onMediaIndex(0);
  }, [initialProfile.id, platform]);
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
  const selfProfile = Object.values(demoProfiles).find((person) => person.name === viewerName)
    ?? (platform === "ios" ? demoProfiles.arjun : demoProfiles.maya);
  const introQuality = introMessage.trim().length >= 60
    ? "Strong · personal and specific"
    : introMessage.trim().length >= 25
      ? "Good start · add one thoughtful question"
      : "Add a detail from the profile";
  const selectedMembershipPlan = membershipPlans.find((item) => item.id === selectedPlan) ?? membershipPlans[3];
  const selectedBoostPackage = boostPackages.find((item) => item.id === selectedBoost) ?? boostPackages[1];
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
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (action === "next" && queue.length < 2) {
      setDiscoverNotice("Only one profile within this distance. Increase your distance to meet more people.");
      return;
    }
    const actedOn = profile.name;
    if (action === "liked") {
      setLikedProfileIds((current) =>
        current.includes(profile.id) ? current : [...current, profile.id],
      );
    }
    setDiscoveryHistory((items) => [...items, {
      index: discoveryIndex,
      profileId: profile.id,
      action,
    }]);
    if (action !== "next") onDecision(action);
    setCardDecision(action === "next" ? "idle" : action);
    setDiscoverNotice(
      action === "liked" ? `You liked ${actedOn}` :
      action === "intro" ? `Introduction sent to ${actedOn}` :
      action === "passed" ? `Passed on ${actedOn}` : `Showing another profile`,
    );
    advanceTimer.current = setTimeout(() => {
      setDiscoveryIndex((current) => (current + 1) % queue.length);
      onMediaIndex(0);
      setCardDecision("idle");
      advanceTimer.current = null;
      if (queue.length < 2) setDiscoverNotice(`${action === "liked" ? "Like saved." : "You’ve reached the end."} Increase your distance to meet more people.`);
    }, action === "liked" ? 700 : action === "intro" ? 500 : 260);
  };
  const undoProfile = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (isLiked) {
      setLikedProfileIds((current) => current.filter((id) => id !== profile.id));
      setDiscoveryHistory((items) => {
        const previous = items.at(-1);
        return previous?.profileId === profile.id && previous.action === "liked"
          ? items.slice(0, -1)
          : items;
      });
      onDecision("idle");
      setCardDecision("idle");
      setDiscoverNotice(`Like removed from ${profile.name}`);
      return;
    }
    const previous = discoveryHistory.at(-1);
    if (previous === undefined) {
      setDiscoverNotice("Nothing to undo yet");
      return;
    }
    const restoredIndex = queue.findIndex((person) => person.id === previous.profileId);
    setDiscoveryIndex(restoredIndex >= 0 ? restoredIndex : previous.index);
    if (previous.action === "liked") {
      setLikedProfileIds((current) => current.filter((id) => id !== previous.profileId));
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
      if (Math.abs(y) > 58) advanceProfile("next");
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
  const cycleRadius = () => {
    if (discoveryMode !== "nearby") {
      setDiscoveryMode("nearby");
      setDiscoveryIndex(0);
      onMediaIndex(0);
      setDiscoverNotice("Nearby selected · Using your distance preference");
      return;
    }
    const nextRadius = radius === 5 ? 10 : radius === 10 ? 25 : 5;
    onRadius(nextRadius);
    setDiscoveryMode("nearby");
    setDiscoveryIndex(0);
    onMediaIndex(0);
    const nextCount = localQueue.filter((person) => person.distance <= nextRadius).length;
    setDiscoverNotice(`Within ${nextRadius} mi · ${nextCount || 1} profile${nextCount === 1 ? "" : "s"}`);
  };
  const openExploreFeed = (label: string) => {
    const modesByLabel: Record<string, DiscoveryMode> = {
      "Long-term love": "longterm",
      "Free this week": "week",
      "New nearby": "nearby",
      "Across borders": "global",
      "Culture & roots": "culture",
      "Voice first": "voice",
    };
    const nextMode = modesByLabel[label] ?? "nearby";
    setDiscoveryMode(nextMode);
    setDiscoveryIndex(0);
    onMediaIndex(0);
    const resultCount = nextMode === "nearby"
      ? Math.max(1, nearbyQueue.length)
      : nextMode === "search"
        ? searchQueue.length
        : curatedDiscoveryProfiles[nextMode][platform].length;
    setDiscoverNotice(`${label} selected · ${resultCount} profile${resultCount === 1 ? "" : "s"}`);
    onTab("discover");
  };
  const openIntroductionComposer = () => {
    setIntroMessage(suggestedIntro);
    setConnectReview(true);
    setConnectPage(mediaIndex);
    setIntroComposerOpen(true);
    window.requestAnimationFrame(() => showConnectPage(mediaIndex, "auto"));
  };
  const startIntroduction = () => {
    if (!canSendPreMatchIntroduction(hasSubscription)) {
      setPendingPremiumAction("intro");
      setMembershipView("plans");
      setPurchaseNotice("Mila Plus is required to send an introduction before matching.");
      setAccountPanel("membership");
      return;
    }
    openIntroductionComposer();
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
        answerVoice(`${profile.name}, ${profile.age}. ${profile.job}, in ${profile.city}, ${profile.distanceLabel ?? `${profile.distance} miles away`}. ${profile.about} Would you like to like this profile, draft an introduction, hear the next profile, or go to messages?`);
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
        {platform === "ios" ? "iPhone" : "Android"} · viewing {initialProfile.name}
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
            <button aria-label="Search profiles" onClick={() => setAccountPanel("search")}>
              <Search />
            </button>
            <button aria-label="Discovery filters" onClick={() => setAccountPanel("preferences")}>
              <SlidersHorizontal />
            </button>
          </div>
          <div className="screen-content">
            {!testing && (activeTab === "discover" || activeTab === "explore") && (
              <div className="discovery-segments" role="group" aria-label="Discover view">
                <button aria-pressed={activeTab === "discover"} onClick={() => onTab("discover")}>For you</button>
                <button aria-pressed={activeTab === "explore"} onClick={() => onTab("explore")}>Explore interests</button>
              </div>
            )}
            {activeTab === "discover" && (
              <div className="discover-screen">
                {discoverNotice && <div className="discover-notice" role="status"><Check /> {discoverNotice}</div>}
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
                        if (!e.isPrimary || e.button !== 0) return;
                        const target = e.target as Element;
                        if (target.closest("button") && !target.closest(".media-prev,.media-next")) return;
                        dragStart.current = { x: e.clientX, y: e.clientY };
                        dragOffset.current = { x: 0, y: 0 };
                        target.setPointerCapture(e.pointerId);
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
                      onPointerCancel={() => {
                        dragStart.current = null;
                        dragOffset.current = { x: 0, y: 0 };
                        setDragX(0);
                        setDragY(0);
                      }}
                      onClickCapture={(e) => {
                        if (!suppressClick.current) return;
                        e.preventDefault();
                        e.stopPropagation();
                        suppressClick.current = false;
                      }}
                    >
                    <div className={`profile-image profile-${profilePhotoId} media-${mediaIndex}`}>
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
                            {discoveryMode === "global" ? <Globe2 /> : discoveryMode === "nearby" ? <LocateFixed /> : <Compass />}
                            {calmMode
                              ? `Calm pick · ${discoveryModeLabels[discoveryMode]}`
                              : `${discoveryModeLabels[discoveryMode]} · ${queue.length} profile${queue.length === 1 ? "" : "s"}`}
                          </span>
                          <button onClick={cycleRadius} aria-label={discoveryMode === "nearby" ? `Change distance from ${radius} miles` : "Return to nearby profiles"}>
                            {discoveryMode === "nearby" ? `Within ${radius} mi` : discoveryMode === "global" ? "Worldwide" : discoveryMode === "search" ? "Clear search" : "Curated"} <ChevronDown />
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
                        <div className="browse-guide">
                          <span>{safeDiscoveryIndex + 1} / {queue.length} · Swipe up to browse</span>
                          <button onClick={() => advanceProfile("next")} aria-label="Next profile">Next <ChevronRight /></button>
                        </div>
                        {(Math.abs(dragX) > 24 || Math.abs(dragY) > 24) && (
                          <div className="gesture-feedback">{Math.abs(dragY) > Math.abs(dragX) ? "NEXT" : dragX > 0 ? "LIKE" : "PASS"}</div>
                        )}
                        <div className="profile-details">
                          <div className="name-line">
                            <h2>{profile.name}, {profile.age}</h2>
                            <BadgeCheck />
                          </div>
                          <p>
                            <BriefcaseBusiness /> {profile.job}
                          </p>
                          <p>
                            <MapPin /> {profile.city} · {profile.distanceLabel ?? `${profile.distance} miles away`}
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
                          <button className="action-pass" aria-label="Pass" onClick={() => advanceProfile("passed")}>
                            <X />
                            {!testing && <span>Pass</span>}
                          </button>
                          <button className="action-undo" aria-label="Undo" onClick={undoProfile}>
                            <RotateCcw />
                          </button>
                          <button
                            className="priority"
                            aria-label={`Send intro to ${profile.name}`}
                            onClick={startIntroduction}
                          >
                            {testing ? <Star /> : <Send />}
                            <span>{testing ? "Send intro" : "Connect"}</span>
                          </button>
                          <button
                            className={`like ${isLiked ? "is-liked" : ""}`}
                            aria-label={isLiked ? `${profile.name} liked` : `Like ${profile.name}`}
                            aria-pressed={isLiked}
                            disabled={isLiked}
                            onClick={() => advanceProfile("liked")}
                          >
                            <Heart fill={isLiked ? "currentColor" : "none"} />
                            {!testing && <span>{isLiked ? "Liked" : "Like"}</span>}
                          </button>
                        </div>
                      </div>
                    </article>
                    {introComposerOpen && (
                      <div className={`intro-composer ${connectReview ? "connect-review" : ""}`} role="dialog" aria-modal="true" aria-labelledby={`${platform}-intro-title`}>
                        {connectReview && <button className="connect-close" onClick={() => { setIntroComposerOpen(false); setConnectReview(false); }} aria-label="Close connection composer"><X /></button>}
                        <span className={`intro-avatar profile-${profilePhotoId}`} />
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
                                  className={`connect-page connect-page-${index} ${index < 4 ? `connect-page-media profile-${profilePhotoId} media-${index}` : ""}`}
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
                        <div className="intro-feedback" aria-live="polite">
                          <span><Sparkles /> {introQuality}</span>
                          <small>{introMessage.length}/240</small>
                        </div>
                        <div className="intent-agreement">
                          <Check />
                          <span><b>Intent aligns</b><small>You both selected a long-term relationship. Confirm details together in chat.</small></span>
                        </div>
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
              <div className="inner-screen explore-screen">
                <span className="screen-kicker">Discover</span>
                <h2>Find your kind of connection.</h2>
                <p>Explore people with similar relationship goals.</p>
                <div className="explore-grid">
                  <button className="explore-longterm" onClick={() => openExploreFeed("Long-term love")}>
                    <span className="explore-art symbol-longterm" aria-hidden="true" />
                    <span className="explore-copy">
                      <b>Long-term love</b>
                      <small>1.3K</small>
                    </span>
                  </button>
                  <button className="explore-week" onClick={() => openExploreFeed("Free this week")}>
                    <span className="explore-art symbol-week" aria-hidden="true" />
                    <span className="explore-copy">
                      <b>Free this week</b>
                      <small>180</small>
                    </span>
                  </button>
                  <button className="explore-nearby" onClick={() => openExploreFeed("New nearby")}>
                    <span className="explore-art symbol-nearby" aria-hidden="true" />
                    <span className="explore-copy">
                      <b>New nearby</b>
                      <small>286</small>
                    </span>
                  </button>
                  <button className="explore-global" onClick={() => openExploreFeed("Across borders")}>
                    <span className="explore-art symbol-global" aria-hidden="true" />
                    <span className="explore-copy">
                      <b>Across borders</b>
                      <small>640</small>
                    </span>
                  </button>
                  <button className="explore-culture" onClick={() => openExploreFeed("Culture & roots")}>
                    <span className="explore-art symbol-culture" aria-hidden="true" />
                    <span className="explore-copy">
                      <b>Culture & roots</b>
                      <small>512</small>
                    </span>
                  </button>
                  <button className="explore-voice" onClick={() => openExploreFeed("Voice first")}>
                    <span className="explore-art symbol-voice" aria-hidden="true" />
                    <span className="explore-copy">
                      <b>Voice first</b>
                      <small>96</small>
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
                        <span className={`like-avatar target-mini profile-${profilePhotoId}`}>{profile.name[0]}</span>
                        <span>
                          <b>{profile.name}, {profile.age}</b>
                          <small>{matched ? "It’s a match — chat is open" : "Liked you just now"}</small>
                        </span>
                        <em>{matched ? "Matched" : "New"}</em>
                      </button>
                    )}
                    <div className="people-photo-grid">
                      {queue.map((person, index) => (
                        <button className={`people-photo profile-${person.photoId ?? person.id} media-0`} key={person.id}
                          onClick={() => { setDiscoveryIndex(index); onMediaIndex(0); onProfileOpen(true); }}
                          aria-label={`View ${person.name}'s profile`}>
                          <span className="people-photo-copy"><b>{person.name}, {person.age}</b><small>{person.city} · {person.distanceLabel ?? `${person.distance} mi`}</small></span>
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
                        <span className={`like-avatar target-mini profile-${likedProfile.photoId ?? likedProfile.id}`}>{likedProfile.name[0]}</span>
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
                          <span className={`like-avatar target-mini profile-${favoriteProfile.photoId ?? favoriteProfile.id}`}>{favoriteProfile.name[0]}</span>
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
                  <span className={`mini-avatar target-mini profile-${profilePhotoId}`}>{profile.name[0]}</span>
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
                  <div className="relationship-journey" aria-label="Relationship journey">
                    <header><span><CalendarHeart /> Relationship Journey</span><small>Private shared progress</small></header>
                    <div>
                      <span className="complete"><i>1</i><b>Connected</b></span>
                      <span className={messages.length > 1 ? "complete" : "current"}><i>2</i><b>Talking</b></span>
                      <span className={datePlanSaved ? "complete" : "current"}><i>3</i><b>Planning</b></span>
                      <span className={datePlanSaved ? "current" : ""}><i>4</i><b>Date</b></span>
                    </div>
                  </div>
                )}
                {chatOpen && (
                  <details className="compatibility-conversations">
                    <summary><Sparkles /> Conversation cards <ChevronDown /></summary>
                    <p>Choose a topic when it feels natural. Answers stay in this conversation.</p>
                    <div><button>Communication</button><button>Family plans</button><button>Relocation</button><button>Money values</button></div>
                  </details>
                )}
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
                {!testing && <a className="testing-link" href="/testing">Open demo testing studio</a>}
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
                  <span><b>Calm Mode</b><small>{calmMode ? "On · One thoughtful recommendation at a time" : "Off · Browse the full recommendation queue"}</small></span>
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
                <h3 className="profile-settings-title">Account &amp; discovery</h3>
                <button className="setting-row setting-row-button settings-primary-link" onClick={() => setAccountPanel("settings")}>
                  <Settings2 />
                  <span>
                    <b>Settings &amp; safety</b>
                    <small>Account, visibility, messages and notifications</small>
                  </span>
                  <ChevronRight />
                </button>
                <button className="setting-row setting-row-button" onClick={() => setAccountPanel("preferences")}>
                  <SlidersHorizontal />
                  <span>
                    <b>Discovery preferences</b>
                    <small>{radius} mi · Ages {ageMin}–{ageMax} · {interestedIn}</small>
                  </span>
                  <ChevronRight />
                </button>
                <button className="setting-row setting-row-button" onClick={() => { setMembershipView("plans"); setPurchaseNotice(""); setAccountPanel("membership"); }}>
                  <Crown />
                  <span>
                    <b>Membership &amp; Boosts</b>
                    <small>{hasSubscription ? `Mila Plus active · ${boostCredits} Boost${boostCredits === 1 ? "" : "s"}` : "Compare plans and visibility boosts"}</small>
                  </span>
                  <ChevronRight />
                </button>
                <button className="setting-row setting-row-button" onClick={() => { setRegistrationStep(0); setAccountPanel("registration"); }}>
                  <UserPlus />
                  <span>
                    <b>Registration preview</b>
                    <small>5 short steps · required fields are clear</small>
                  </span>
                  <ChevronRight />
                </button>
                <button className="setting-row setting-row-button mila-lab-link" onClick={() => setAccountPanel("mila-lab")}>
                  <Sparkles />
                  <span>
                    <b>Mila relationship controls</b>
                    <small>Capacity, boundaries and Life Change Mode</small>
                  </span>
                  <ChevronRight />
                </button>
                <button className="setting-row setting-row-button" onClick={() => setAccountPanel("settings")}>
                  <ShieldCheck />
                  <span>
                    <b>Safety center</b>
                    <small>Verification, blocked contacts and date sharing</small>
                  </span>
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
          {profileOpen && (
            <section className="full-profile">
              <div className={`full-profile-hero profile-${profilePhotoId} media-${mediaIndex}`}>
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
                  aria-label={connectionPending ? `Introduction sent to ${profile.name}` : `Send introduction to ${profile.name}`}
                >
                  {connectionPending ? <Check /> : hasSubscription ? <Send /> : <Crown />}
                  {connectionPending ? "Intro sent" : "Send intro"}
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
                    <MapPin /> {profile.city} · {profile.distanceLabel ?? `${profile.distance} miles away`}
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
                {showReason && (
                  <div className="match-unknowns">
                    <span><b>Important unknowns</b><small>Useful topics for a real conversation</small></span>
                    <div><em>Preferred timeline</em><em>Family involvement</em><em>Relocation details</em></div>
                  </div>
                )}
                <section className="modern-profile-section about-profile-section">
                  <header><span>About</span><small>In their own words</small></header>
                  <p>{profile.about}</p>
                </section>
                <section className="profile-fact-grid" aria-label={`${profile.name} at a glance`}>
                  <span><BriefcaseBusiness /><small>Work</small><b>{profile.job}</b></span>
                  <span><GraduationCap /><small>Education</small><b>Bachelor’s degree</b></span>
                  <span><Ruler /><small>Height</small><b>170 cm</b></span>
                  <span><Languages /><small>Languages</small><b>{profile.languages.join(" + ")}</b></span>
                </section>
                <section className="modern-profile-section relationship-section">
                  <header><span>Relationship essentials</span><small>What matters most</small></header>
                  <div><Heart /><span><small>Looking for</small><b>Long-term relationship</b></span></div>
                  <div><UsersRound /><span><small>Family plans</small><b>Open to children</b></span></div>
                  <div><MessageCircle /><span><small>Communication</small><b>Balanced and direct</b></span></div>
                  <div><Globe2 /><span><small>Relocation</small><b>Open to discuss</b></span></div>
                </section>
                <section className="modern-profile-section prompt-profile-section">
                  <header><span>A personal prompt</span><small>Two truths and a tiny hill</small></header>
                  <blockquote>“{profile.prompt}”</blockquote>
                </section>
                <section className="modern-profile-section lifestyle-profile-section">
                  <header><span>{testing ? "Lifestyle & interests" : "Everyday life"}</span><small>At a glance</small></header>
                  <div className="full-tags">
                    <span>Never smokes</span><span>Drinks socially</span><span>Enjoys pets</span>
                    {profile.tags.map(tag => <span key={tag}>{tag}</span>)}
                    <span>Weekend travel</span>
                  </div>
                </section>
                {!testing && <section className="signature-photo-story">
                  <h3>Life in pictures</h3>
                  <div>{[0, 1, 2].map(index => <div key={index} role="img" aria-label={`${profile.name}, photo ${index + 1}`} className={`profile-${profilePhotoId} media-${index}`} />)}</div>
                </section>}
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
                  <X /> Maybe later
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
                  <Heart fill={isLiked ? "currentColor" : "none"} /> {isLiked ? "Liked" : "Like"}
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
          {accountPanel === "mila-lab" && (
            <section className="account-panel mila-lab-panel">
              <header className="account-panel-header">
                <button onClick={() => setAccountPanel(null)} aria-label="Close Mila relationship controls"><ArrowLeft /></button>
                <span><b>Relationship controls</b><small>Private settings that adapt Mila to your life</small></span>
                <button className="panel-save" onClick={() => { setProfileNotice("Relationship controls saved"); setAccountPanel(null); }}>Save</button>
              </header>
              <div className="account-panel-scroll">
                <div className="preference-summary lab-summary">
                  <Sparkles />
                  <span><b>Your pace, your boundaries</b><small>Mila uses these settings to reduce overload. They are never shown as a compatibility score.</small></span>
                </div>
                <section className="settings-card">
                  <label className="range-setting">
                    <span><b>Connection capacity</b><strong>{connectionCapacity} active</strong></span>
                    <input aria-label="Connection capacity" type="range" min="1" max="8" value={connectionCapacity} onChange={(event) => setConnectionCapacity(Number(event.target.value))} />
                    <small>When this limit is reached, Mila pauses new Intros and helps you focus on current conversations.</small>
                  </label>
                  <label className="select-setting"><span><b>Life Change Mode</b><small>Adjust recommendations without deleting your profile</small></span><NativeSelect aria-label="Life Change Mode" value={lifeMode} onChange={(event) => setLifeMode(event.target.value)}><NativeSelectOption>Ready to date</NativeSelectOption><NativeSelectOption>Recently relocated</NativeSelectOption><NativeSelectOption>Traveling</NativeSelectOption><NativeSelectOption>Limited availability</NativeSelectOption><NativeSelectOption>Taking a break</NativeSelectOption></NativeSelect></label>
                </section>
                <h3>Boundary Passport</h3>
                <section className="settings-card boundary-card">
                  <div className="toggle-setting"><span><b>Voice messages</b><small>Matches may send voice messages</small></span><Switch size="sm" checked={voiceMessagesAllowed} onCheckedChange={setVoiceMessagesAllowed} aria-label="Allow voice messages" /></div>
                  <div className="toggle-setting"><span><b>Video calls</b><small>Ask before starting an in-app video call</small></span><Switch size="sm" checked={videoCallsAllowed} onCheckedChange={setVideoCallsAllowed} aria-label="Allow video calls" /></div>
                  <div className="toggle-setting"><span><b>Live location</b><small>Off by default; sharing always expires</small></span><Switch size="sm" checked={locationSharingAllowed} onCheckedChange={setLocationSharingAllowed} aria-label="Allow temporary location sharing" /></div>
                </section>
                <p className="privacy-copy"><ShieldCheck /> These preferences are private. Mila shows a boundary only when another person attempts the related action.</p>
              </div>
            </section>
          )}
          {accountPanel === "settings" && (
            <section className="account-panel settings-hub-panel">
              <header className="account-panel-header">
                <button onClick={() => setAccountPanel(null)} aria-label="Close settings"><ArrowLeft /></button>
                <span><b>Settings &amp; safety</b><small>Simple controls, grouped by purpose</small></span>
                <button className="panel-save" onClick={() => { setProfileNotice("Settings saved"); setAccountPanel(null); }}>Done</button>
              </header>
              <div className="account-panel-scroll">
                <div className="settings-status-card">
                  <div className="settings-avatar">{viewerName.slice(0, 1)}</div>
                  <span><b>{viewerName}&apos;s account</b><small>Photo verified · Email verified</small></span>
                  <ShieldCheck />
                </div>

                <h3>Account</h3>
                <section className="settings-card settings-link-list">
                  <button><Smartphone /><span><b>Phone number</b><small>••• ••• ••90</small></span><ChevronRight /></button>
                  <button><MessageCircle /><span><b>Email</b><small>s••••••@gmail.com · Verified</small></span><ChevronRight /></button>
                  <button><UsersRound /><span><b>Connected accounts</b><small>Manage sign-in methods</small></span><ChevronRight /></button>
                  <button onClick={() => { setMembershipView("plans"); setAccountPanel("membership"); }}><CreditCard /><span><b>Payments &amp; subscriptions</b><small>{hasSubscription ? "Mila Plus active" : "Free plan"}</small></span><ChevronRight /></button>
                </section>

                <h3>Discovery &amp; visibility</h3>
                <section className="settings-card">
                  <button className="preference-link" onClick={() => setAccountPanel("preferences")}><SlidersHorizontal /><span><b>Who you want to meet</b><small>{radius} mi · Ages {ageMin}–{ageMax} · {interestedIn}</small></span><ChevronRight /></button>
                  <div className="toggle-setting"><span><b>Enable discovery</b><small>{hidden ? "Your profile is hidden; matched chats stay open." : "Your profile can appear to new people."}</small></span><Switch size="sm" checked={!hidden} onCheckedChange={(value) => onHidden(!value)} aria-label="Enable discovery" /></div>
                  <label className="select-setting"><span><b>Visibility</b><small>Incognito shows you only to people you like</small></span><NativeSelect aria-label="Profile visibility" value={visibilityMode} onChange={(event) => setVisibilityMode(event.target.value as "Standard" | "Incognito")}><NativeSelectOption>Standard</NativeSelectOption><NativeSelectOption>Incognito</NativeSelectOption></NativeSelect></label>
                  <label className="select-setting"><span><b>Recommendation order</b><small>Balanced protects against popularity-only ranking</small></span><NativeSelect aria-label="Recommendation order" value={rankingMode} onChange={(event) => setRankingMode(event.target.value as "Balanced" | "Recently active")}><NativeSelectOption>Balanced</NativeSelectOption><NativeSelectOption>Recently active</NativeSelectOption></NativeSelect></label>
                  <label className="select-setting"><span><b>Pause new connections</b><small>Current matches and chats stay available</small></span><NativeSelect aria-label="Pause new connections" value={pauseLength} onChange={(event) => { setPauseLength(event.target.value); if (event.target.value !== "Not paused") onHidden(true); }}><NativeSelectOption>Not paused</NativeSelectOption><NativeSelectOption>24 hours</NativeSelectOption><NativeSelectOption>72 hours</NativeSelectOption><NativeSelectOption>1 week</NativeSelectOption><NativeSelectOption>Until I return</NativeSelectOption></NativeSelect></label>
                </section>

                <h3>Privacy &amp; safer conversations</h3>
                <section className="settings-card">
                  <div className="toggle-setting"><span><b>Verified-only messages</b><small>Ask unverified matches to verify before messaging.</small></span><Switch size="sm" checked={verifiedChatOnly} onCheckedChange={setVerifiedChatOnly} aria-label="Verified-only messages" /></div>
                  <div className="toggle-setting"><span><b>Review harmful messages</b><small>Mila privately flags risky language before it is sent. You always decide.</small></span><Switch size="sm" checked={messageReview} onCheckedChange={setMessageReview} aria-label="Review harmful messages" /></div>
                  <button className="preference-link"><UserX /><span><b>Blocked contacts</b><small>Avoid people already in your contacts</small></span><ChevronRight /></button>
                  <button className="preference-link" onClick={() => setDatePlanSaved(true)}><CalendarHeart /><span><b>{datePlanSaved ? "Date plan ready" : "Share a date plan"}</b><small>{datePlanSaved ? "Trusted-contact link prepared for this preview" : "Send time, place and check-in to someone you trust"}</small></span><ChevronRight /></button>
                  <button className="preference-link"><ShieldCheck /><span><b>Safety center</b><small>Report, crisis help and safer dating guidance</small></span><ChevronRight /></button>
                  <button className="preference-link" onClick={() => setAccountPanel("mila-lab")}><LockKeyhole /><span><b>Boundary Passport</b><small>Voice, video and location permissions</small></span><ChevronRight /></button>
                </section>

                <h3>Notifications &amp; media</h3>
                <section className="settings-card">
                  <div className="toggle-setting"><span><b>Push notifications</b><small>Matches, messages and safety check-ins</small></span><Switch size="sm" checked={pushNotifications} onCheckedChange={setPushNotifications} aria-label="Push notifications" /></div>
                  <div className="toggle-setting"><span><b>Email</b><small>Account and product updates</small></span><Switch size="sm" checked={emailNotifications} onCheckedChange={setEmailNotifications} aria-label="Email notifications" /></div>
                  <div className="toggle-setting"><span><b>SMS</b><small>Security alerts only</small></span><Switch size="sm" checked={smsNotifications} onCheckedChange={setSmsNotifications} aria-label="SMS notifications" /></div>
                  <div className="toggle-setting"><span><b>Autoplay videos</b><small>Turn off to save data</small></span><Switch size="sm" checked={autoplayVideos} onCheckedChange={setAutoplayVideos} aria-label="Autoplay videos" /></div>
                  <div className="toggle-setting"><span><b>Show active status</b><small>Share a general recent activity signal</small></span><Switch size="sm" checked={activeStatus} onCheckedChange={setActiveStatus} aria-label="Show active status" /></div>
                  <button className="preference-link" onClick={beginVoice}><Bell /><span><b>Daily voice briefing</b><small>{briefScheduled ? `${briefTime} daily` : "Off · Configure in Mila Voice"}</small></span><ChevronRight /></button>
                </section>

                <h3>Help, privacy &amp; legal</h3>
                <section className="settings-card settings-link-list">
                  <button><MessageCircle /><span><b>Help &amp; support</b><small>Answers and contact options</small></span><ChevronRight /></button>
                  <button><ShieldCheck /><span><b>Community guidelines</b><small>Respect, consent and authentic behavior</small></span><ChevronRight /></button>
                  <button><FileText /><span><b>Privacy choices</b><small>Download data, cookies and permissions</small></span><ChevronRight /></button>
                  <button><FileText /><span><b>Terms &amp; policies</b><small>Plain-language summaries and full terms</small></span><ChevronRight /></button>
                </section>
                <div className="settings-account-actions">
                  <button onClick={() => setProfileNotice("Restore purchases checked — preview only")}>Restore purchases</button>
                  <button onClick={() => setProfileNotice("Share link prepared — preview only")}>Share Mila</button>
                  <button className="settings-logout" onClick={() => setProfileNotice("Logout confirmation would appear in the real app") }><LogOut /> Log out</button>
                  <button className="settings-delete" onClick={() => setProfileNotice("Account deletion requires identity confirmation and a cooling-off step") }><UserX /> Delete account</button>
                </div>
                <p className="settings-version">Mila preview · version 0.35</p>
              </div>
            </section>
          )}
          {accountPanel === "search" && (
            <section className="account-panel search-panel">
              <header className="account-panel-header">
                <button onClick={() => setAccountPanel(null)} aria-label="Close profile search"><ArrowLeft /></button>
                <span><b>Search profiles</b><small>Name, city, work, interest or language</small></span>
                <i>{searchQueue.length}</i>
              </header>
              <div className="account-panel-scroll">
                <div className="profile-search-field">
                  <Search />
                  <Input
                    aria-label="Search profiles"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Try London, films or Spanish"
                    autoFocus
                  />
                  {searchQuery && <button onClick={() => setSearchQuery("")} aria-label="Clear profile search"><X /></button>}
                </div>
                <p className="search-result-count" role="status">
                  {searchQueue.length} profile{searchQueue.length === 1 ? "" : "s"} found
                </p>
                {searchQueue.length ? (
                  <section className="search-profile-list">
                    {searchQueue.map((person, index) => (
                      <button
                        key={person.id}
                        aria-label={`View ${person.name} from ${person.city}`}
                        onClick={() => {
                          setDiscoveryMode("search");
                          setDiscoveryIndex(index);
                          onMediaIndex(0);
                          setDiscoverNotice(`Search selected · ${person.name} from ${person.city}`);
                          setAccountPanel(null);
                          onTab("discover");
                        }}
                      >
                        <span className={`search-profile-avatar profile-${person.photoId ?? person.id}`} />
                        <span><b>{person.name}, {person.age}</b><small>{person.city} · {person.job}</small></span>
                        <ChevronRight />
                      </button>
                    ))}
                  </section>
                ) : (
                  <div className="search-empty"><Search /><b>No profiles found</b><small>Try a city, language, interest or a shorter search.</small></div>
                )}
              </div>
            </section>
          )}
          {accountPanel === "preferences" && (
            <section className="account-panel preferences-panel">
              <header className="account-panel-header">
                <button onClick={() => setAccountPanel(null)} aria-label="Close discovery preferences"><ArrowLeft /></button>
                <span><b>Discovery preferences</b><small>Shape your recommendations</small></span>
                <button className="panel-save" onClick={() => { setProfileNotice("Discovery preferences saved"); setAccountPanel(null); }}>Save</button>
              </header>
              <div className="account-panel-scroll">
                <div className="preference-summary">
                  <SlidersHorizontal />
                  <span><b>Find people who fit your life</b><small>Strict filters narrow results. “Prefer” choices improve ranking without hiding good people.</small></span>
                </div>
                <section className="settings-card">
                  <button className="preference-link"><MapPin /><span><b>Location</b><small>Brooklyn, NY · approximate location</small></span><ChevronRight /></button>
                  <label className="range-setting">
                    <span><b>Maximum distance</b><strong>{radius} mi</strong></span>
                    <input aria-label="Maximum distance" type="range" min="1" max="100" value={radius} onChange={(event) => onRadius(Number(event.target.value))} />
                  </label>
                  <div className="toggle-setting"><span><b>Expand distance when needed</b><small>Show a few people farther away after local profiles.</small></span><Switch size="sm" checked={includeFarther} onCheckedChange={setIncludeFarther} /></div>
                  <label className="select-setting"><span><b>Interested in</b><small>Inclusive identity choices</small></span><NativeSelect value={interestedIn} onChange={(event) => setInterestedIn(event.target.value)}><NativeSelectOption>Women</NativeSelectOption><NativeSelectOption>Men</NativeSelectOption><NativeSelectOption>Everyone</NativeSelectOption><NativeSelectOption>Non-binary people</NativeSelectOption></NativeSelect></label>
                  <div className="dual-range-setting">
                    <span><b>Age range</b><strong>{ageMin}–{ageMax}</strong></span>
                    <label>Minimum age<input aria-label="Minimum age" type="range" min="18" max="70" value={ageMin} onChange={(event) => setAgeMin(Math.min(Number(event.target.value), ageMax - 1))} /></label>
                    <label>Maximum age<input aria-label="Maximum age" type="range" min="19" max="80" value={ageMax} onChange={(event) => setAgeMax(Math.max(Number(event.target.value), ageMin + 1))} /></label>
                  </div>
                  <div className="toggle-setting"><span><b>Expand age range when needed</b><small>Clearly label profiles outside your preference.</small></span><Switch size="sm" checked={includeOutsideAge} onCheckedChange={setIncludeOutsideAge} /></div>
                </section>
                <div className="preference-mode">
                  <span><b>How should Mila use these?</b><small>Applies to compatibility choices below.</small></span>
                  <div>{(["Must-have", "Prefer", "Open-minded"] as const).map((option) => <button key={option} aria-pressed={preferenceStrength === option} onClick={() => setPreferenceStrength(option)}>{option}</button>)}</div>
                </div>
                <h3>Compatibility</h3>
                <section className="settings-card filter-list">
                  {preferenceFields.map((field) => (
                    <label className="select-setting" key={field.key}>
                      <span><b>{field.label}</b><small>{preferenceStrength}</small></span>
                      <NativeSelect value={advancedFilters[field.key]} onChange={(event) => setAdvancedFilters((current) => ({ ...current, [field.key]: event.target.value }))}>
                        {field.options.map((option) => <NativeSelectOption key={option}>{option}</NativeSelectOption>)}
                      </NativeSelect>
                    </label>
                  ))}
                </section>
                <h3>Profile quality</h3>
                <section className="settings-card">
                  <div className="toggle-setting"><span><b>Has an introduction</b><small>Prioritize profiles that share their story.</small></span><Switch size="sm" checked={hasBioOnly} onCheckedChange={setHasBioOnly} /></div>
                  <div className="toggle-setting"><span><b>Verified profiles only</b><small>Verification is available to everyone.</small></span><Switch size="sm" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} /></div>
                </section>
                <p className="privacy-copy"><ShieldCheck /> Exact location, birthday and private dealbreakers are never shown on your public profile.</p>
              </div>
            </section>
          )}
          {accountPanel === "membership" && (
            <section className="account-panel membership-panel">
              <header className="account-panel-header">
                <button onClick={() => { setAccountPanel(null); setPendingPremiumAction(null); }} aria-label="Close membership"><ArrowLeft /></button>
                <span><b>Membership</b><small>Simple pricing, no hidden tiers</small></span>
                <i className="mila-plus-mark">m+</i>
              </header>
              <div className="account-panel-scroll">
                <div className="billing-tabs" role="tablist" aria-label="Purchase type">
                  <button role="tab" aria-selected={membershipView === "plans"} onClick={() => { setMembershipView("plans"); setPurchaseNotice(""); }}>Mila Plus</button>
                  <button role="tab" aria-selected={membershipView === "boosts"} onClick={() => { setMembershipView("boosts"); setPurchaseNotice(""); }}>Boosts</button>
                </div>
                {membershipView === "plans" ? <>
                  <div className={`membership-hero ${pendingPremiumAction === "intro" ? "paywall-hero" : ""}`}><Crown /><span><b>{pendingPremiumAction === "intro" ? "Send an introduction before matching" : hasSubscription ? "Mila Plus is active" : "More control, fewer interruptions"}</b><small>{pendingPremiumAction === "intro" ? `Choose a plan to continue your introduction to ${profile.name}. Likes and matched chats remain free.` : hasSubscription ? "Priority introductions and membership controls are ready." : "The same core dating and safety experience remains free."}</small></span></div>
                  <div className="plan-list">
                    {membershipPlans.map((plan) => <button key={plan.id} aria-pressed={selectedPlan === plan.id} onClick={() => { setSelectedPlan(plan.id); setPurchaseNotice(""); }}>
                      <i>{selectedPlan === plan.id && <Check />}</i>
                      <span><b>{plan.label}</b><small>{plan.note}</small></span>
                      <strong>{plan.total}<small>{plan.cadence}</small></strong>
                    </button>)}
                  </div>
                  <section className="benefit-card">
                    <h3>Included with every plan</h3>
                    {["See who likes you", "Unlimited rewinds", "Advanced preferences", "Global discovery", "2 priority introductions each week", "1 profile Boost each month", "Incognito profile controls", "No ads"].map((item) => <p key={item}><Check /> {item}</p>)}
                  </section>
                  <p className="safety-free"><ShieldCheck /><span><b>Safety is never a paid feature</b><small>Block, report, verification, privacy controls and date check-ins remain free.</small></span></p>
                </> : <>
                  <div className="membership-hero boost-hero"><Zap /><span><b>Be seen at the right time</b><small>One Boost raises your profile’s visibility nearby for 30 minutes.</small></span></div>
                  <section className={`boost-status ${boostActive ? "is-active" : ""}`}>
                    <div><Zap /><span><b>{boostActive ? "Boost active · 30:00" : `${boostCredits} Boost${boostCredits === 1 ? "" : "s"} available`}</b><small>{boostActive ? "Your profile is receiving priority visibility nearby." : "Buy a package, then start now or schedule it."}</small></span></div>
                    {!boostActive && <label>Start time<NativeSelect value={boostTime} onChange={(event) => setBoostTime(event.target.value)}><NativeSelectOption>Now</NativeSelectOption><NativeSelectOption>Tonight · 7 PM</NativeSelectOption><NativeSelectOption>Tonight · 9 PM</NativeSelectOption><NativeSelectOption>Tomorrow · 7 PM</NativeSelectOption></NativeSelect></label>}
                    <button disabled={!boostCredits || boostActive} onClick={() => {
                      const result = consumeBoostCredit(boostCredits);
                      if (!result.started) return;
                      setBoostCredits(result.remainingCredits);
                      setBoostActive(true);
                      setPurchaseNotice(boostTime === "Now" ? "Boost started for 30 minutes." : `Boost scheduled for ${boostTime}.`);
                    }}>{boostActive ? "Boost running" : boostCredits ? (boostTime === "Now" ? "Start 30-minute Boost" : "Schedule Boost") : "Buy Boosts to continue"}</button>
                  </section>
                  <div className="boost-list">
                    {boostPackages.map((pack) => <button key={pack.id} aria-pressed={selectedBoost === pack.id} onClick={() => { setSelectedBoost(pack.id); setPurchaseNotice(""); }}>
                      {pack.id === "five" && <em>Popular</em>}
                      <i><Zap /></i><b>{pack.count} {pack.count === 1 ? "Boost" : "Boosts"}</b><strong>{pack.price}</strong><small>{pack.unit}</small>
                    </button>)}
                  </div>
                  <section className="benefit-card boost-guidance"><h3>A healthier Boost</h3><p><Check /> See an estimated audience before starting</p><p><Check /> Choose now or schedule for an active time</p><p><Check /> Clear 30-minute countdown and results summary</p><p><Check /> Never reveals who paid to be seen</p></section>
                </>}
                {purchaseNotice && <div className="purchase-notice" role="status"><Check /> {purchaseNotice}</div>}
                <p className="billing-legal">Preview pricing only. In the native app, the exact total, renewal date, taxes, cancellation method, and store terms appear before confirmation. Subscriptions auto-renew until cancelled; Boosts are one-time consumable purchases.</p>
              </div>
              <footer className="purchase-footer">
                <span><small>{membershipView === "plans" ? selectedMembershipPlan.label : `${selectedBoostPackage.count} Boosts`}</small><b>{membershipView === "plans" ? selectedMembershipPlan.total : selectedBoostPackage.price}</b></span>
                <button disabled={membershipView === "plans" && hasSubscription && !pendingPremiumAction} onClick={() => {
                  if (membershipView === "boosts") {
                    setBoostCredits((count) => addBoostCredits(count, selectedBoostPackage.count));
                    setPurchaseNotice(`${selectedBoostPackage.count} Boost${selectedBoostPackage.count === 1 ? "" : "s"} added for this preview — no payment was charged.`);
                    return;
                  }
                  setHasSubscription(true);
                  setPurchaseNotice("Mila Plus activated for this preview — no payment was charged.");
                  if (pendingPremiumAction === "intro") {
                    setPendingPremiumAction(null);
                    setAccountPanel(null);
                    window.setTimeout(openIntroductionComposer, 0);
                  }
                }}><CreditCard /> {membershipView === "plans" ? (hasSubscription ? "Active" : "Continue") : "Add Boosts"}</button>
              </footer>
            </section>
          )}
          {accountPanel === "registration" && (
            <section className="account-panel registration-panel">
              <header className="account-panel-header">
                <button onClick={() => setAccountPanel(null)} aria-label="Close registration preview"><X /></button>
                <span><b>Registration preview</b><small>About 4 minutes</small></span>
                <i>{registrationStep + 1}/5</i>
              </header>
              <div className="registration-progress" aria-label={`Step ${registrationStep + 1} of 5`}><i style={{ width: `${((registrationStep + 1) / 5) * 100}%` }} /></div>
              <div className="account-panel-scroll registration-scroll">
                <span className="step-kicker">Step {registrationStep + 1}</span>
                <h2>{registrationSteps[registrationStep].title}</h2>
                <p>{registrationSteps[registrationStep].note}</p>
                <section className="registration-card">
                  {registrationSteps[registrationStep].items.map(([label, status]) => <div key={label}><span><Check /><b>{label}</b></span><small>{status}</small></div>)}
                </section>
                {registrationStep === 0 && <div className="registration-tip"><ShieldCheck /><span><b>Age 18+ only</b><small>Birthday is used for age eligibility and is never displayed.</small></span></div>}
                {registrationStep === 1 && <div className="registration-tip"><EyeOff /><span><b>Privacy-first defaults</b><small>Use approximate location, hide your profile anytime, and choose who can find you.</small></span></div>}
                {registrationStep === 2 && <div className="registration-tip"><Sparkles /><span><b>AI is optional</b><small>Mila can help polish a bio, but users review every suggestion before publishing.</small></span></div>}
                {registrationStep === 3 && <div className="registration-tip"><SlidersHorizontal /><span><b>Don’t ask everything now</b><small>Lifestyle, zodiac and compatibility details can be completed gradually after signup.</small></span></div>}
                {registrationStep === 4 && <div className="registration-tip"><Languages /><span><b>Accessible worldwide</b><small>Choose language, text size, captions and reduced motion before entering Match.</small></span></div>}
                <div className="registration-missing">
                  <b>Built into Mila from day one</b>
                  <span>Account recovery · notification controls · blocked contacts · location privacy · accessibility · consent reminders · data download/delete</span>
                </div>
              </div>
              <footer className="registration-footer">
                <button disabled={registrationStep === 0} onClick={() => setRegistrationStep((step) => Math.max(0, step - 1))}>Back</button>
                <button onClick={() => {
                  if (registrationStep < registrationSteps.length - 1) setRegistrationStep((step) => step + 1);
                  else { setProfileNotice("Registration preview completed"); setAccountPanel(null); }
                }}>{registrationStep === registrationSteps.length - 1 ? "Finish preview" : "Continue"}<ChevronRight /></button>
              </footer>
            </section>
          )}
          {!voiceOpen && !editorOpen && !profileOpen && !selfPreviewOpen && !accountPanel && (
            <button
              className="voice-fab"
              onClick={beginVoice}
              aria-label="Open Mila Voice"
            >
              <Mic />
              <span>{testing ? "Mila Voice" : "Ask Mila"}</span>
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
                {!testing && <div className="voice-entry-choices" role="group" aria-label="Ask Mila actions">
                  <button onClick={() => { setVoiceStep("matches"); answerVoice("Would you like me to read your matched profiles? Say yes or skip."); }}><Volume2 /> Listen</button>
                  <button onClick={() => { setVoiceStep("profiles"); answerVoice("Would you like me to read the profile you are viewing? Say yes or skip."); }}><Compass /> Explore</button>
                  <button onClick={() => { setVoiceStep("reply"); setDictatingReply(false); answerVoice(chatOpen ? "Type or dictate a reply below. Review it before confirming send." : "Connect with someone before sending a reply. You can still prepare a draft."); }}><MessageCircle /> Reply</button>
                </div>}
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
                        if (!canSendPreMatchIntroduction(hasSubscription)) {
                          setIntroDraft(false);
                          setVoiceOpen(false);
                          setPendingPremiumAction("intro");
                          setMembershipView("plans");
                          setPurchaseNotice("Mila Plus is required to send an introduction before matching.");
                          setAccountPanel("membership");
                          return;
                        }
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
            {(testing ? navigation : signatureNavigation).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTab(item.id)}
                  aria-current={activeTab === item.id || (!testing && item.id === "discover" && activeTab === "explore") ? "page" : undefined}
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

export default function Home({ testing = false }: { testing?: boolean }) {
  const [theme, setTheme] = useState<Theme>("sunrise");
  const [selectedWomanId, setSelectedWomanId] = useState<WomanProfileId>("maya");
  const [selectedManId, setSelectedManId] = useState<ManProfileId>("arjun");
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
  const [radius, setRadius] = useState(10);
  const [introRequest, setIntroRequest] = useState<IntroRequest | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const selectedWoman = demoProfiles[selectedWomanId];
  const selectedMan = demoProfiles[selectedManId];
  useEffect(() => {
    document.documentElement.dataset.milaReady = "true";
    return () => {
      delete document.documentElement.dataset.milaReady;
    };
  }, []);
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
  const selectScenario = (profileId: WomanProfileId, manId: ManProfileId = selectedManId) => {
    setSelectedWomanId(profileId);
    setSelectedManId(manId);
    setHiddenIos(false);
    setHiddenAndroid(false);
    setDecisionIos("idle");
    setDecisionAndroid("idle");
    setIntroRequest(null);
    setMessages([]);
    setProfileOpenIos(false);
    setProfileOpenAndroid(false);
    setSafetyOpenIos(false);
    setSafetyOpenAndroid(false);
    setBlockedIos(false);
    setBlockedAndroid(false);
    setMediaIndexIos(0);
    setMediaIndexAndroid(0);
    setActiveTab("discover");
  };
  const sharedPreview = {
    testing,
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
    <main className={`preview-shell theme-${theme} ${testing ? "testing-mode" : "signature-mode"}`}>
      <header className="preview-header">
        <a className="mila-brand" href="#preview">
          <span className="mila-mark">m</span>
          <span>mila</span>
        </a>
        <div className="preview-label">
          <span /> iOS + Android product preview
        </div>
        {testing && <a className="testing-link" href="/">Back to Mila app</a>}
        <Button
          className="feature-link"
          onClick={() => { window.location.href = "/web"; }}
        >
          Open web app <ChevronRight />
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
            and test introductions with 4 male and 4 female demo identities.
            Choose a pair below. Switching pairs resets the conversation; no real members are contacted.
          </p>
        </div>
        <div className="preview-controls">
          <div className="control-group scenario-control">
            <span>Male test profiles · 4</span>
            <div className="scenario-tabs" role="group" aria-label="Male test profiles">
              {scenarioMen.map((person) => (
                <button key={person.id} onClick={() => selectScenario(selectedWomanId, person.id as ManProfileId)} aria-pressed={selectedManId === person.id}>
                  <i className={`profile-${person.photoId ?? person.id}`} /> {person.name}
                </button>
              ))}
            </div>
          </div>
          <div className="control-group scenario-control">
            <span>Female test profiles · 4 · choose your pairing</span>
            <div className="scenario-tabs" role="group" aria-label="Test profile scenario">
              {scenarioWomen.map((person) => (
                <button key={person.id} onClick={() => selectScenario(person.id as WomanProfileId)} aria-pressed={selectedWomanId === person.id}>
                  <i className={`profile-${person.photoId ?? person.id}`} /> {selectedMan.name} + {person.name}
                </button>
              ))}
            </div>
          </div>
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
            key={`ios-${selectedManId}-${selectedWomanId}`}
            platform="ios"
            viewerName={selectedMan.name}
            profile={selectedWoman}
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
            key={`android-${selectedManId}-${selectedWomanId}`}
            platform="android"
            viewerName={selectedWoman.name}
            profile={selectedMan}
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
            <strong>Step 1 · {selectedMan.name} messages {selectedWoman.name}</strong>
            <span>
              Tap the star on iPhone, personalize the introduction, and send
              it for {selectedWoman.name} to review.
            </span>
          </div>
          <div>
            <strong>Step 2 · {selectedWoman.name} accepts and replies</strong>
            <span>
              Open Requests on Android, accept {selectedMan.name}’s introduction, and reply
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
