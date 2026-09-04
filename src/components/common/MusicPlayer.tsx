import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import {
  Play, Pause, Volume2, VolumeX, SkipForward, SkipBack,
  Music as MusicIcon, AlertCircle, ChevronUp, ChevronDown, ListMusic
} from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = musicList && musicList.length > 0 ? musicList[currentIndex] : null;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
    };

    const handleEnded = () => {
      if (currentTrack?.loop && musicList.length === 1) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (musicList.length > 1) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      setAudioError('Audio unavailable');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
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
        .then(() => {
          setIsPlaying(true);
          setAudioError(null);
        })
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

  const handlePrev = () => {
    if (musicList.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + musicList.length) % musicList.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!musicList || musicList.length === 0 || !currentTrack) {
    return null;
  }

  return (
    <div
      id="floating-music-player"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end"
    >
      {/* Expanded Controls Card */}
      {isExpanded && (
        <div className="mb-2 p-4 w-72 sm:w-80 bg-neutral-900/95 backdrop-blur-xl border border-rose-500/30 rounded-2xl shadow-2xl flex flex-col gap-3 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 tracking-wider uppercase flex items-center gap-1.5">
              <MusicIcon className="w-3.5 h-3.5" />
              Now Playing
            </span>
            <div className="flex items-center gap-1">
              {musicList.length > 1 && (
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                    showPlaylist ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                  title="Playlist"
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>{musicList.length}</span>
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Playlist drop */}
          {showPlaylist && (
            <div className="max-h-32 overflow-y-auto space-y-1 pr-1 border-y border-neutral-800 py-2">
              {musicList.map((item, idx) => (
                <button
                  key={item._id || item.id || idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowPlaylist(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    idx === currentIndex
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium'
                      : 'hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  {idx === currentIndex && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Title & Artist */}
          <div>
            <h4 className="text-sm font-serif font-bold text-white truncate">
              {currentTrack.title}
            </h4>
            <span className="text-[11px] text-neutral-400">
              {isPlaying ? 'Playing Birthday Soundtrack' : 'Music Paused'}
            </span>
          </div>

          {/* Progress Seek Bar */}
          <div className="flex flex-col gap-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 pt-1">
            <button onClick={toggleMute} className="text-neutral-400 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setIsMuted(false);
                setVolume(parseFloat(e.target.value));
              }}
              className="flex-grow h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[10px] text-neutral-400 font-mono w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Main Floating Pill / Widget */}
      <div className="flex items-center gap-2.5 bg-neutral-900/90 backdrop-blur-md border border-rose-500/30 text-white px-3.5 py-2.5 rounded-full shadow-2xl hover:border-rose-500/50 transition-all duration-300">
        {/* Disc Icon */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-rose-500/20 border border-rose-500/40 shrink-0 cursor-pointer"
        >
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

        {/* Title & Status */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col max-w-[120px] sm:max-w-[160px] overflow-hidden cursor-pointer"
        >
          <span className="text-xs font-medium text-neutral-200 truncate tracking-wide">
            {currentTrack.title}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isPlaying ? (
              <div className="flex items-center gap-0.5 h-2">
                <span className="w-0.5 h-full bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-0.5 h-2/3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-0.5 h-full bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            ) : (
              <span className="text-[10px] text-neutral-400">Paused</span>
            )}
            {audioError && (
              <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                <AlertCircle className="w-2.5 h-2.5" /> Tap
              </span>
            )}
          </div>
        </div>

        {/* Play/Pause & Skip Buttons */}
        <div className="flex items-center gap-1 ml-1">
          {musicList.length > 1 && (
            <button
              onClick={handlePrev}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label="Previous track"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            id="music-play-pause-button"
            onClick={togglePlay}
            className="p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-sm"
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          {musicList.length > 1 && (
            <button
              id="music-next-button"
              onClick={handleNext}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label="Next track"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors ml-0.5"
            aria-label="Expand player"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
