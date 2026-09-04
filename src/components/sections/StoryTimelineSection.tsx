import { Calendar, Heart, Sparkles } from 'lucide-react';
import { TimelineItem } from '../../types';

interface StoryTimelineSectionProps {
  timeline: TimelineItem[];
  letterTitle?: string;
  letterText?: string;
}

export default function StoryTimelineSection({
  timeline,
  letterTitle,
  letterText,
}: StoryTimelineSectionProps) {
  return (
    <section id="story-timeline-section" className="relative py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Our Journey & Milestones</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide">
          Every Moment With You
        </h2>
        <p className="text-neutral-400 text-sm max-w-md mx-auto mt-2">
          Looking back at the steps that brought us to this beautiful day.
        </p>
      </div>

      {/* Love Letter callout if provided */}
      {letterText && (
        <div className="mb-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-rose-950/40 via-neutral-900/60 to-pink-950/40 border border-rose-500/25 backdrop-blur-md text-center max-w-3xl mx-auto shadow-2xl">
          <Sparkles className="w-6 h-6 text-amber-300 mx-auto mb-4 animate-spin" style={{ animationDuration: '10s' }} />
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-rose-200 mb-4">
            {letterTitle || 'Things I Want To Tell You'}
          </h3>
          <p className="text-base sm:text-lg text-neutral-200 font-serif italic leading-relaxed whitespace-pre-line">
            "{letterText}"
          </p>
        </div>
      )}

      {/* Timeline Tree Line */}
      {timeline && timeline.length > 0 && (
        <div className="relative">
          {/* Vertical central line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-rose-500/50 via-pink-500/40 to-transparent transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item._id || item.id || idx}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline node icon */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-neutral-950 border-2 border-rose-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  </div>

                  {/* Content card */}
                  <div
                    className={`w-full md:w-[46%] pl-12 md:pl-0 ${
                      isEven ? 'md:text-left' : 'md:text-right'
                    }`}
                  >
                    <div className="bg-neutral-900/85 backdrop-blur-md border border-rose-500/20 hover:border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-xl transition-all hover:scale-[1.01]">
                      {item.date && (
                        <span className="inline-block px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
                          {item.date}
                        </span>
                      )}
                      <h4 className="text-xl font-serif font-bold text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-neutral-300 leading-relaxed font-sans font-light">
                        {item.text}
                      </p>
                      {item.image && (
                        <div className="mt-4 rounded-2xl overflow-hidden aspect-video border border-neutral-800">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
