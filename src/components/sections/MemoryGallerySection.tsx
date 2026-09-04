import { useState } from 'react';
import { Camera, X, Heart, Calendar, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { MemoryItem } from '../../types';

interface MemoryGallerySectionProps {
  memories: MemoryItem[];
}

export default function MemoryGallerySection({ memories }: MemoryGallerySectionProps) {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  if (!memories || memories.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setSelectedMemory(memories[index]);
  };

  const nextLightbox = () => {
    const nextIdx = (lightboxIndex + 1) % memories.length;
    setLightboxIndex(nextIdx);
    setSelectedMemory(memories[nextIdx]);
  };

  const prevLightbox = () => {
    const prevIdx = (lightboxIndex - 1 + memories.length) % memories.length;
    setLightboxIndex(prevIdx);
    setSelectedMemory(memories[prevIdx]);
  };

  return (
    <section id="memories-section" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Camera className="w-3.5 h-3.5" />
          <span>Frames in Time</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide">
          Our Little Memories 📸
        </h2>
        <p className="text-neutral-400 text-sm max-w-md mx-auto mt-2">
          Frozen moments filled with warmth, smiles, and unforgettable stories.
        </p>
      </div>

      {/* Masonry / Grid Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {memories.map((mem, idx) => (
          <div
            key={mem._id || mem.id || idx}
            id={`memory-card-${idx}`}
            onClick={() => openLightbox(idx)}
            className="group relative bg-neutral-900/90 rounded-3xl overflow-hidden border border-neutral-800 hover:border-rose-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
          >
            {/* Image container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Info details */}
            <div className="p-5 flex flex-col flex-grow justify-between">
              <div>
                {mem.date && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{mem.date}</span>
                  </div>
                )}
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-rose-300 transition-colors">
                  {mem.title}
                </h3>
                {mem.caption && (
                  <p className="text-xs text-neutral-300 mt-1 italic line-clamp-2">
                    "{mem.caption}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500">
                <span>View Memory</span>
                <Heart className="w-3.5 h-3.5 group-hover:fill-rose-500 group-hover:text-rose-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div
          id="memory-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-neutral-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="close-lightbox-btn"
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="relative w-full max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.title}
                className="max-h-[60vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Navigation arrows in Lightbox */}
              {memories.length > 1 && (
                <>
                  <button
                    onClick={prevLightbox}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextLightbox}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption Info */}
            <div className="p-6 overflow-y-auto">
              {selectedMemory.date && (
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  {selectedMemory.date}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1 mb-2">
                {selectedMemory.title}
              </h3>
              {selectedMemory.description && (
                <p className="text-sm text-neutral-300 leading-relaxed font-light">
                  {selectedMemory.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
