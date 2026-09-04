import { useState } from 'react';
import { Heart, Sparkles, Languages } from 'lucide-react';
import { MessageItem } from '../../types';

interface EmotionalMessageProps {
  messages: MessageItem[];
}

export default function EmotionalMessage({ messages }: EmotionalMessageProps) {
  const [activeTab, setActiveTab] = useState<'hindi' | 'english'>('hindi');

  if (!messages || messages.length === 0) return null;

  const primaryMessage = messages[0];

  return (
    <section id="emotional-message-section" className="relative py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-72 bg-rose-900/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          <span>Straight From The Heart</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
          {primaryMessage.title || 'Happy Birthday, Meri Jaan ❤️'}
        </h2>
      </div>

      {/* Emotional Letter Container */}
      <div className="relative bg-neutral-900/80 backdrop-blur-md border border-rose-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Subtle romantic corner accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-500/10 to-transparent pointer-events-none rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-transparent pointer-events-none rounded-bl-3xl"></div>

        {/* Language switcher button */}
        {primaryMessage.englishText && (
          <div className="flex justify-end mb-6">
            <div className="inline-flex bg-neutral-800/80 p-1 rounded-full border border-neutral-700">
              <button
                id="message-tab-hindi"
                onClick={() => setActiveTab('hindi')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  activeTab === 'hindi'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                हिंदी / Hinglish
              </button>
              <button
                id="message-tab-english"
                onClick={() => setActiveTab('english')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all flex items-center gap-1 ${
                  activeTab === 'english'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Languages className="w-3 h-3" />
                English
              </button>
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className="relative z-10">
          <div className="text-neutral-200 text-base sm:text-lg leading-relaxed sm:leading-loose whitespace-pre-line font-serif italic selection:bg-rose-500">
            {activeTab === 'hindi'
              ? primaryMessage.hindiText
              : primaryMessage.englishText || primaryMessage.hindiText}
          </div>

          {/* Author Signature */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-rose-300 font-serif italic text-lg sm:text-xl">
              <span>— {primaryMessage.author || 'Forever Yours'}</span>
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-300/80" />
              <span>Written with genuine love</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
