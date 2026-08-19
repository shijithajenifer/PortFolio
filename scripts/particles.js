/**
 * particles.js - Atmospheric Sparkling & Glowing Particle Engine
 * Shijitha Jenifer J - Personal Portfolio
 * 
 * Strict Palette:
 * #462435 - Deep Plum
 * #743749 - Muted Burgundy
 * #B22C45 - Rich Crimson
 * #CB3A35 - Warm Red
 * #E8592A - Vibrant Orange
 */

(function () {
  'use strict';

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Palette color definitions
  const PALETTE = {
    plum: 'rgba(70, 36, 53,',
    burgundy: 'rgba(116, 55, 73,',
    crimson: 'rgba(178, 44, 69,',
    warmRed: 'rgba(203, 58, 53,',
    orange: 'rgba(232, 89, 42,'
  };

  /**
   * Helper to draw a delicate 4-pointed twinkling star
   */
  function drawTwinkleStar(ctx, cx, cy, spikes, outerRadius, innerRadius, colorPrefix, alpha, rotation = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    // 1. Soft outer glow halo
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius * 1.6);
    glowGrad.addColorStop(0, `${colorPrefix}${alpha * 0.7})`);
    glowGrad.addColorStop(0.5, `${colorPrefix}${alpha * 0.2})`);
    glowGrad.addColorStop(1, `${colorPrefix}0)`);
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // 2. 4-pointed star rays (horizontal & vertical light beams)
    ctx.beginPath();
    const step = Math.PI / spikes;
    let rot = (Math.PI / 2) * 3;
    let x = 0;
    let y = 0;

    for (let i = 0; i < spikes; i++) {
      x = Math.cos(rot) * outerRadius;
      y = Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.closePath();
    ctx.fillStyle = `${colorPrefix}${alpha})`;
    ctx.fill();

    // 3. Bright central sparkle point
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(253, 249, 250, ${alpha * 0.95})`;
    ctx.fill();

    ctx.restore();
  }

  // =========================================================================
  // 1. HERO CANVAS PARTICLE & SPARKLE NETWORK
  // =========================================================================
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width = (heroCanvas.width = heroCanvas.parentElement.offsetWidth);
    let height = (heroCanvas.height = heroCanvas.parentElement.offsetHeight);
    let mouse = { x: null, y: null, radius: 120 };
    let particles = [];
    let interactiveSparkles = [];

    const calculateCounts = () => {
      return {
        dots: Math.min(Math.floor((width * height) / 22000), 40),
        stars: Math.min(Math.floor((width * height) / 38000), 18),
        bokeh: Math.min(Math.floor((width * height) / 60000), 8)
      };
    };

    let counts = calculateCounts();

    const handleResize = () => {
      if (!heroCanvas.parentElement) return;
      width = heroCanvas.width = heroCanvas.parentElement.offsetWidth;
      height = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
      counts = calculateCounts();
      initParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    heroCanvas.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      // Spawn rare subtle micro-sparkle near cursor (max 8)
      if (interactiveSparkles.length < 8 && Math.random() < 0.15) {
        interactiveSparkles.push({
          x: mouse.x + (Math.random() - 0.5) * 30,
          y: mouse.y + (Math.random() - 0.5) * 30,
          size: Math.random() * 3 + 2,
          color: Math.random() > 0.4 ? PALETTE.orange : PALETTE.warmRed,
          alpha: 0.8,
          decay: Math.random() * 0.02 + 0.015,
          rot: Math.random() * Math.PI
        });
      }
    }, { passive: true });

    heroCanvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle Dot Class
    class HeroDot {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : (Math.random() > 0.5 ? 0 : height);
        this.vx = (Math.random() - 0.5) * 0.28;
        this.vy = (Math.random() - 0.5) * 0.28;
        this.radius = Math.random() * 1.4 + 0.9;
        
        const rand = Math.random();
        if (rand < 0.4) {
          this.color = PALETTE.crimson;
        } else if (rand < 0.75) {
          this.color = PALETTE.warmRed;
        } else if (rand < 0.92) {
          this.color = PALETTE.burgundy;
        } else {
          this.color = PALETTE.orange;
        }

        this.baseAlpha = Math.random() * 0.35 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += this.pulseSpeed;

        if (this.x < -10 || this.x > width + 10) this.vx *= -1;
        if (this.y < -10 || this.y > height + 10) this.vy *= -1;

        // Subtle gentle mouse avoidance
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 0.8;
            this.y -= (dy / dist) * force * 0.8;
          }
        }
      }

      draw() {
        const currentAlpha = Math.max(0.08, this.baseAlpha + Math.sin(this.phase) * 0.15);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${currentAlpha})`;
        ctx.shadowColor = `${this.color}0.4)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Twinkling Star Class
    class HeroStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.14;
        this.vy = (Math.random() - 0.5) * 0.14;
        this.outerRadius = Math.random() * 4 + 3.5;
        this.innerRadius = this.outerRadius * 0.28;
        
        const rand = Math.random();
        if (rand < 0.5) {
          this.color = PALETTE.orange;
        } else if (rand < 0.85) {
          this.color = PALETTE.warmRed;
        } else {
          this.color = PALETTE.crimson;
        }

        this.baseAlpha = Math.random() * 0.4 + 0.35;
        this.phase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.018 + 0.008; // very slow twinkle
        this.rotation = Math.random() * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 0.003;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += this.twinkleSpeed;
        this.rotation += this.rotSpeed;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        // Smooth sine wave twinkle from 0.15 to 0.85
        const currentAlpha = Math.max(0.12, this.baseAlpha * (0.35 + 0.65 * Math.sin(this.phase)));
        drawTwinkleStar(ctx, this.x, this.y, 4, this.outerRadius, this.innerRadius, this.color, currentAlpha, this.rotation);
      }
    }

    // Soft Bokeh Orb Class
    class HeroBokeh {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.1;
        this.vy = (Math.random() - 0.5) * 0.1;
        this.radius = Math.random() * 26 + 18;
        this.color = Math.random() > 0.5 ? PALETTE.burgundy : PALETTE.crimson;
        this.alpha = Math.random() * 0.07 + 0.03;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
      }

      draw() {
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, `${this.color}${this.alpha})`);
        grad.addColorStop(0.6, `${this.color}${this.alpha * 0.4})`);
        grad.addColorStop(1, `${this.color}0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < counts.bokeh; i++) particles.push(new HeroBokeh());
      for (let i = 0; i < counts.dots; i++) particles.push(new HeroDot());
      for (let i = 0; i < counts.stars; i++) particles.push(new HeroStar());
    }

    initParticles();

    // Reduced motion: static draw once and exit
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => p.draw());
      return;
    }

    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroCanvas);

    function animateHero() {
      if (isHeroVisible) {
        ctx.clearRect(0, 0, width, height);

        // 1. Draw connecting lines between closest dots (delicate network)
        const dots = particles.filter(p => p instanceof HeroDot);
        const maxDist = 95;
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const opacity = (1 - dist / maxDist) * 0.12;
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y);
              ctx.lineTo(dots[j].x, dots[j].y);
              ctx.strokeStyle = `${PALETTE.crimson}${opacity})`;
              ctx.lineWidth = 0.65;
              ctx.stroke();
            }
          }
        }

        // 2. Update and draw all particles
        particles.forEach((p) => {
          p.update();
          p.draw();
        });

        // 3. Render interactive micro-sparkles
        for (let i = interactiveSparkles.length - 1; i >= 0; i--) {
          const sp = interactiveSparkles[i];
          drawTwinkleStar(ctx, sp.x, sp.y, 4, sp.size, sp.size * 0.25, sp.color, sp.alpha, sp.rot);
          sp.alpha -= sp.decay;
          sp.size += 0.04;
          sp.rot += 0.01;
          if (sp.alpha <= 0) {
            interactiveSparkles.splice(i, 1);
          }
        }
      }

      requestAnimationFrame(animateHero);
    }

    requestAnimationFrame(animateHero);
  }

  // =========================================================================
  // 2. GLOBAL AMBIENT BACKGROUND CANVAS (Pervasive Subtle Floating Sparkles)
  // =========================================================================
  const bgCanvas = document.getElementById('bgAmbientCanvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width = (bgCanvas.width = window.innerWidth);
    let height = (bgCanvas.height = window.innerHeight);
    let ambientParticles = [];

    const count = Math.min(Math.floor((width * height) / 32000), 36);

    const resizeAmbient = () => {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
      initAmbient();
    };

    window.addEventListener('resize', resizeAmbient, { passive: true });

    class AmbientParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : (Math.random() > 0.5 ? 0 : height);
        this.vx = (Math.random() - 0.5) * 0.16;
        this.vy = (Math.random() - 0.5) * 0.16;
        this.isStar = Math.random() < 0.28;
        this.radius = this.isStar ? (Math.random() * 3.5 + 2.5) : (Math.random() * 1.2 + 0.7);

        const rand = Math.random();
        if (rand < 0.45) {
          this.color = PALETTE.crimson;
        } else if (rand < 0.75) {
          this.color = PALETTE.warmRed;
        } else if (rand < 0.9) {
          this.color = PALETTE.orange;
        } else {
          this.color = PALETTE.burgundy;
        }

        this.baseAlpha = Math.random() * 0.28 + 0.15;
        this.phase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.012 + 0.006;
        this.rot = Math.random() * Math.PI;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += this.twinkleSpeed;

        if (this.x < -15) this.x = width + 15;
        if (this.x > width + 15) this.x = -15;
        if (this.y < -15) this.y = height + 15;
        if (this.y > height + 15) this.y = -15;
      }

      draw() {
        const currentAlpha = Math.max(0.06, this.baseAlpha * (0.4 + 0.6 * Math.sin(this.phase)));
        if (this.isStar) {
          drawTwinkleStar(ctx, this.x, this.y, 4, this.radius, this.radius * 0.25, this.color, currentAlpha, this.rot);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${this.color}${currentAlpha})`;
          ctx.fill();
        }
      }
    }

    function initAmbient() {
      ambientParticles = [];
      for (let i = 0; i < count; i++) {
        ambientParticles.push(new AmbientParticle());
      }
    }

    initAmbient();

    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      ambientParticles.forEach(p => p.draw());
      return;
    }

    function animateAmbient() {
      ctx.clearRect(0, 0, width, height);
      ambientParticles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateAmbient);
    }

    requestAnimationFrame(animateAmbient);
  }
})();
