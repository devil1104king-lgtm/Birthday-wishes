import React, { useState, type MouseEvent } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw } from 'lucide-react';
import { SurpriseSections } from '../../types';

interface BirthdayCakeSectionProps {
  surprises?: SurpriseSections;
}

export default function BirthdayCakeSection({ surprises }: BirthdayCakeSectionProps) {
  const [blownOut, setBlownOut] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (surprises?.showCake === false) return null;

  const heading = surprises?.cakeHeading || 'Make a Wish... 🎂';
  const subtext = surprises?.cakeSubtext || 'Click or tap the candles to blow them out!';
  const wishGrantedText =
    surprises?.cakeWishGrantedText || 'Wish Granted! May every single wish in your heart come true. ❤️';

  const handleBlowCandles = () => {
    if (blownOut) return;
    setBlownOut(true);

    // Confetti celebration burst
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#ec4899', '#fbbf24', '#f472b6', '#ffffff'],
    });

    // Second wave
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#fda4af', '#f43f5e'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#fda4af', '#f43f5e'],
      });
    }, 350);
  };

  const handleRelight = (e: MouseEvent) => {
    e.stopPropagation();
    setBlownOut(false);
  };

  return (
    <section id="cake-section" className="relative py-20 px-4 sm:px-6 text-center max-w-4xl mx-auto select-none">
      {/* Glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Section title */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Interactive Wish</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide mb-3">
          {heading}
        </h2>
        <p className="text-neutral-400 text-sm max-w-md mx-auto mb-12">
          {blownOut ? 'Your heartfelt wish has been sent to the stars.' : subtext}
        </p>

        {/* 3D Tiered Cake Presentation */}
        <div
          id="birthday-cake-interactive"
          onClick={handleBlowCandles}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative inline-flex flex-col items-center justify-center p-8 cursor-pointer group"
          title="Click to blow out candles!"
        >
          {/* Candles Container */}
          <div className="flex items-end justify-center gap-6 sm:gap-8 mb-[-4px] z-20">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center">
                {/* Flame */}
                <div
                  className={`w-3.5 h-6 rounded-full transition-all duration-500 ${
                    blownOut
                      ? 'opacity-0 scale-50 -translate-y-2'
                      : 'bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse'
                  }`}
                  style={{
                    borderRadius: '50% 50% 35% 35%',
                    transformOrigin: 'bottom center',
                  }}
                ></div>

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-neutral-700"></div>

                {/* Candle Stick */}
                <div className="w-3 h-10 sm:h-12 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-400 rounded-t-sm shadow-md border-t border-white/40 flex flex-col justify-between py-1">
                  <div className="w-full h-0.5 bg-rose-500/40"></div>
                  <div className="w-full h-0.5 bg-rose-500/40"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Tier */}
          <div className="w-40 sm:w-48 h-16 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-2xl shadow-lg border-2 border-rose-300/60 relative overflow-hidden flex items-center justify-center z-10">
            {/* Frosting drips */}
            <div className="absolute top-0 inset-x-0 flex justify-around">
              <span className="w-4 h-4 bg-rose-400 rounded-full -mt-2"></span>
              <span className="w-5 h-5 bg-rose-400 rounded-full -mt-2.5"></span>
              <span className="w-4 h-4 bg-rose-400 rounded-full -mt-2"></span>
              <span className="w-5 h-5 bg-rose-400 rounded-full -mt-2.5"></span>
            </div>
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse mt-2" />
          </div>

          {/* Middle Tier */}
          <div className="w-56 sm:w-64 h-20 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 rounded-2xl shadow-xl border-2 border-rose-300/40 mt-[-6px] relative overflow-hidden flex items-center justify-center">
            {/* Ribbons */}
            <div className="w-full h-2 bg-white/40"></div>
          </div>

          {/* Bottom Cake Plate */}
          <div className="w-72 sm:w-80 h-4 bg-gradient-to-r from-neutral-300 via-white to-neutral-300 rounded-full shadow-2xl mt-[-2px] border border-neutral-400"></div>

          {/* Tap Hint */}
          {!blownOut && (
            <div className="mt-8 flex items-center gap-2 text-xs font-medium text-amber-300/90 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tap or click to blow candles!</span>
            </div>
          )}
        </div>

        {/* Wish Granted banner */}
        {blownOut && (
          <div className="mt-8 max-w-md mx-auto bg-neutral-900/90 border border-rose-500/40 rounded-2xl p-5 shadow-2xl animate-fade-in">
            <h4 className="text-xl font-serif font-bold text-rose-300 mb-1 flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Wish Granted!</span>
            </h4>
            <p className="text-sm text-neutral-200 font-light mt-2 leading-relaxed">
              {wishGrantedText}
            </p>

            <button
              id="relight-candles-btn"
              onClick={handleRelight}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Relight Candles</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
