
import React, { useEffect, useRef } from 'react';

export default function StarfieldBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;

    // Create twinkling stars
    const createStars = () => {
      const starCount = 30; // Reduced to a "handful" of stars
      const purpleHues = ['#A78BFA', '#C4B5FD', '#8B5CF6', '#DDD6FE'];
      starsRef.current = [];
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5, // Made stars slightly smaller
          opacity: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005, // Slower twinkle
          twinkleOffset: Math.random() * Math.PI * 2,
          color: purpleHues[Math.floor(Math.random() * purpleHues.length)]
        });
      }
    };

    // Create shooting stars
    const createShootingStar = () => {
      return {
        x: -50,
        y: Math.random() * height * 0.6, // Upper portion of screen
        speed: Math.random() * 8 + 4,
        length: Math.random() * 100 + 60, // Increased length for more noticeable streaks
        opacity: 1,
        angle: Math.random() * 0.5 + 0.2, // Slight downward angle
        active: true,
        trail: [] // Add trail array to store previous positions
      };
    };

    createStars();

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.016; // ~60fps

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw twinkling stars
      starsRef.current.forEach(star => {
        // Twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity + (twinkle * 0.3);

        ctx.globalAlpha = Math.max(0, Math.min(1, currentOpacity));
        ctx.fillStyle = star.color;
        
        // Draw star with subtle glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow for larger stars
        if (star.size > 1.2) {
          ctx.globalAlpha = Math.max(0, Math.min(0.2, currentOpacity * 0.4));
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Randomly create shooting stars - increased frequency
      if (Math.random() < 0.006 && shootingStarsRef.current.length < 4) {
        shootingStarsRef.current.push(createShootingStar());
      }

      // Draw and animate shooting stars
      shootingStarsRef.current.forEach((shootingStar, index) => {
        if (!shootingStar.active) return;

        // Store current position in trail
        shootingStar.trail.push({
          x: shootingStar.x,
          y: shootingStar.y,
          opacity: shootingStar.opacity
        });

        // Limit trail length - increased for more noticeable streaks
        if (shootingStar.trail.length > 20) {
          shootingStar.trail.shift();
        }

        // Update position
        shootingStar.x += shootingStar.speed * Math.cos(shootingStar.angle);
        shootingStar.y += shootingStar.speed * Math.sin(shootingStar.angle);
        shootingStar.opacity -= 0.008; // Slower fade for longer visibility

        // Remove if off screen or faded
        if (shootingStar.x > width + 100 || shootingStar.y > height + 100 || shootingStar.opacity <= 0) {
          shootingStarsRef.current.splice(index, 1);
          return;
        }

        // Draw more noticeable streak trail
        if (shootingStar.trail.length > 1) {
          for (let i = 0; i < shootingStar.trail.length - 1; i++) {
            const current = shootingStar.trail[i];
            const next = shootingStar.trail[i + 1];
            const trailOpacity = (i / shootingStar.trail.length) * shootingStar.opacity * 0.5; // Increased opacity

            if (trailOpacity > 0.01) {
              const gradient = ctx.createLinearGradient(
                current.x, current.y, next.x, next.y
              );
              
              gradient.addColorStop(0, `rgba(221, 214, 254, ${trailOpacity * 1.0})`); // More visible
              gradient.addColorStop(0.5, `rgba(167, 139, 250, ${trailOpacity * 0.8})`);
              gradient.addColorStop(1, `rgba(139, 92, 246, ${trailOpacity * 0.6})`);

              ctx.strokeStyle = gradient;
              ctx.lineWidth = Math.max(1.5, (i / shootingStar.trail.length) * 3); // Thicker streaks
              ctx.lineCap = 'round';

              ctx.beginPath();
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(next.x, next.y);
              ctx.stroke();
            }
          }
        }

        // Draw main shooting star trail (more prominent)
        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle),
          shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle)
        );
        
        gradient.addColorStop(0, `rgba(221, 214, 254, ${shootingStar.opacity * 1.0})`); // More prominent head
        gradient.addColorStop(0.3, `rgba(167, 139, 250, ${shootingStar.opacity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(139, 92, 246, ${shootingStar.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5; // Thicker main streak
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle),
          shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle)
        );
        ctx.stroke();

        // Draw bright head with enhanced glow
        ctx.globalAlpha = shootingStar.opacity;
        ctx.fillStyle = '#DDD6FE';
        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Enhanced glow effect with multiple layers
        ctx.globalAlpha = shootingStar.opacity * 0.6;
        ctx.fillStyle = '#C4B5FD';
        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow
        ctx.globalAlpha = shootingStar.opacity * 0.3;
        ctx.fillStyle = '#A78BFA';
        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
      createStars();
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
