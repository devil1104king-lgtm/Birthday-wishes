import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import {
  Film, Play, Pause, X, Volume2, VolumeX, Maximize2,
  ChevronLeft, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';
import { VideoItem } from '../../types';

interface VideoReelsSectionProps {
  videos: VideoItem[];
}

export default function VideoReelsSection({ videos }: VideoReelsSectionProps) {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  if (!videos || videos.length === 0) return null;

  const currentVideo = selectedVideoIndex !== null ? videos[selectedVideoIndex] : null;

  // Keyboard navigation for video viewer
  useEffect(() => {
    if (selectedVideoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight' && videos.length > 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && videos.length > 1) {
        handlePrev();
      } else if (e.key === ' ' && modalVideoRef.current) {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'm' && modalVideoRef.current) {
        toggleMute();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideoIndex, isPlaying, isMuted, videos.length]);

  // Video time & duration updates
  const handleTimeUpdate = () => {
    if (modalVideoRef.current) {
      setCurrentTime(modalVideoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (modalVideoRef.current) {
      setDuration(modalVideoRef.current.duration || 0);
      setPlaybackError(null);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (modalVideoRef.current) {
      modalVideoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlay = () => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error:', err);
          setPlaybackError('Unable to play video directly. Please check file format.');
          setIsPlaying(false);
        });
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !modalVideoRef.current.muted;
    setIsMuted(modalVideoRef.current.muted);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (modalVideoRef.current) {
      modalVideoRef.current.volume = val;
      if (val === 0) {
        modalVideoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        modalVideoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const openModal = (index: number) => {
    setSelectedVideoIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
    setPlaybackError(null);
  };

  const closeModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setSelectedVideoIndex(null);
    setIsPlaying(false);
    setPlaybackError(null);
  };

  const handleNext = () => {
    if (videos.length <= 1) return;
    const nextIdx = (selectedVideoIndex! + 1) % videos.length;
    openModal(nextIdx);
  };

  const handlePrev = () => {
    if (videos.length <= 1) return;
    const prevIdx = (selectedVideoIndex! - 1 + videos.length) % videos.length;
    openModal(prevIdx);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getYoutubeEmbed = (url: string) => {
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      } else if (url.includes('watch?v=')) {
        const id = new URL(url).searchParams.get('v');
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const isYoutube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <section id="videos-section" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Film className="w-3.5 h-3.5" />
          <span>Cinematic Moments</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide">
          Moments I Never Want To Forget ❤️
        </h2>
        <p className="text-neutral-400 text-sm max-w-md mx-auto mt-2">
          Special videos and reels replaying the moments that make my heart smile.
        </p>
      </div>

      {/* Videos Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {videos.map((vid, idx) => {
          const vidKey = vid._id || vid.id || `vid_${idx}`;
          const isReel = vid.videoType === 'reel' || vid.platform === 'instagram';

          return (
            <div
              key={vidKey}
              id={`video-card-${idx}`}
              onClick={() => openModal(idx)}
              className="group relative bg-neutral-900/90 rounded-3xl overflow-hidden border border-neutral-800 hover:border-rose-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
            >
              {/* Thumbnail Container */}
              <div
                className={`relative w-full overflow-hidden bg-neutral-950 flex items-center justify-center ${
                  isReel ? 'aspect-[9/14]' : 'aspect-video'
                }`}
              >
                {vid.thumbnailUrl ? (
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-neutral-900 via-rose-950/20 to-neutral-900 text-neutral-500">
                    <Film className="w-12 h-12 text-rose-400/40 mb-2" />
                    <span className="text-xs font-medium text-neutral-400">Watch Memory</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>

                {/* Big Play Button Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600/90 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/30 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 text-[10px] uppercase tracking-wider font-semibold text-rose-300 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{isReel ? 'Reel' : 'Video'}</span>
                </div>
              </div>

              {/* Title & Description Info */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-rose-300 transition-colors">
                    {vid.title}
                  </h3>
                  {vid.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-rose-400 font-medium">
                  <span>Click to watch full video</span>
                  <Play className="w-3.5 h-3.5 fill-rose-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL-SCREEN VIDEO VIEWER MODAL */}
      {currentVideo && selectedVideoIndex !== null && (
        <div
          id="video-viewer-modal"
          ref={modalContainerRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none"
          onClick={closeModal}
        >
          {/* Main Viewer Card */}
          <div
            className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Title & Close Button */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/80 z-20">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Film className="w-4 h-4 text-rose-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-serif font-bold text-white truncate">
                  {currentVideo.title}
                </h3>
              </div>
              <button
                id="close-video-modal-btn"
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Close video viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport: Supports 16:9 and 9:16 portrait reels */}
            <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden min-h-[40vh] max-h-[75vh]">
              {isYoutube(currentVideo.videoUrl) ? (
                <iframe
                  src={getYoutubeEmbed(currentVideo.videoUrl)}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video border-0 max-h-[70vh]"
                ></iframe>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={modalVideoRef}
                    src={currentVideo.videoUrl}
                    poster={currentVideo.thumbnailUrl}
                    playsInline
                    autoPlay
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => {
                      setPlaybackError(
                        'This video file format cannot be played directly by your browser. Please ensure direct MP4/WebM format or an embed URL.'
                      );
                      setIsPlaying(false);
                    }}
                    className={`max-h-[65vh] w-auto max-w-full object-contain cursor-pointer ${
                      currentVideo.videoType === 'reel' ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                    onClick={togglePlay}
                  />

                  {/* Play/Pause Overlay Indicator on Click */}
                  {!isPlaying && !playbackError && (
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                      aria-label="Play video"
                    >
                      <Play className="w-10 h-10 fill-white ml-1" />
                    </button>
                  )}

                  {/* Error Notification */}
                  {playbackError && (
                    <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-6 text-center">
                      <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                      <p className="text-white font-medium text-sm sm:text-base max-w-md">
                        {playbackError}
                      </p>
                      <a
                        href={currentVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-rose-300 text-xs font-semibold"
                      >
                        Open Video Link in New Tab
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Prev / Next buttons in modal */}
              {videos.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all z-10"
                    aria-label="Previous video"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all z-10"
                    aria-label="Next video"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Video Controls Bar (Only for HTML5 direct video) */}
            {!isYoutube(currentVideo.videoUrl) && (
              <div className="px-4 py-3 bg-neutral-950/95 border-t border-neutral-800 flex flex-col gap-2">
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-400 font-mono w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-grow h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <span className="text-[11px] text-neutral-400 font-mono w-10">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Button controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-600 text-white transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 ml-1">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        aria-label="Mute or Unmute"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-24 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                  </div>

                  {/* Right side fullscreen button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                      title="Toggle Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Description footer */}
            {currentVideo.description && (
              <div className="px-5 py-3 bg-neutral-900 border-t border-neutral-800/80">
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {currentVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
