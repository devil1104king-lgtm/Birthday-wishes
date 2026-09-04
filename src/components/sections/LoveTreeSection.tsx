import { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface LoveTreeSectionProps {
  treeMessage?: string;
}

export default function LoveTreeSection({ treeMessage }: LoveTreeSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [treeBloomed, setTreeBloomed] = useState(false);
  const [bloomedCount, setBloomedCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = (canvas.width = (rect.width || 420) * dpr);
    const height = (canvas.height = (rect.height || 420) * dpr);
    ctx.scale(dpr, dpr);

    const actualWidth = width / dpr;
    const actualHeight = height / dpr;

    // Branches and Leaves
    interface Blossom {
      x: number;
      y: number;
      targetSize: number;
      currentSize: number;
      color: string;
      alpha: number;
      delay: number;
      shape: 'heart' | 'blossom';
    }

    const blossoms: Blossom[] = [];
    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ffe4e6', '#ffedd5'];

    // Generate heart-shaped canopy coordinates
    const crownCenterX = actualWidth / 2;
    const crownCenterY = actualHeight * 0.42;
    const canopyScale = Math.min(actualWidth, actualHeight) * 0.32;

    const totalBlossoms = 95;
    for (let i = 0; i < totalBlossoms; i++) {
      // Parametric heart formula
      const t = Math.PI * 2 * (i / totalBlossoms);
      const r = Math.sqrt(Math.random()) * 0.9 + 0.1; // fill interior
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const bx = crownCenterX + (hx / 16) * canopyScale * r + (Math.random() - 0.5) * 16;
      const by = crownCenterY + (hy / 16) * canopyScale * r + (Math.random() - 0.5) * 16;

      blossoms.push({
        x: bx,
        y: by,
        targetSize: Math.random() * 7 + 6,
        currentSize: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.3 + 0.7,
        delay: Math.random() * 80 + 30, // appears after trunk grows
        shape: Math.random() > 0.3 ? 'heart' : 'blossom',
      });
    }

    let frame = 0;

    function drawBranch(
      startX: number,
      startY: number,
      len: number,
      angle: number,
      branchWidth: number,
      growthProgress: number
    ) {
      if (growthProgress <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.translate(startX, startY);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.moveTo(0, 0);

      const actualLen = len * Math.min(1, growthProgress);
      ctx.lineTo(0, -actualLen);

      ctx.strokeStyle = '#9f1239'; // rich rose trunk
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.lineWidth = branchWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      if (actualLen < len) {
        ctx.restore();
        return;
      }

      // Branch out if branch is long enough
      if (len > 25) {
        const nextGrowth = Math.max(0, (growthProgress - 0.35) * 1.5);
        drawBranch(0, -len, len * 0.72, -22, branchWidth * 0.68, nextGrowth);
        drawBranch(0, -len, len * 0.72, 22, branchWidth * 0.68, nextGrowth);
        drawBranch(0, -len * 0.7, len * 0.55, -38, branchWidth * 0.55, nextGrowth);
        drawBranch(0, -len * 0.7, len * 0.55, 38, branchWidth * 0.55, nextGrowth);
      }

      ctx.restore();
    }

    function renderHeart(bx: number, by: number, size: number, color: string, alpha: number) {
      ctx.save();
      ctx.translate(bx, by);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const top = size * 0.3;
      ctx.moveTo(0, top);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, top);
      ctx.bezierCurveTo(-size / 2, (size + top) / 2, 0, (size + top) / 1.5, 0, size);
      ctx.bezierCurveTo(0, (size + top) / 1.5, size / 2, (size + top) / 2, size / 2, top);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, top);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, actualWidth, actualHeight);

      // 1. Draw growing trunk and branches
      const trunkProgress = Math.min(1, frame / 50);
      drawBranch(actualWidth / 2, actualHeight * 0.95, actualHeight * 0.28, 0, 9, trunkProgress);

      // 2. Draw blooming hearts
      let currentlyBloomed = 0;
      for (const b of blossoms) {
        if (frame > b.delay) {
          if (b.currentSize < b.targetSize) {
            b.currentSize += 0.3;
          }
          currentlyBloomed++;
          renderHeart(b.x, b.y, b.currentSize, b.color, b.alpha);
        }
      }

      setBloomedCount(currentlyBloomed);

      if (currentlyBloomed > totalBlossoms * 0.7 && !treeBloomed) {
        setTreeBloomed(true);
      }

      if (frame < 180 || currentlyBloomed < totalBlossoms) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Subtle idle pulse
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section id="love-tree-section" className="relative py-16 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wider uppercase mb-3">
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          <span>The Love Tree</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
          A Tree Growing Love For You
        </h2>
        <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
          Every branch represents a cherished moment, blooming with glowing hearts.
        </p>

        {/* Tree Canvas */}
        <div className="relative w-full max-w-[420px] aspect-square mx-auto bg-neutral-950/60 rounded-3xl border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.15)] flex items-center justify-center p-2 backdrop-blur-sm overflow-hidden group">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            title="Magical Heart Tree"
          />

          {/* Floating Message after tree blooms */}
          <div
            id="love-tree-message"
            className={`absolute bottom-5 inset-x-4 bg-neutral-900/90 backdrop-blur-md border border-rose-500/30 py-3 px-4 rounded-2xl shadow-xl transition-all duration-700 ${
              treeBloomed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <p className="text-rose-200 font-serif italic text-sm sm:text-base font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{treeMessage || 'Growing a little more love for you every day. ❤️'}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
