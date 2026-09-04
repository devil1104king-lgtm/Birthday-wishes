import { useState } from 'react';
import { Heart, Smile, Sparkles, Star, Sun, Shield, Award } from 'lucide-react';
import { LoveCardItem } from '../../types';

interface LoveCardsSectionProps {
  cards: LoveCardItem[];
}

export default function LoveCardsSection({ cards }: LoveCardsSectionProps) {
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  if (!cards || cards.length === 0) return null;

  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'smile': return <Smile className="w-6 h-6 text-amber-300" />;
      case 'sparkles': return <Sparkles className="w-6 h-6 text-pink-300" />;
      case 'star': return <Star className="w-6 h-6 text-yellow-300" />;
      case 'sun': return <Sun className="w-6 h-6 text-orange-300" />;
      case 'shield': return <Shield className="w-6 h-6 text-blue-300" />;
      default: return <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />;
    }
  };

  const handleCardClick = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="love-cards-section" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          <span>Infinite Reasons</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-wide">
          Do You Know Why You're Special? ❤️
        </h2>
        <p className="text-neutral-400 text-sm max-w-lg mx-auto mt-3">
          Just a few of the countless little reasons you hold the most treasured place in my world.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const cardKey = card._id || card.id || `card_${idx}`;
          const isFlipped = !!flipped[cardKey];

          return (
            <div
              key={cardKey}
              id={`love-card-${idx}`}
              onClick={() => handleCardClick(cardKey)}
              className="group relative h-80 rounded-3xl cursor-pointer perspective-1000 select-none"
            >
              <div
                className={`relative w-full h-full duration-700 transform-style-preserve-3d transition-transform rounded-3xl border border-rose-500/20 hover:border-rose-500/50 shadow-xl overflow-hidden bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 backdrop-blur-md p-6 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]`}
              >
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all"></div>

                {/* Top: Icon & Counter */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(card.icon)}
                  </div>
                  <span className="text-xs font-mono text-neutral-500 font-semibold">
                    0{idx + 1}
                  </span>
                </div>

                {/* Middle: Title & Description */}
                <div className="my-auto">
                  <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-rose-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans font-light line-clamp-4">
                    {card.text}
                  </p>
                </div>

                {/* Bottom hint */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 group-hover:text-rose-400 transition-colors">
                  <span>Forever Treasured</span>
                  <Heart className="w-3.5 h-3.5 fill-rose-500/40 text-rose-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
