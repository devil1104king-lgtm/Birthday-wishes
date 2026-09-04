import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, Music as MusicIcon, AlertCircle } from 'lucide-react';
import { MusicItem } from '../../types';

interface MusicPlayerProps {
  musicList: MusicItem[];
  autoPlayTriggered: boolean;
}

export default function MusicPlayer({ musicList, autoPlayTriggered }: MusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = musicList && musicList.length > 0 ? musicList[currentIndex] : null;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleEnded = () => {
      if (currentTrack?.loop && musicList.length === 1) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (musicList.length > 1) {
        handleNext();
      }
    };

    const handleError = () => {
      setAudioError('Audio unavailable');
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [musicList, currentIndex]);

  // Handle track changes and volume updates
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;
    setAudioError(null);

    audio.src = currentTrack.audioUrl;
    audio.loop = currentTrack.loop && musicList.length === 1;
    audio.volume = isMuted ? 0 : volume;

    if (autoPlayTriggered) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback prevented or file error:', err);
          setIsPlaying(false);
        });
    }
  }, [currentIndex, currentTrack, autoPlayTriggered]);

  // Volume & Mute adjustments
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setAudioError('Tap to play');
          setIsPlaying(false);
        });
    }
  };

  const handleNext = () => {
    if (musicList.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % musicList.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!musicList || musicList.length === 0 || !currentTrack) {
    return null;
  }

  return (
    <div
      id="floating-music-player"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-3 bg-neutral-900/85 backdrop-blur-md border border-rose-500/20 text-white px-3.5 py-2.5 rounded-full shadow-2xl hover:border-rose-500/40 transition-all duration-300"
    >
      {/* Cover / Icon */}
      <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-rose-500/20 border border-rose-500/40 shrink-0">
        {currentTrack.coverUrl ? (
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className={`w-full h-full object-cover ${isPlaying ? 'animate-spin' : ''}`}
            style={{ animationDuration: '6s' }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <MusicIcon className="w-4 h-4 text-rose-300" />
        )}
      </div>

      {/* Song title and animated soundwave */}
      <div className="flex flex-col max-w-[130px] sm:max-w-[170px] overflow-hidden">
        <span className="text-xs font-medium text-neutral-200 truncate tracking-wide">
          {currentTrack.title}
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          {isPlaying ? (
            <div className="flex items-center gap-0.5 h-2">
              <span className="w-0.5 h-full bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-0.5 h-2/3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-0.5 h-full bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              <span className="w-0.5 h-1/2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></span>
            </div>
          ) : (
            <span className="text-[10px] text-neutral-400">Paused</span>
          )}
          {audioError && (
            <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" /> Error
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 ml-1">
        <button
          id="music-play-pause-button"
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-300 transition-colors"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-rose-300" />}
        </button>

        {musicList.length > 1 && (
          <button
            id="music-next-button"
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 transition-colors"
            aria-label="Next track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="relative">
          <button
            id="music-volume-button"
            onClick={() => setShowVolumePopup(!showVolumePopup)}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 transition-colors"
            aria-label="Adjust volume"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Volume slider popup */}
          {showVolumePopup && (
            <div
              id="volume-popup"
              className="absolute bottom-10 right-0 p-3 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-xl flex flex-col items-center gap-2"
            >
              <input
                id="music-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setIsMuted(false);
                  setVolume(parseFloat(e.target.value));
                }}
                className="w-24 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <button
                onClick={toggleMute}
                className="text-[10px] text-neutral-400 hover:text-white"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
