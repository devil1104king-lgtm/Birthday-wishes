import { Schema } from 'mongoose';

// 1. Admin Schema
export interface IAdmin {
  username: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// 2. Site Settings Schema
export interface ISiteSettings {
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

export const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteTitle: { type: String, default: 'Happy Birthday My Love' },
    recipientName: { type: String, default: 'Aanchal' },
    relationshipLabel: { type: String, default: 'Meri Jaan' },
    birthdayDate: { type: String, default: '2026-09-15' },
    birthdayTime: { type: String, default: '00:00' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    heroHeading: { type: String, default: 'Happy Birthday' },
    heroSubtitle: { type: String, default: 'To the person who makes life a little more beautiful...' },
    openingTitle: { type: String, default: 'Someone made something special for you... ❤️' },
    openingSubtitle: { type: String, default: 'Are you ready?' },
    openingButtonText: { type: String, default: '✨ Open Your Surprise ✨' },
    finalSurpriseTitle: { type: String, default: 'One last thing...' },
    finalSurpriseMessage: {
      type: String,
      default: 'No matter where life takes you... Always remember... You are deeply special. May this year give you everything your heart wishes for. ❤️',
    },
    replayButtonText: { type: String, default: '✨ Replay Your Surprise ✨' },
    faviconUrl: { type: String, default: '' },
    seoTitle: { type: String, default: 'A Special Birthday Surprise For You ❤️' },
    seoDescription: { type: String, default: 'An interactive cinematic birthday celebration made with love.' },
    ogImageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// 3. Hero Section Schema
export interface IHeroSection {
  mainHeading: string;
  recipientName: string;
  subtitle: string;
  showFloatingBalloons: boolean;
  showConfetti: boolean;
  showFloatingHearts: boolean;
  showGlowEffect: boolean;
}

export const HeroSectionSchema = new Schema<IHeroSection>(
  {
    mainHeading: { type: String, default: 'Happy Birthday' },
    recipientName: { type: String, default: 'Aanchal' },
    subtitle: { type: String, default: 'To the person who makes life a little more beautiful...' },
    showFloatingBalloons: { type: Boolean, default: true },
    showConfetti: { type: Boolean, default: true },
    showFloatingHearts: { type: Boolean, default: true },
    showGlowEffect: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 4. Music Schema
export interface IMusic {
  title: string;
  audioUrl: string;
  coverUrl: string;
  loop: boolean;
  volume: number;
  enabled: boolean;
  order: number;
}

export const MusicSchema = new Schema<IMusic>(
  {
    title: { type: String, required: true },
    audioUrl: { type: String, required: true },
    coverUrl: { type: String, default: '' },
    loop: { type: Boolean, default: true },
    volume: { type: Number, default: 0.8 },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 5. Messages Schema
export interface IMessageItem {
  title: string;
  hindiText: string;
  englishText: string;
  author: string;
  category: string;
  enabled: boolean;
  order: number;
}

export const MessageSchema = new Schema<IMessageItem>(
  {
    title: { type: String, default: 'From My Heart' },
    hindiText: { type: String, required: true },
    englishText: { type: String, default: '' },
    author: { type: String, default: 'With all my love' },
    category: { type: String, default: 'Birthday' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 6. Shayari Schema
export interface IShayari {
  heading: string;
  hindiText: string;
  englishSubtitle: string;
  imageUrl: string;
  backgroundUrl: string;
  animationStyle: string;
  enabled: boolean;
  order: number;
}

export const ShayariSchema = new Schema<IShayari>(
  {
    heading: { type: String, default: 'दिल से निकली दुआ' },
    hindiText: { type: String, required: true },
    englishSubtitle: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    backgroundUrl: { type: String, default: '' },
    animationStyle: { type: String, default: 'fade-up' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 7. Memory Schema
export interface IMemory {
  imageUrl: string;
  title: string;
  caption: string;
  date: string;
  description: string;
  enabled: boolean;
  order: number;
}

export const MemorySchema = new Schema<IMemory>(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    caption: { type: String, default: '' },
    date: { type: String, default: '' },
    description: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 8. Video Schema
export interface IVideo {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  platform: 'mp4' | 'youtube' | 'instagram';
  enabled: boolean;
  order: number;
}

export const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    platform: { type: String, enum: ['mp4', 'youtube', 'instagram'], default: 'mp4' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 9. Love Cards Schema
export interface ILoveCard {
  title: string;
  text: string;
  icon: string;
  imageUrl: string;
  animation: string;
  enabled: boolean;
  order: number;
}

export const LoveCardSchema = new Schema<ILoveCard>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    icon: { type: String, default: 'heart' },
    imageUrl: { type: String, default: '' },
    animation: { type: String, default: 'scale' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 10. Timeline Items Schema
export interface ITimelineItem {
  title: string;
  text: string;
  image: string;
  date: string;
  animation: string;
  order: number;
  enabled: boolean;
}

export const TimelineItemSchema = new Schema<ITimelineItem>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, default: '' },
    date: { type: String, default: '' },
    animation: { type: String, default: 'slide-right' },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 11. Reasons Schema
export interface IReason {
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export const ReasonSchema = new Schema<IReason>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'sparkles' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 12. Surprise Sections Schema
export interface ISurpriseSections {
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

export const SurpriseSectionsSchema = new Schema<ISurpriseSections>(
  {
    showTreeAnimation: { type: Boolean, default: true },
    treeMessage: { type: String, default: 'Growing a little more love for you every day. ❤️' },
    showCake: { type: Boolean, default: true },
    cakeHeading: { type: String, default: 'Make a Wish... 🎂' },
    cakeSubtext: { type: String, default: 'Click or tap the candles to blow them out!' },
    cakeWishGrantedText: { type: String, default: 'Wish Granted! May all your heartfelt desires come true. ❤️' },
    showCountdown: { type: Boolean, default: true },
    countdownHeading: { type: String, default: 'Counting Every Second Until Your Special Day' },
    countdownCelebrationMessage: { type: String, default: '✨ The Moment is Here! Happy Birthday! ✨' },
    showMusicVisualizer: { type: Boolean, default: true },
    showLoveLetter: { type: Boolean, default: true },
    loveLetterTitle: { type: String, default: 'Things I Want To Tell You' },
    loveLetterText: { type: String, default: 'Thank you for being you. Thank you for every smile and the warmth you bring into my life. You deserve all the happiness in the universe.' },
  },
  { timestamps: true }
);

// 13. Appearance Settings Schema
export interface IAppearanceSettings {
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

export const AppearanceSettingsSchema = new Schema<IAppearanceSettings>(
  {
    themePreset: { type: String, default: 'romantic' },
    primaryColor: { type: String, default: '#f43f5e' },
    secondaryColor: { type: String, default: '#fb7185' },
    accentColor: { type: String, default: '#f472b6' },
    backgroundStyle: { type: String, default: 'cinematic-dark' },
    headingFont: { type: String, default: 'Playfair Display' },
    bodyFont: { type: String, default: 'Outfit' },
    cardStyle: { type: String, default: 'glass-dark' },
    borderRadius: { type: String, default: '16px' },
    glowIntensity: { type: String, default: 'medium' },
    buttonStyle: { type: String, default: 'pill-glow' },
    particlesEnabled: { type: Boolean, default: true },
    heartsEnabled: { type: Boolean, default: true },
    confettiEnabled: { type: Boolean, default: true },
    petalsEnabled: { type: Boolean, default: true },
    backgroundMotionEnabled: { type: Boolean, default: true },
    reducedMotion: { type: Boolean, default: false },
    particleDensity: { type: Number, default: 35 },
    heartDensity: { type: Number, default: 20 },
  },
  { timestamps: true }
);

// 14. Countdown Settings Schema
export interface ICountdownSettings {
  targetDate: string;
  targetTime: string;
  timezone: string;
  preBirthdayHeading: string;
  atBirthdayMessage: string;
  postBirthdayMessage: string;
  autoConfettiOnZero: boolean;
  enabled: boolean;
}

export const CountdownSettingsSchema = new Schema<ICountdownSettings>(
  {
    targetDate: { type: String, default: '2026-09-15' },
    targetTime: { type: String, default: '00:00' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    preBirthdayHeading: { type: String, default: 'The Countdown to Your Day' },
    atBirthdayMessage: { type: String, default: 'Happy Birthday, Meri Jaan! Today is all about you! ❤️' },
    postBirthdayMessage: { type: String, default: 'Celebrating you today, tomorrow, and always. 🌸' },
    autoConfettiOnZero: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);
