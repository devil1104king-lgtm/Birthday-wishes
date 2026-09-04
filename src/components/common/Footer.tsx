import { Heart, Lock } from 'lucide-react';
import { SiteSettings } from '../../types';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export default function Footer({ settings, onOpenAdmin }: FooterProps) {
  const recipient = settings.recipientName || 'Meri Jaan';

  return (
    <footer className="relative py-12 px-6 border-t border-neutral-900 bg-neutral-950/80 backdrop-blur-md text-center text-xs text-neutral-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="flex items-center gap-1.5 font-light">
          <span>Crafted with infinite love for</span>
          <span className="text-rose-400 font-medium font-serif italic">{recipient}</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        </p>

        {/* Discreet Admin Lock Button */}
        <button
          id="open-admin-portal-link"
          onClick={onOpenAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-rose-500/40 text-neutral-400 hover:text-white transition-all text-[11px]"
          title="Open Admin Dashboard"
        >
          <Lock className="w-3 h-3 text-rose-400" />
          <span>Admin Portal</span>
        </button>
      </div>
    </footer>
  );
}
