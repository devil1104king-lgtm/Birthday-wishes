import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteSettings } from '../../types';

interface FinalSurpriseSectionProps {
  settings: SiteSettings;
  onReplay: () => void;
}

export default function FinalSurpriseSection({ settings, onReplay }: FinalSurpriseSectionProps) {
  const recipient = settings.recipientName || 'Meri Jaan';
  const title = settings.finalSurpriseTitle || 'One last thing...';
  const message =
    settings.finalSurpriseMessage ||
    'No matter where life takes you... Always remember... You are deeply special. May this year give you everything your heart wishes for. ❤️';
  const replayButtonText = settings.replayButtonText || '✨ Replay Your Surprise ✨';

  const handleCelebrateReplay = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fbbf24', '#ffffff'],
    });
    onReplay();
  };

  return (
    <section
      id="final-surprise-section"
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-transparent via-neutral-950/80 to-black overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none -top-12"></div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Single illuminated heart */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-rose-500/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.6)] border border-rose-300/40">
            <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
          </div>
        </div>

        {/* Intro phrase */}
        <span className="text-sm uppercase tracking-widest text-rose-300 font-semibold mb-3">
          {title}
        </span>

        {/* Recipient Greeting */}
        <h2
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white mb-6 tracking-wide drop-shadow-md"
          style={{ textShadow: '0 0 35px rgba(244,63,94,0.5)' }}
        >
          Happy Birthday, {recipient} 🎂❤️
        </h2>

        {/* Message */}
        <p className="text-base sm:text-xl text-neutral-200 font-serif italic leading-relaxed sm:leading-loose mb-12 max-w-xl whitespace-pre-line font-light">
          {message}
        </p>

        {/* Replay Button */}
        <button
          id="replay-surprise-button"
          onClick={handleCelebrateReplay}
          className="relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 rounded-full shadow-[0_0_35px_rgba(244,63,94,0.5)] hover:shadow-[0_0_50px_rgba(244,63,94,0.8)] border border-rose-300/40 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{replayButtonText}</span>
          <Sparkles className="w-4 h-4 text-amber-200" />
        </button>

        {/* Romantic signature */}
        <p className="mt-14 text-xs text-neutral-500 tracking-widest uppercase">
          Made with all my heart • Forever & Always ❤️
        </p>
      </div>
    </section>
  );
}
