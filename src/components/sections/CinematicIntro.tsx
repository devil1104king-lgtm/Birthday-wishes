import { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface CinematicIntroProps {
  recipientName: string;
  onComplete: () => void;
}

const PHRASES = [
  'Some people...',
  'make ordinary days...',
  'feel a little more special. ✨',
  'And some people...',
  'become the warmest reason to smile.',
  'Today...',
  'Today is YOUR day. ❤️',
];

export default function CinematicIntro({ recipientName, onComplete }: CinematicIntroProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (phraseIndex < PHRASES.length - 1) {
      const timer = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setPhraseIndex((prev) => prev + 1);
          setFading(false);
        }, 600);
      }, 2300);

      return () => clearTimeout(timer);
    } else {
      // Last phrase stays for 3 seconds then completes
      const endTimer = setTimeout(() => {
        onComplete();
      }, 3200);
      return () => clearTimeout(endTimer);
    }
  }, [phraseIndex, onComplete]);

  const currentText = PHRASES[phraseIndex].replace('YOUR', `${recipientName.toUpperCase()}'S`);

  return (
    <div
      id="cinematic-intro"
      className="fixed inset-0 z-45 flex flex-col items-center justify-center p-6 bg-black text-white select-none"
    >
      {/* Soft background light */}
      <div className="absolute w-72 h-72 bg-rose-900/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative text-center max-w-xl z-10">
        <div className="mb-6 flex justify-center">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
        </div>

        <h2
          key={phraseIndex}
          className={`text-2xl sm:text-4xl md:text-5xl font-serif font-medium tracking-wide text-rose-100 transition-all duration-700 ${
            fading ? 'opacity-0 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'
          }`}
          style={{ textShadow: '0 0 25px rgba(244,63,94,0.4)' }}
        >
          {currentText}
        </h2>

        {/* Skip button for user convenience */}
        <div className="mt-14">
          <button
            id="skip-intro-button"
            onClick={onComplete}
            className="text-xs text-neutral-400 hover:text-white px-4 py-2 rounded-full border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-1.5 mx-auto"
          >
            <span>Skip into celebration</span>
            <Sparkles className="w-3 h-3 text-rose-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
