import { Sparkles, Heart, ChevronDown } from 'lucide-react';
import { HeroSection as HeroType, SiteSettings } from '../../types';

interface HeroProps {
  hero: HeroType;
  settings: SiteSettings;
  onScrollToExplore?: () => void;
}

export default function HeroSection({ hero, settings, onScrollToExplore }: HeroProps) {
  const recipientName = (settings.recipientName || hero.recipientName || '').trim() || 'Meri Jaan';
  const relationship = (settings.relationshipLabel || '').trim() || 'Meri Jaan';

  // Construct heading cleanly:
  // Base heading (default "Happy Birthday") + Recipient Name from Admin Settings
  const baseHeading = (settings.heroHeading || 'Happy Birthday').trim();
  const displayHeading = `${baseHeading} ${recipientName}`.trim();

  const subtitle = hero.subtitle || settings.heroSubtitle || 'To the person who makes life a little more beautiful...';

  return (
    <section
      id="hero-section"
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden"
    >
      {/* Cinematic light rays effect */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-rose-600/10 via-pink-500/15 to-amber-400/5 rounded-full blur-3xl transform -translate-y-12"></div>
      </div>

      {/* Floating decorative elements */}
      {hero.showFloatingBalloons && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-[8%] top-[20%] w-10 h-14 bg-gradient-to-t from-rose-500 to-pink-400 rounded-[50%] shadow-lg shadow-rose-500/30 animate-bounce opacity-75" style={{ animationDuration: '4s' }}>
            <div className="w-0.5 h-16 bg-white/20 mx-auto mt-14"></div>
          </div>
          <div className="absolute right-[10%] top-[15%] w-8 h-12 bg-gradient-to-t from-pink-500 to-rose-400 rounded-[50%] shadow-lg shadow-pink-500/30 animate-bounce opacity-70" style={{ animationDuration: '5s' }}>
            <div className="w-0.5 h-14 bg-white/20 mx-auto mt-12"></div>
          </div>
          <div className="absolute left-[18%] bottom-[25%] w-7 h-10 bg-gradient-to-t from-amber-400 to-pink-400 rounded-[50%] opacity-60 animate-bounce" style={{ animationDuration: '6s' }}>
            <div className="w-0.5 h-12 bg-white/20 mx-auto mt-10"></div>
          </div>
        </div>
      )}

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-widest uppercase mb-6 backdrop-blur-sm shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Today is All About You</span>
        <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
      </div>

      {/* Main Heading */}
      <h1
        id="hero-heading"
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-300 tracking-tight leading-tight max-w-4xl drop-shadow-md"
      >
        {displayHeading}
      </h1>

      {/* Relationship Label with Glowing Aura */}
      <div className="mt-4 mb-6 relative inline-block group">
        <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000"></div>
        <h2
          id="hero-recipient-name"
          className="relative text-3xl sm:text-5xl md:text-6xl font-['Rozha_One',serif] text-rose-400 tracking-wider flex items-center justify-center gap-3"
          style={{ textShadow: '0 0 35px rgba(244,63,94,0.6)' }}
        >
          <span>{relationship}</span>
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 fill-rose-500 inline-block animate-pulse shrink-0" />
        </h2>
      </div>

      {/* Subtitle */}
      <p
        id="hero-subtitle"
        className="text-base sm:text-xl text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed px-4"
      >
        {subtitle}
      </p>

      {/* Scroll Down Indicator */}
      <div className="mt-14 flex flex-col items-center">
        <button
          id="hero-explore-button"
          onClick={onScrollToExplore}
          className="group flex flex-col items-center gap-2 text-neutral-400 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll to explore your surprise</span>
          <div className="w-9 h-9 rounded-full border border-neutral-700 group-hover:border-rose-500/50 flex items-center justify-center group-hover:bg-rose-500/10 transition-all">
            <ChevronDown className="w-4 h-4 animate-bounce text-rose-400" />
          </div>
        </button>
      </div>
    </section>
  );
}
