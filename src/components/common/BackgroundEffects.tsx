import { useEffect, useRef } from 'react';
import { AppearanceSettings } from '../../types';

interface BackgroundEffectsProps {
  appearance?: AppearanceSettings;
}

export default function BackgroundEffects({ appearance }: BackgroundEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!appearance?.backgroundMotionEnabled || appearance.reducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = appearance?.particleDensity || 30;
    const heartCount = appearance?.heartsEnabled ? (appearance.heartDensity || 16) : 0;
    const petalCount = appearance?.petalsEnabled ? 12 : 0;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
      pulse: number;
      type: 'star' | 'heart' | 'petal';
      color: string;
      rotation: number;
      rotSpeed: number;
    }

    const particles: Particle[] = [];

    const colors = [
      appearance?.primaryColor || '#f43f5e',
      appearance?.secondaryColor || '#fb7185',
      appearance?.accentColor || '#f472b6',
      '#ffe4e6',
      '#ffffff',
    ];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        opacity: Math.random() * 0.7 + 0.2,
        fadeSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        pulse: Math.random() * Math.PI,
        type: 'star',
        color: '#ffffff',
        rotation: 0,
        rotSpeed: 0,
      });
    }

    // Create hearts
    for (let i = 0; i < heartCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.5 + 0.3),
        opacity: Math.random() * 0.6 + 0.2,
        fadeSpeed: Math.random() * 0.008 + 0.002,
        pulse: Math.random() * Math.PI,
        type: 'heart',
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.01,
      });
    }

    // Create petals
    for (let i = 0; i < petalCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedX: Math.sin(Math.random() * Math.PI) * 0.4 + 0.2,
        speedY: Math.random() * 0.6 + 0.4,
        opacity: Math.random() * 0.5 + 0.3,
        fadeSpeed: 0,
        pulse: 0,
        type: 'petal',
        color: '#fda4af',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.5, 0, size);
      // bottom right curve
      ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.5, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.type === 'heart') {
          p.x += Math.sin(p.y * 0.02) * 0.3;
          if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity);
        } else if (p.type === 'petal') {
          p.x += Math.sin(p.y * 0.015) * 0.6;
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          drawPetal(ctx, p);
        } else {
          // star / glow particle
          p.opacity += p.fadeSpeed;
          if (p.opacity > 0.9 || p.opacity < 0.15) {
            p.fadeSpeed = -p.fadeSpeed;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [appearance]);

  return (
    <canvas
      id="cinematic-canvas-background"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}
