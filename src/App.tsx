import { useState, useEffect } from 'react';
import { PublicDataBundle } from './types';
import BackgroundEffects from './components/common/BackgroundEffects';
import MusicPlayer from './components/common/MusicPlayer';
import Footer from './components/common/Footer';
import OpeningScreen from './components/sections/OpeningScreen';
import CinematicIntro from './components/sections/CinematicIntro';
import HeroSection from './components/sections/HeroSection';
import CountdownSection from './components/sections/CountdownSection';
import EmotionalMessage from './components/sections/EmotionalMessage';
import LoveTreeSection from './components/sections/LoveTreeSection';
import BirthdayCakeSection from './components/sections/BirthdayCakeSection';
import ShayariSection from './components/sections/ShayariSection';
import LoveCardsSection from './components/sections/LoveCardsSection';
import MemoryGallerySection from './components/sections/MemoryGallerySection';
import VideoReelsSection from './components/sections/VideoReelsSection';
import StoryTimelineSection from './components/sections/StoryTimelineSection';
import FinalSurpriseSection from './components/sections/FinalSurpriseSection';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const [data, setData] = useState<PublicDataBundle | null>(null);
  const [loading, setLoading] = useState(true);

  // Experience Flow States
  const [hasOpened, setHasOpened] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [autoPlayMusic, setAutoPlayMusic] = useState(false);

  // Admin routing
  const [viewMode, setViewMode] = useState<'site' | 'admin_login' | 'admin_dashboard'>('site');
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('admin_token');
  });

  // Fetch public surprise data
  const loadData = async () => {
    try {
      const res = await fetch('/api/public/all');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          // Set dynamic browser tab title if provided
          if (json.data.settings?.siteTitle) {
            document.title = json.data.settings.siteTitle;
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch from server, using cached/default state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Opening Surprise Click
  const handleOpenSurprise = () => {
    setHasOpened(true);
    setShowIntro(true);
    setAutoPlayMusic(true);
  };

  // Intro completion handler
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Replay celebration handler
  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowIntro(true);
  };

  // Scroll to explore
  const handleScrollToExplore = () => {
    const nextElem = document.getElementById('countdown-section') || document.getElementById('emotional-message-section');
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Admin Auth Handlers
  const handleLoginSuccess = (token: string) => {
    sessionStorage.setItem('admin_token', token);
    setAdminToken(token);
    setViewMode('admin_dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setAdminToken(null);
    setViewMode('site');
    loadData();
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-serif text-neutral-400">Preparing something beautiful...</p>
      </div>
    );
  }

  // Render Admin Flow
  if (viewMode === 'admin_login') {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={() => setViewMode('site')}
      />
    );
  }

  if (viewMode === 'admin_dashboard' && adminToken) {
    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleLogout}
        onViewSite={() => {
          setViewMode('site');
          loadData();
        }}
      />
    );
  }

  // Render Main Experience
  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 selection:bg-rose-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Background Animated Canvas (Stars, Petals, Hearts) */}
      <BackgroundEffects appearance={data.appearance} />

      {/* Floating Music Player */}
      <MusicPlayer
        musicList={data.music?.filter((m) => m.enabled !== false) || []}
        autoPlayTriggered={autoPlayMusic}
      />

      {/* Mystery Opening Screen */}
      {!hasOpened && (
        <OpeningScreen
          settings={data.settings}
          onOpen={handleOpenSurprise}
        />
      )}

      {/* Cinematic Poetic Sequence */}
      {hasOpened && showIntro && (
        <CinematicIntro
          recipientName={data.hero?.recipientName || data.settings?.recipientName || 'Meri Jaan'}
          onComplete={handleIntroComplete}
        />
      )}

      {/* Main Surprise Sections (Visible after opening) */}
      {hasOpened && !showIntro && (
        <div className="relative z-10 animate-fade-in transition-opacity duration-1000">
          {/* 1. Hero Celebration Section */}
          <HeroSection
            hero={data.hero}
            settings={data.settings}
            onScrollToExplore={handleScrollToExplore}
          />

          {/* 2. Birthday Countdown Section */}
          {data.countdown?.enabled !== false && (
            <CountdownSection
              countdown={data.countdown}
              settings={data.settings}
            />
          )}

          {/* 3. Emotional Hindi/English Letter */}
          <EmotionalMessage
            messages={data.messages?.filter((m) => m.enabled !== false) || []}
          />

          {/* 4. Interactive Cake Candle Blowing */}
          {data.surprises?.showCake !== false && (
            <BirthdayCakeSection surprises={data.surprises} />
          )}

          {/* 5. Blooming Canvas Love Tree */}
          {data.surprises?.showTreeAnimation !== false && (
            <LoveTreeSection treeMessage={data.surprises?.treeMessage} />
          )}

          {/* 6. Romantic Shayari Reader */}
          <ShayariSection
            shayariList={data.shayari?.filter((s) => s.enabled !== false) || []}
          />

          {/* 7. Special Reasons / Love Cards */}
          <LoveCardsSection
            cards={data.loveCards?.filter((c) => c.enabled !== false) || []}
          />

          {/* 8. Photo Memories Gallery with Lightbox */}
          <MemoryGallerySection
            memories={data.memories?.filter((m) => m.enabled !== false) || []}
          />

          {/* 9. Video & Reel Moments */}
          <VideoReelsSection
            videos={data.videos?.filter((v) => v.enabled !== false) || []}
          />

          {/* 10. Our Journey Timeline */}
          <StoryTimelineSection
            timeline={data.timeline?.filter((t) => t.enabled !== false) || []}
            letterTitle={data.surprises?.loveLetterTitle}
            letterText={data.surprises?.loveLetterText}
          />

          {/* 11. Final Grand Surprise & Replay Button */}
          <FinalSurpriseSection
            settings={data.settings}
            onReplay={handleReplay}
          />

          {/* 12. Footer with Discreet Admin Portal Access */}
          <Footer
            settings={data.settings}
            onOpenAdmin={() => {
              if (adminToken) {
                setViewMode('admin_dashboard');
              } else {
                setViewMode('admin_login');
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
