import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Clock, Sparkles, Heart } from 'lucide-react';
import { CountdownSettings, SiteSettings } from '../../types';

interface CountdownSectionProps {
  countdown: CountdownSettings;
  settings: SiteSettings;
}

export default function CountdownSection({ countdown, settings }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
    isToday: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    isToday: false,
  });

  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const dateStr = countdown.targetDate || settings.birthdayDate || '2026-09-15';
      const timeStr = countdown.targetTime || settings.birthdayTime || '00:00';

      const target = new Date(`${dateStr}T${timeStr}:00`);
      const now = new Date();

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        // Today or past
        const isWithin24Hours = Math.abs(diff) < 24 * 60 * 60 * 1000;
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: !isWithin24Hours,
          isToday: isWithin24Hours,
        });

        if (countdown.autoConfettiOnZero && !hasCelebrated) {
          confetti({
            particleCount: 70,
            spread: 90,
            origin: { y: 0.7 },
            colors: ['#f43f5e', '#ec4899', '#fbbf24', '#ffffff'],
          });
          setHasCelebrated(true);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
        isToday: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [countdown, settings, hasCelebrated]);

  if (countdown.enabled === false) return null;

  return (
    <section id="countdown-section" className="relative py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Special Moment</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide">
          {timeLeft.isToday || timeLeft.isPast
            ? countdown.atBirthdayMessage || 'The Celebration is Here! 🎉'
            : countdown.preBirthdayHeading || 'Counting Down The Seconds...'}
        </h2>
      </div>

      {/* Countdown Digits Display */}
      {!timeLeft.isPast && !timeLeft.isToday ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/90 border border-rose-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col items-center hover:border-rose-500/40 transition-all hover:scale-105"
            >
              <span className="text-3xl sm:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-400 drop-shadow-md">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-xs uppercase tracking-widest text-neutral-400 mt-2 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-rose-950/60 via-neutral-900/80 to-pink-950/60 border border-rose-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-xl mx-auto backdrop-blur-md">
          <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-rose-200 mb-3">
            {countdown.atBirthdayMessage || 'Happy Birthday, Meri Jaan! Today is all about you! ❤️'}
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {countdown.postBirthdayMessage || 'Celebrating you today, tomorrow, and always. 🌸'}
          </p>
          <div className="mt-6 flex justify-center">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}
