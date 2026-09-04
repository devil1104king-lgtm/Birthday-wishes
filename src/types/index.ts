export interface SiteSettings {
  siteTitle: string;
  recipientName: string;
  relationshipLabel: string;
  birthdayDate: string;
  birthdayTime: string;
  timezone: string;
  heroHeading: string;
  heroSubtitle: string;
  openingTitle: string;
  openingSubtitle: string;
  openingButtonText: string;
  finalSurpriseTitle: string;
  finalSurpriseMessage: string;
  replayButtonText: string;
  faviconUrl: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
}

export interface HeroSection {
  mainHeading: string;
  recipientName: string;
  subtitle: string;
  showFloatingBalloons: boolean;
  showConfetti: boolean;
  showFloatingHearts: boolean;
  showGlowEffect: boolean;
}

export interface MusicItem {
  _id?: string;
  id?: string;
  title: string;
  audioUrl: string;
  coverUrl: string;
  loop: boolean;
  volume: number;
  enabled: boolean;
  order: number;
}

export interface MessageItem {
  _id?: string;
  id?: string;
  title: string;
  hindiText: string;
  englishText: string;
  author: string;
  category: string;
  enabled: boolean;
  order: number;
}

export interface ShayariItem {
  _id?: string;
  id?: string;
  heading: string;
  hindiText: string;
  englishSubtitle: string;
  imageUrl: string;
  backgroundUrl: string;
  animationStyle: string;
  enabled: boolean;
  order: number;
}

export interface MemoryItem {
  _id?: string;
  id?: string;
  imageUrl: string;
  title: string;
  caption: string;
  date: string;
  description: string;
  enabled: boolean;
  order: number;
}

export interface VideoItem {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  platform: 'mp4' | 'youtube' | 'instagram';
  enabled: boolean;
  order: number;
}

export interface LoveCardItem {
  _id?: string;
  id?: string;
  title: string;
  text: string;
  icon: string;
  imageUrl: string;
  animation: string;
  enabled: boolean;
  order: number;
}

export interface TimelineItem {
  _id?: string;
  id?: string;
  title: string;
  text: string;
  image: string;
  date: string;
  animation: string;
  order: number;
  enabled: boolean;
}

export interface ReasonItem {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface SurpriseSections {
  showTreeAnimation: boolean;
  treeMessage: string;
  showCake: boolean;
  cakeHeading: string;
  cakeSubtext: string;
  cakeWishGrantedText: string;
  showCountdown: boolean;
  countdownHeading: string;
  countdownCelebrationMessage: string;
  showMusicVisualizer: boolean;
  showLoveLetter: boolean;
  loveLetterTitle: string;
  loveLetterText: string;
}

export interface AppearanceSettings {
  themePreset: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundStyle: string;
  headingFont: string;
  bodyFont: string;
  cardStyle: string;
  borderRadius: string;
  glowIntensity: string;
  buttonStyle: string;
  particlesEnabled: boolean;
  heartsEnabled: boolean;
  confettiEnabled: boolean;
  petalsEnabled: boolean;
  backgroundMotionEnabled: boolean;
  reducedMotion: boolean;
  particleDensity: number;
  heartDensity: number;
}

export interface CountdownSettings {
  targetDate: string;
  targetTime: string;
  timezone: string;
  preBirthdayHeading: string;
  atBirthdayMessage: string;
  postBirthdayMessage: string;
  autoConfettiOnZero: boolean;
  enabled: boolean;
}

export interface PublicDataBundle {
  settings: SiteSettings;
  hero: HeroSection;
  music: MusicItem[];
  messages: MessageItem[];
  shayari: ShayariItem[];
  memories: MemoryItem[];
  videos: VideoItem[];
  loveCards: LoveCardItem[];
  timeline: TimelineItem[];
  reasons: ReasonItem[];
  surprises: SurpriseSections;
  appearance: AppearanceSettings;
  countdown: CountdownSettings;
}

export interface AdminDataBundle extends PublicDataBundle {
  isMongoConnected?: boolean;
}
