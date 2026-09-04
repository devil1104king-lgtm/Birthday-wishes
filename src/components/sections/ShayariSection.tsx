import { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Sparkles, Quote } from 'lucide-react';
import { ShayariItem } from '../../types';

interface ShayariSectionProps {
  shayariList: ShayariItem[];
}

export default function ShayariSection({ shayariList }: ShayariSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});

  if (!shayariList || shayariList.length === 0) return null;

  const current = shayariList[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : shayariList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < shayariList.length - 1 ? prev + 1 : 0));
  };

  const toggleHeart = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const itemKey = current._id || current.id || `${currentIndex}`;
  const likeCount = (likes[itemKey] || 0) + 12; // starts with a warm base

  return (
    <section id="shayari-section" className="relative py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>दिल की कलम से</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
          Romantic Shayari & Poetry
        </h2>
        <p className="text-neutral-400 text-sm mt-2">
          Words strung together with affection, celebrating your beauty and grace.
        </p>
      </div>

      {/* Shayari Card Display */}
      <div className="relative bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-rose-500/20 rounded-3xl p-6 sm:p-12 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Subtle Watermark Quote */}
        <Quote className="absolute -top-4 -left-4 w-28 h-28 text-rose-500/5 pointer-events-none" />

        {/* Heading */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-8">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-rose-300 flex items-center gap-2">
            <span>{current.heading || 'दिल से निकली दुआ'}</span>
          </h3>
          <span className="text-xs text-neutral-500 font-mono">
            {currentIndex + 1} / {shayariList.length}
          </span>
        </div>

        {/* Hindi Poetry Lines */}
        <div className="my-8 text-center">
          <p
            className="text-xl sm:text-2xl md:text-3xl text-rose-100 font-serif leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide drop-shadow-sm font-medium"
            style={{ textShadow: '0 0 20px rgba(244,63,94,0.3)' }}
          >
            {current.hindiText}
          </p>

          {/* English Subtitle */}
          {current.englishSubtitle && (
            <div className="mt-8 pt-6 border-t border-neutral-800/60 max-w-xl mx-auto">
              <p className="text-sm sm:text-base text-neutral-400 font-sans italic leading-relaxed">
                "{current.englishSubtitle}"
              </p>
            </div>
          )}
        </div>

        {/* Actions and Navigation */}
        <div className="mt-10 pt-4 flex items-center justify-between gap-4">
          {/* Heart Button */}
          <button
            id={`like-shayari-${currentIndex}`}
            onClick={() => toggleHeart(itemKey)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-all text-xs font-medium cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>{likeCount} Hearts</span>
          </button>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-2">
            <button
              id="shayari-prev-btn"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors"
              aria-label="Previous Shayari"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="shayari-next-btn"
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-rose-500/30 bg-rose-600/20 hover:bg-rose-600/40 flex items-center justify-center text-rose-200 transition-colors"
              aria-label="Next Shayari"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
