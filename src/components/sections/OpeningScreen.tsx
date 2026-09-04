import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';

interface OpeningScreenProps {
  settings: SiteSettings;
  onOpen: () => void;
}

export default function OpeningScreen({ settings, onOpen }: OpeningScreenProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenSurprise = () => {
    setIsOpening(true);

    // Trigger romantic confetti & heart burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ffffff'],
    });

    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <div
      id="opening-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white transition-opacity duration-1000 ${
        isOpening ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle radial glow in background */}
      <div className="absolute w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -top-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -bottom-10"></div>

      {/* Central romantic card */}
      <div className="relative max-w-lg w-full text-center flex flex-col items-center z-10">
        {/* Pulsing illuminated heart badge */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-rose-500/40 rounded-full blur-xl animate-ping opacity-75"></div>
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-rose-500/50 border border-rose-300/30 transition-transform duration-500 hover:scale-110">
            <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-300 animate-bounce" />
        </div>

        {/* Heading */}
        <h1
          id="opening-title"
          className="text-2xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-rose-300 tracking-wide mb-4 drop-shadow-sm leading-snug"
        >
          {settings.openingTitle || 'Someone made something special for you... ❤️'}
        </h1>

        {/* Subtitle */}
        <p
          id="opening-subtitle"
          className="text-base sm:text-lg text-neutral-300 font-light max-w-md mb-10 leading-relaxed font-sans"
        >
          {settings.openingSubtitle || 'Are you ready for your surprise?'}
        </p>

        {/* Cinematic Button */}
        <button
          id="open-surprise-button"
          onClick={handleOpenSurprise}
          disabled={isOpening}
          className="relative inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:shadow-[0_0_45px_rgba(244,63,94,0.8)] border border-rose-300/40 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 group cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2 tracking-wide font-medium">
            <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
            {settings.openingButtonText || '✨ Open Your Surprise ✨'}
            <Heart className="w-4 h-4 fill-white text-white" />
          </span>
        </button>

        {/* Subtle hint */}
        <p className="mt-8 text-xs text-neutral-400/80 flex items-center gap-1 font-light tracking-wider uppercase">
          Best experienced with sound on 🎧
        </p>
      </div>
    </div>
  );
}
