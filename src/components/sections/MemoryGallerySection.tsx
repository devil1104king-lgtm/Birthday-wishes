import { useState, useEffect } from 'react';
import { Camera, X, Heart, Calendar, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { MemoryItem } from '../../types';

interface MemoryGallerySectionProps {
  memories: MemoryItem[];
}

export default function MemoryGallerySection({ memories }: MemoryGallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  if (!memories || memories.length === 0) return null;

  const selectedMemory = lightboxIndex !== null ? memories[lightboxIndex] : null;

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight' && memories.length > 1) {
        nextLightbox();
      } else if (e.key === 'ArrowLeft' && memories.length > 1) {
        prevLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, memories.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsZoomed(false);
  };

  const nextLightbox = () => {
    if (lightboxIndex === null) return;
    const nextIdx = (lightboxIndex + 1) % memories.length;
    setLightboxIndex(nextIdx);
    setIsZoomed(false);
  };

  const prevLightbox = () => {
    if (lightboxIndex === null) return;
    const prevIdx = (lightboxIndex - 1 + memories.length) % memories.length;
    setLightboxIndex(prevIdx);
    setIsZoomed(false);
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
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
                <span>View Full Photo</span>
                <Heart className="w-3.5 h-3.5 group-hover:fill-rose-500 group-hover:text-rose-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cinematic Fullscreen Lightbox Modal */}
      {selectedMemory && lightboxIndex !== null && (
        <div
          id="memory-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-neutral-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-950/80 z-20">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="text-rose-400 font-semibold">{lightboxIndex + 1}</span>
                <span>/</span>
                <span>{memories.length}</span>
                {selectedMemory.date && (
                  <>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-300">{selectedMemory.date}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                  title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>
                <button
                  id="close-lightbox-btn"
                  onClick={closeLightbox}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                  aria-label="Close Lightbox"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image Stage */}
            <div className="relative w-full max-h-[68vh] bg-black flex items-center justify-center overflow-auto p-2">
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.title}
                className={`transition-transform duration-300 object-contain ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'max-h-[64vh] w-auto cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
                referrerPolicy="no-referrer"
              />

              {/* Navigation Arrows */}
              {memories.length > 1 && (
                <>
                  <button
                    onClick={prevLightbox}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextLightbox}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption & Memory Description */}
            <div className="p-5 sm:p-6 bg-neutral-900 border-t border-neutral-800/80 overflow-y-auto max-h-[22vh]">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1.5">
                {selectedMemory.title}
              </h3>
              {selectedMemory.caption && (
                <p className="text-xs sm:text-sm text-rose-300 italic mb-2">
                  "{selectedMemory.caption}"
                </p>
              )}
              {selectedMemory.description && (
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
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
