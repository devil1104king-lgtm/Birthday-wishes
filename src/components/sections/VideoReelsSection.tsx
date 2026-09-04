import { useState, useRef } from 'react';
import { Film, Play, Pause, ExternalLink, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { VideoItem } from '../../types';

interface VideoReelsSectionProps {
  videos: VideoItem[];
}

export default function VideoReelsSection({ videos }: VideoReelsSectionProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  if (!videos || videos.length === 0) return null;

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying((prev) => ({ ...prev, [id]: true }));
    } else {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleMute = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted((prev) => ({ ...prev, [id]: video.muted }));
  };

  const handleFullscreen = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const getYoutubeEmbed = (url: string) => {
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${id}`;
      } else if (url.includes('watch?v=')) {
        const id = new URL(url).searchParams.get('v');
        return `https://www.youtube-nocookie.com/embed/${id}`;
      }
      return url;
    } catch {
      return url;
    }
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

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((vid, idx) => {
          const vidKey = vid._id || vid.id || `vid_${idx}`;
          const isCurrentPlaying = isPlaying[vidKey];
          const isCurrentMuted = isMuted[vidKey];

          return (
            <div
              key={vidKey}
              id={`video-card-${idx}`}
              className="bg-neutral-900/90 rounded-3xl overflow-hidden border border-rose-500/20 hover:border-rose-500/40 shadow-2xl flex flex-col backdrop-blur-md"
            >
              {/* Media viewport */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                {vid.platform === 'youtube' ? (
                  <iframe
                    src={getYoutubeEmbed(vid.videoUrl)}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                ) : vid.platform === 'instagram' ? (
                  // Instagram preview card
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-purple-950/80 via-neutral-900 to-rose-950/80">
                    {vid.thumbnailUrl ? (
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <div className="relative z-10">
                      <p className="text-rose-200 font-serif text-lg font-semibold mb-2">
                        Special Instagram Reel
                      </p>
                      <p className="text-xs text-neutral-300 mb-6 max-w-xs mx-auto">
                        Watch this beautiful moment on Instagram
                      </p>
                      <a
                        href={vid.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-semibold shadow-lg hover:shadow-rose-500/50 transition-all hover:scale-105"
                      >
                        <span>Open Reel</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  // Native HTML5 Direct MP4 Video Player
                  <div className="relative w-full h-full group">
                    <video
                      ref={(el) => {
                        videoRefs.current[vidKey] = el;
                      }}
                      src={vid.videoUrl}
                      poster={vid.thumbnailUrl}
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => togglePlay(vidKey)}
                    />

                    {/* Central Play/Pause overlay */}
                    {!isCurrentPlaying && (
                      <button
                        onClick={() => togglePlay(vidKey)}
                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                        aria-label="Play video"
                      >
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </button>
                    )}

                    {/* Video Controls bar on hover / mobile */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => togglePlay(vidKey)}
                        className="text-white hover:text-rose-400 p-1"
                      >
                        {isCurrentPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 fill-white" />
                        )}
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleMute(vidKey)}
                          className="text-white hover:text-rose-400 p-1"
                        >
                          {isCurrentMuted ? (
                            <VolumeX className="w-4 h-4 text-rose-400" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleFullscreen(vidKey)}
                          className="text-white hover:text-rose-400 p-1"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Title and Description */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-white mb-2">
                  {vid.title}
                </h3>
                {vid.description && (
                  <p className="text-sm text-neutral-300 font-light leading-relaxed">
                    {vid.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
