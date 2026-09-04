import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import {
  Settings,
  Music,
  Heart,
  Image,
  Film,
  Calendar,
  Sparkles,
  Layers,
  Save,
  RotateCcw,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Clock,
  Palette,
  Eye,
  X,
  Menu,
  ChevronDown,
  Upload,
  Loader2,
} from 'lucide-react';
import {
  AdminDataBundle,
  SiteSettings,
  HeroSection,
  MusicItem,
  MessageItem,
  ShayariItem,
  MemoryItem,
  VideoItem,
  LoveCardItem,
  TimelineItem,
  SurpriseSections,
  AppearanceSettings,
  CountdownSettings,
} from '../../types';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onViewSite: () => void;
}

type TabType =
  | 'settings'
  | 'hero'
  | 'music'
  | 'messages'
  | 'shayari'
  | 'cards'
  | 'memories'
  | 'videos'
  | 'timeline'
  | 'surprises'
  | 'appearance';

export default function AdminDashboard({ token, onLogout, onViewSite }: AdminDashboardProps) {
  const [data, setData] = useState<AdminDataBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('settings');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Modals for adding/editing items
  const [editingItem, setEditingItem] = useState<{
    collection: string;
    item: any;
    isNew: boolean;
  } | null>(null);

  // File upload state
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (editingItem) {
          setEditingItem({
            ...editingItem,
            item: { ...editingItem.item, [key]: json.data.url },
          });
        }
        showToast('success', `File "${json.data.filename}" uploaded successfully!`);
      } else {
        showToast('error', json.error || 'Failed to upload media file');
      }
    } catch (err: any) {
      showToast('error', err.message || 'File upload failed');
    } finally {
      setUploadingKey(null);
      if (e.target) e.target.value = '';
    }
  };

  // Fetch full data bundle
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
      } else {
        setSaveStatus({ type: 'error', message: json.error || 'Failed to load data' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Network connection failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setSaveStatus({ type, message });
    setTimeout(() => {
      setSaveStatus(null);
    }, 4000);
  };

  // Generic section updater
  const handleSaveSection = async (endpoint: string, payload: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `${endpoint.toUpperCase()} changes saved successfully!`);
        // Update local state and sync hero recipient if settings were updated
        if (data) {
          const updatedHero =
            endpoint === 'settings' && data.hero
              ? { ...data.hero, recipientName: json.data?.recipientName || '' }
              : data.hero;
          const updatedCountdown =
            endpoint === 'settings' && data.countdown
              ? {
                  ...data.countdown,
                  targetDate: json.data?.birthdayDate,
                  targetTime: json.data?.birthdayTime || '00:00',
                  timezone: json.data?.timezone || 'Asia/Kolkata',
                }
              : data.countdown;
          setData({ ...data, [endpoint]: json.data, hero: updatedHero, countdown: updatedCountdown });
        }
      } else {
        showToast('error', json.error || 'Failed to update section');
      }
    } catch (err) {
      showToast('error', 'Network error during save');
    } finally {
      setSaving(false);
    }
  };

  // Reset to seed defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Are you sure you want to reset all site content and messages to their romantic defaults?')) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        showToast('success', 'Reset complete! Romantic default content restored.');
      } else {
        showToast('error', json.error || 'Failed to reset data');
      }
    } catch (err) {
      showToast('error', 'Failed to communicate with server');
    } finally {
      setSaving(false);
    }
  };

  // Collection CRUD
  const handleSaveItemModal = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { collection, item, isNew } = editingItem;
    setSaving(true);

    try {
      const url = isNew
        ? `/api/admin/collection/${collection}`
        : `/api/admin/collection/${collection}/${item._id || item.id}`;

      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Item ${isNew ? 'added' : 'updated'} successfully!`);
        setEditingItem(null);
        fetchDashboardData();
      } else {
        showToast('error', json.error || 'Failed to save item');
      }
    } catch (err) {
      showToast('error', 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (collection: string, id: string) => {
    if (!window.confirm('Delete this item permanently?')) return;
    try {
      const res = await fetch(`/api/admin/collection/${collection}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('success', 'Item deleted');
        fetchDashboardData();
      } else {
        showToast('error', 'Failed to delete');
      }
    } catch {
      showToast('error', 'Network error');
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4"></div>
        <p className="text-neutral-400 font-serif">Loading Admin Workspace...</p>
      </div>
    );
  }

  const navTabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'settings', label: 'General Settings', icon: Settings },
    { id: 'messages', label: 'Birthday Message', icon: Heart },
    { id: 'shayari', label: 'Shayari & Poetry', icon: Layers },
    { id: 'memories', label: 'Images & Memories', icon: Image },
    { id: 'videos', label: 'Videos & Reels', icon: Film },
    { id: 'timeline', label: 'Our Story Timeline', icon: Calendar },
    { id: 'music', label: 'Music Playlist', icon: Music },
    { id: 'surprises', label: 'Interactive Surprises & Cake', icon: Sparkles },
    { id: 'appearance', label: 'Theme & Background FX', icon: Palette },
    { id: 'hero', label: 'Hero Celebration Banner', icon: Clock },
    { id: 'cards', label: 'Love Cards & Reasons', icon: Heart },
  ];

  const currentTabObj = navTabs.find((t) => t.id === activeTab) || navTabs[0];

  return (
    <div id="admin-dashboard" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
              Birthday Admin Dashboard
            </h1>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate max-w-[140px] sm:max-w-none">
              For <span className="text-rose-400 font-medium">{data.settings.recipientName}</span> • Real-time DB Sync
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            id="admin-view-site-button"
            onClick={onViewSite}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Preview Site</span>
          </button>

          <button
            id="admin-reset-defaults-button"
            onClick={handleResetDefaults}
            disabled={saving}
            className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-neutral-800 hover:bg-rose-950/60 hover:text-rose-300 text-xs font-medium text-neutral-400 border border-neutral-700 transition-colors cursor-pointer"
            title="Restore romantic defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            id="admin-logout-button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-xs font-medium text-rose-300 border border-rose-800/40 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Collapsible Navigation Selector (Phones & Tablets) */}
      <div className="md:hidden border-b border-neutral-800 bg-neutral-900/90 px-4 py-2.5 flex items-center justify-between">
        <button
          id="admin-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-medium text-white px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 active:bg-neutral-700 transition-colors cursor-pointer min-h-[44px]"
        >
          <Menu className="w-4 h-4 text-rose-400" />
          <span className="text-rose-300">{currentTabObj.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        <span className="text-[11px] text-neutral-400 font-mono">
          Tab {navTabs.findIndex(t => t.id === activeTab) + 1}/{navTabs.length}
        </span>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900/95 border-b border-neutral-800 p-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-fade-in z-30">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all text-left cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/80 bg-neutral-950/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Status Toast Notification */}
      {saveStatus && (
        <div
          id="admin-toast-message"
          className={`fixed top-16 right-4 sm:right-6 z-50 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xl transition-all ${
            saveStatus.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border border-rose-500/40'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Fixed Sidebar */}
        <aside className="hidden md:flex w-64 bg-neutral-900/60 border-r border-neutral-800/80 p-4 flex-col gap-1 shrink-0">
          <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 px-3 py-1 mb-1">
            Navigation Sections
          </div>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-5xl overflow-y-auto">
          {/* TAB 1: GENERAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <h2 className="text-xl font-serif font-bold text-white">General Surprise Settings</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Customize the recipient's name, birthday countdown schedule, and surprise titles.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection('settings', data.settings);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase font-medium text-neutral-400 mb-2">
                      Recipient Pet Name / Nickname
                    </label>
                    <input
                      type="text"
                      value={data.settings.recipientName}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: { ...data.settings, recipientName: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-neutral-400 mb-2">
                      Relationship / Nickname Label
                    </label>
                    <input
                      type="text"
                      value={data.settings.relationshipLabel}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: { ...data.settings, relationshipLabel: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-neutral-400 mb-2">
                      Birthday Date (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      value={data.settings.birthdayDate}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: { ...data.settings, birthdayDate: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-neutral-400 mb-2">
                      Birthday Time (HH:MM)
                    </label>
                    <input
                      type="time"
                      value={data.settings.birthdayTime}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: { ...data.settings, birthdayTime: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-neutral-400 mb-2">
                      Timezone (Default: Asia/Kolkata)
                    </label>
                    <input
                      type="text"
                      value={data.settings.timezone || 'Asia/Kolkata'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: { ...data.settings, timezone: e.target.value },
                        })
                      }
                      placeholder="Asia/Kolkata"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <h3 className="text-sm font-semibold text-rose-300 mb-4">
                    Opening Screen & Ending Texts
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase font-medium text-neutral-400 mb-1.5">
                        Mystery Opening Title
                      </label>
                      <input
                        type="text"
                        value={data.settings.openingTitle}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: { ...data.settings, openingTitle: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium text-neutral-400 mb-1.5">
                        Mystery Opening Button Text
                      </label>
                      <input
                        type="text"
                        value={data.settings.openingButtonText}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: { ...data.settings, openingButtonText: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium text-neutral-400 mb-1.5">
                        Final Surprise Message
                      </label>
                      <textarea
                        rows={3}
                        value={data.settings.finalSurpriseMessage}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: { ...data.settings, finalSurpriseMessage: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg hover:shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save General Settings</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <h2 className="text-xl font-serif font-bold text-white">Hero Header Configuration</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Adjust the main title, glowing aura, balloons, and floating romantic elements.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection('hero', data.hero);
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs uppercase font-medium text-neutral-400 mb-2">
                    Hero Main Heading
                  </label>
                  <input
                    type="text"
                    value={data.hero.mainHeading}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, mainHeading: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-neutral-400 mb-2">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero.subtitle}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.hero.showFloatingBalloons}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, showFloatingBalloons: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-rose-500"
                    />
                    <span className="text-xs text-neutral-300">Show Floating 3D Balloons</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.hero.showGlowEffect}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, showGlowEffect: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-rose-500"
                    />
                    <span className="text-xs text-neutral-300">Show Radiant Aura Glow</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg hover:shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hero Section</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MUSIC PLAYLIST */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Romantic Soundtrack</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage background songs, audio URLs (MP3), loop preferences, and covers.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      collection: 'music',
                      isNew: true,
                      item: {
                        title: 'Tum Hi Ho (Acoustic)',
                        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
                        coverUrl: '',
                        loop: true,
                        volume: 0.7,
                        enabled: true,
                        order: data.music.length + 1,
                      },
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Song</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.music.map((item, idx) => (
                  <div
                    key={item._id || item.id || idx}
                    className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <Music className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{item.title}</h4>
                        <p className="text-xs text-neutral-400 truncate max-w-xs sm:max-w-md">
                          {item.audioUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setEditingItem({
                            collection: 'music',
                            isNew: false,
                            item: { ...item },
                          })
                        }
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        title="Edit track"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('music', item._id || item.id || '')}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-950/80 text-rose-400"
                        title="Delete track"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EMOTIONAL LETTERS & MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Emotional Love Letters</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Heartfelt letters displayed in Hinglish/Hindi and optional English translation.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      collection: 'messages',
                      isNew: true,
                      item: {
                        title: 'To My Favorite Human ❤️',
                        hindiText: 'Tum sirf meri pasand nahi ho, meri aadat ho...',
                        englishText: 'You are not just my choice, you are my habit and peace.',
                        author: 'Forever Yours',
                        category: 'birthday',
                        enabled: true,
                        order: data.messages.length + 1,
                      },
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Letter</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.messages.map((msg, idx) => (
                  <div
                    key={msg._id || msg.id || idx}
                    className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-serif font-bold text-rose-300">{msg.title}</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setEditingItem({
                              collection: 'messages',
                              isNew: false,
                              item: { ...msg },
                            })
                          }
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('messages', msg._id || msg.id || '')}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-950/80 text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 whitespace-pre-line line-clamp-3 font-serif italic mb-2">
                      {msg.hindiText}
                    </p>
                    <span className="text-[11px] text-neutral-500">— {msg.author}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SHAYARI */}
          {activeTab === 'shayari' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Poetry & Shayari</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage the poetry cards shown in the romantic reader carousel.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      collection: 'shayari',
                      isNew: true,
                      item: {
                        heading: 'तेरी मुस्कान',
                        hindiText: 'तेरे चेहरे की चमक कभी कम न हो,\nतेरी जिंदगी में कभी कोई ग़म न हो।',
                        englishSubtitle: 'May your smile never fade, and your heart know only joy.',
                        animationStyle: 'fade',
                        enabled: true,
                        order: data.shayari.length + 1,
                      },
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Shayari</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.shayari.map((sh, idx) => (
                  <div
                    key={sh._id || sh.id || idx}
                    className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-rose-400">{sh.heading}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setEditingItem({
                                collection: 'shayari',
                                isNew: false,
                                item: { ...sh },
                              })
                            }
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('shayari', sh._id || sh.id || '')}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/80 text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-200 font-serif leading-relaxed whitespace-pre-line mb-3">
                        {sh.hindiText}
                      </p>
                    </div>
                    {sh.englishSubtitle && (
                      <p className="text-xs text-neutral-500 italic border-t border-neutral-800/80 pt-2">
                        "{sh.englishSubtitle}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SPECIAL REASONS / LOVE CARDS */}
          {activeTab === 'cards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Reasons You're Special</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Cards highlighting the sweet, quirky, and meaningful reasons she is loved.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      collection: 'loveCards',
                      isNew: true,
                      item: {
                        title: 'Your Kindness',
                        text: 'You have this soft, gentle way of listening and caring that makes anyone feel safe.',
                        icon: 'Heart',
                        animation: 'flip',
                        enabled: true,
                        order: data.loveCards.length + 1,
                      },
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Reason Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.loveCards.map((card, idx) => (
                  <div
                    key={card._id || card.id || idx}
                    className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-rose-400 font-serif">
                          {card.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setEditingItem({
                                collection: 'loveCards',
                                isNew: false,
                                item: { ...card },
                              })
                            }
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('loveCards', card._id || card.id || '')}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/80 text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed font-light">
                        {card.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PHOTO GALLERY / MEMORIES */}
          {activeTab === 'memories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Photo Gallery & Memories</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Upload image URLs, captions, and dates for the memory grid and modal.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      collection: 'memories',
                      isNew: true,
                      item: {
                        title: 'Special Day',
                        imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
                        caption: 'A day filled with laughs',
                        date: 'Sept 2025',
                        description: 'A moment etched forever.',
                        enabled: true,
                        order: data.memories.length + 1,
                      },
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Memory</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.memories.map((mem, idx) => (
                  <div
                    key={mem._id || mem.id || idx}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] bg-neutral-950 overflow-hidden relative">
                      <img
                        src={mem.imageUrl}
                        alt={mem.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white backdrop-blur-sm">
                        {mem.date}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-white truncate">{mem.title}</h4>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setEditingItem({
                                collection: 'memories',
                                isNew: false,
                                item: { ...mem },
                              })
                            }
                            className="p-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('memories', mem._id || mem.id || '')}
                            className="p-1 rounded bg-neutral-800 text-rose-400 hover:bg-rose-950/80"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: VIDEOS & REELS */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Reels & Videos</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Support for direct MP4 videos, YouTube embeds, and Instagram Reels.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      collection: 'videos',
                      isNew: true,
                      item: {
                        title: 'Our Sweet Reel',
                        description: 'A moment captured on camera.',
                        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glitter-bokeh-lights-loop-42866-large.mp4',
                        thumbnailUrl: '',
                        platform: 'mp4',
                        enabled: true,
                        order: data.videos.length + 1,
                      },
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.videos.map((vid, idx) => (
                  <div
                    key={vid._id || vid.id || idx}
                    className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-rose-400">{vid.title}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {vid.platform}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate mb-3">{vid.videoUrl}</p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setEditingItem({
                            collection: 'videos',
                            isNew: false,
                            item: { ...vid },
                          })
                        }
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('videos', vid._id || vid.id || '')}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/80 text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: STORY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Our Journey Timeline</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Add milestone events celebrating key memories, dates, and growth.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      collection: 'timeline',
                      isNew: true,
                      item: {
                        title: 'The First Spark',
                        date: 'The Beginning',
                        text: 'The day we first talked, and time seemed to stand still.',
                        image: '',
                        animation: 'slide',
                        enabled: true,
                        order: data.timeline.length + 1,
                      },
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.timeline.map((item, idx) => (
                  <div
                    key={item._id || item.id || idx}
                    className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[11px] text-rose-400 font-semibold">{item.date}</span>
                      <h4 className="text-sm font-medium text-white">{item.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1">{item.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setEditingItem({
                            collection: 'timeline',
                            isNew: false,
                            item: { ...item },
                          })
                        }
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('timeline', item._id || item.id || '')}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/80 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: INTERACTIVE SURPRISES (Cake, Tree, Countdown) */}
          {activeTab === 'surprises' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <h2 className="text-xl font-serif font-bold text-white">
                  Interactive Features & Surprises
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Configure the interactive birthday cake, candle blowing, and blooming love tree.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection('surprises', data.surprises);
                }}
                className="space-y-5"
              >
                {/* Cake Section */}
                <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-rose-300">Interactive Birthday Cake</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.surprises.showCake}
                        onChange={(e) =>
                          setData({
                            ...data,
                            surprises: { ...data.surprises, showCake: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-rose-500"
                      />
                      <span className="text-xs text-neutral-400">Enable Cake</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-neutral-400 mb-1.5">
                      Cake Section Heading
                    </label>
                    <input
                      type="text"
                      value={data.surprises.cakeHeading}
                      onChange={(e) =>
                        setData({
                          ...data,
                          surprises: { ...data.surprises, cakeHeading: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-neutral-400 mb-1.5">
                      Wish Granted Message (revealed after blowing candles)
                    </label>
                    <input
                      type="text"
                      value={data.surprises.cakeWishGrantedText}
                      onChange={(e) =>
                        setData({
                          ...data,
                          surprises: { ...data.surprises, cakeWishGrantedText: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Love Tree Section */}
                <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-rose-300">Blooming Love Tree</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.surprises.showTreeAnimation}
                        onChange={(e) =>
                          setData({
                            ...data,
                            surprises: { ...data.surprises, showTreeAnimation: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-rose-500"
                      />
                      <span className="text-xs text-neutral-400">Enable Tree Canvas</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-neutral-400 mb-1.5">
                      Love Tree Floating Message
                    </label>
                    <input
                      type="text"
                      value={data.surprises.treeMessage}
                      onChange={(e) =>
                        setData({
                          ...data,
                          surprises: { ...data.surprises, treeMessage: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg hover:shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Surprises</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 11: THEME & APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <h2 className="text-xl font-serif font-bold text-white">Visuals, Theme & Effects</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Adjust glowing romantic animations, particle effects, heart bursts, and floating petals.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection('appearance', data.appearance);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.appearance.heartsEnabled}
                      onChange={(e) =>
                        setData({
                          ...data,
                          appearance: { ...data.appearance, heartsEnabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-rose-500"
                    />
                    <span className="text-xs text-neutral-300">Floating Glowing Hearts</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.appearance.petalsEnabled}
                      onChange={(e) =>
                        setData({
                          ...data,
                          appearance: { ...data.appearance, petalsEnabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-rose-500"
                    />
                    <span className="text-xs text-neutral-300">Drifting Rose Petals</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.appearance.backgroundMotionEnabled}
                      onChange={(e) =>
                        setData({
                          ...data,
                          appearance: {
                            ...data.appearance,
                            backgroundMotionEnabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-rose-500"
                    />
                    <span className="text-xs text-neutral-300">Background Canvas Engine</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.appearance.particlesEnabled}
                      onChange={(e) =>
                        setData({
                          ...data,
                          appearance: { ...data.appearance, particlesEnabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-rose-500"
                    />
                    <span className="text-xs text-neutral-300">Starlight Dust Particles</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg hover:shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Appearance Settings</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* CRUD MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-serif font-bold text-white mb-4">
              {editingItem.isNew ? 'Add New Item' : 'Edit Item'} ({editingItem.collection})
            </h3>

            <form onSubmit={handleSaveItemModal} className="space-y-4">
              {/* Dynamic inputs based on object keys */}
              {Object.keys(editingItem.item)
                .filter((k) => k !== '_id' && k !== 'id' && k !== '__v')
                .map((key) => {
                  const val = editingItem.item[key];
                  const isBool = typeof val === 'boolean';
                  const isTextarea =
                    key.toLowerCase().includes('text') ||
                    key.toLowerCase().includes('description') ||
                    key.toLowerCase().includes('caption');

                  return (
                    <div key={key}>
                      <label className="block text-xs uppercase font-medium text-neutral-400 mb-1.5">
                        {key}
                      </label>
                      {isBool ? (
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              item: { ...editingItem.item, [key]: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-rose-500"
                        />
                      ) : isTextarea ? (
                        <textarea
                          rows={3}
                          value={val || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              item: { ...editingItem.item, [key]: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                        />
                      ) : key.toLowerCase().includes('url') ||
                        key.toLowerCase().includes('image') ||
                        key.toLowerCase().includes('video') ||
                        key.toLowerCase().includes('audio') ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={val || ''}
                              placeholder="https://... or upload file"
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  item: { ...editingItem.item, [key]: e.target.value },
                                })
                              }
                              className="flex-grow px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                            />
                            <label className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                              {uploadingKey === key ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>{uploadingKey === key ? 'Uploading...' : 'Upload'}</span>
                              <input
                                type="file"
                                accept={
                                  key.toLowerCase().includes('video')
                                    ? 'video/*'
                                    : key.toLowerCase().includes('audio')
                                    ? 'audio/*'
                                    : 'image/*'
                                }
                                disabled={uploadingKey !== null}
                                onChange={(e) => handleFileUpload(e, key)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Helper validation hints */}
                          {key === 'videoUrl' && (
                            <p className="text-[10px] text-neutral-400 leading-tight">
                              💡 Direct <span className="text-rose-300">.mp4</span> or{' '}
                              <span className="text-rose-300">YouTube</span> embed URLs are supported.
                              For reels, upload the video file directly for full-screen streaming.
                            </p>
                          )}
                          {key === 'audioUrl' && (
                            <p className="text-[10px] text-neutral-400 leading-tight">
                              💡 Direct <span className="text-rose-300">.mp3/.ogg</span> link or upload
                              an audio file.
                            </p>
                          )}

                          {/* Live preview if URL exists */}
                          {val && (key.toLowerCase().includes('image') || key.toLowerCase().includes('thumbnail') || key.toLowerCase().includes('cover')) && (
                            <div className="w-20 h-14 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                              <img
                                src={val}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={val || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              item: { ...editingItem.item, [key]: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
