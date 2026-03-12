'use client';

import { useEffect, useRef } from 'react';

export default function SnowCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const flakes = Array.from({ length: 120 }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      r:       Math.random() * 3 + 1,
      speed:   Math.random() * 0.8 + 0.3,
      drift:   Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flakes.forEach(f => {
        f.twinkle += 0.02;
        const alpha = f.opacity * (0.7 + 0.3 * Math.sin(f.twinkle));
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186,230,253,${alpha})`;
        ctx.fill();
        f.y += f.speed;
        f.x += f.drift;
        if (f.y > canvas.height + 5) { f.y = -5; f.x = Math.random() * canvas.width; }
        if (f.x > canvas.width  + 5) f.x = -5;
        if (f.x < -5)                f.x = canvas.width + 5;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="snow-canvas" />;
}