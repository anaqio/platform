'use client';

import { cubicBezier, motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { useAnimationReady } from '@/hooks/use-animation-ready';

// Layer 1: outer edges (col 1 + col 5)
const LAYER_1 = [
  { src: '/images/lookbook-1.png', alt: 'Fashion lookbook 1' },
  { src: '/images/lookbook-2.png', alt: 'Fashion lookbook 2' },
  { src: '/images/lookbook-3.png', alt: 'Fashion lookbook 3' },
  {
    src: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&auto=format&fit=crop&q=60',
    alt: 'Fashion street style',
  },
  {
    src: 'https://images.unsplash.com/photo-1565321590372-09331b9dd1eb?w=600&auto=format&fit=crop&q=60',
    alt: 'Air jordan sneakers',
  },
  { src: '/images/model-t.png', alt: 'Fashion model' },
];

// Layer 2: inner columns (col 2 + col 4)
const LAYER_2 = [
  {
    src: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600&auto=format&fit=crop&q=60',
    alt: 'Product photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1637414165749-9b3cd88b8271?w=600&auto=format&fit=crop&q=60',
    alt: 'Tech product',
  },
  {
    src: 'https://images.unsplash.com/photo-1699911251220-8e0de3b5ce88?w=600&auto=format&fit=crop&q=60',
    alt: 'One wheel',
  },
  {
    src: 'https://images.unsplash.com/photo-1667483629944-6414ad0648c5?w=600&auto=format&fit=crop&q=60',
    alt: 'Luxury watch',
  },
  {
    src: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&auto=format&fit=crop&q=60',
    alt: 'Fashion photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1525385444278-b7968e7e28dc?w=600&auto=format&fit=crop&q=60',
    alt: 'Accessories',
  },
];

// Layer 3: center column top + bottom
const LAYER_3 = [
  {
    src: 'https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=600&auto=format&fit=crop&q=60',
    alt: 'Fashion editorial',
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60',
    alt: 'Fashion model yellow',
  },
];

const CENTER_IMAGE = '/images/hero-model.png';

// Per-layer reveal timing and easing — matching CodePen GSAP power curves
// holdEnd: scroll progress where animation begins; layerEnd: where it finishes
const LAYER_CONFIGS = [
  { holdEnd: 0.3, layerEnd: 0.65, ease: cubicBezier(0.42, 0, 0.58, 1) }, // power1.inOut — outer
  { holdEnd: 0.4, layerEnd: 0.75, ease: cubicBezier(0.76, 0, 0.24, 1) }, // power3.inOut — inner
  { holdEnd: 0.5, layerEnd: 0.85, ease: cubicBezier(0.87, 0, 0.13, 1) }, // power4.inOut — center top/bottom
] as const;

function GridLayer({
  items,
  layerIndex,
  progress,
}: {
  items: { src: string; alt: string }[];
  layerIndex: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const { holdEnd, layerEnd, ease } = LAYER_CONFIGS[layerIndex];

  // Function-transformer overload: apply custom GSAP-style easing over scroll range
  const opacity = useTransform(progress, (p) => {
    if (p <= holdEnd) return 0;
    if (p >= layerEnd) return 1;
    return ease((p - holdEnd) / (layerEnd - holdEnd));
  });

  const scale = useTransform(progress, (p) => {
    if (p <= holdEnd) return 0;
    if (p >= layerEnd) return 1;
    return ease((p - holdEnd) / (layerEnd - holdEnd));
  });

  return (
    <motion.div
      style={{ opacity, scale }}
      className="scroll-grid-layer"
      data-layer={layerIndex + 1}
    >
      {items.map((item, i) => (
        <div key={i}>
          <Image
            src={item.src}
            alt={item.alt}
            width={400}
            height={500}
            className="h-full w-full rounded-lg object-cover"
            style={{ aspectRatio: '4/5' }}
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
  );
}

export function ScrollGridSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { animated, reduced } = useAnimationReady();

  // SSR-safe viewport dimensions — updated on resize
  const [vw, setVw] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [vh, setVh] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 900
  );

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Natural cell size from CSS grid math:
  //   width: min(1200px, calc(100% - 4rem))  →  gridW = min(1200, vw - 64)
  //   --sg-gap: clamp(10px, 4vw, 40px)       →  gap = clamp(10, 0.04*vw, 40)
  //   5 columns, 4 gaps                       →  cellW = (gridW - 4*gap) / 5
  //   aspect-ratio: 4/5                       →  cellH = cellW * 1.25
  const gap = Math.min(40, Math.max(10, 0.04 * vw));
  const gridW = Math.min(1200, vw - 64);
  const naturalW = (gridW - 4 * gap) / 5;
  const naturalH = naturalW * 1.25;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Scale the center scaler from viewport-fill → natural cell size.
  // Uses transform scale (not width/height) so the element stays in grid flow —
  // the scaler sits at grid-area 2/3 (center column), which is the viewport center
  // for a centered 5-col grid, so scaleX/scaleY expands symmetrically outward.
  const scalerScaleX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [vw / naturalW, 1]
  );
  const scalerScaleY = useTransform(
    scrollYProgress,
    [0, 0.5],
    [vh / naturalH, 1]
  );
  const scalerRadius = useTransform(
    scrollYProgress,
    [0.35, 0.5],
    ['0px', '8px']
  );
  const scalerOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [1, 1, 0.85, 0.85]
  );

  if (reduced || !animated) {
    return (
      <section className="relative bg-[#0d0d0d] px-6 py-24">
        <div className="mx-auto grid max-w-[1600px] grid-cols-5 gap-6">
          {LAYER_1.slice(0, 3).map((item, i) => (
            <div key={i}>
              <Image
                src={item.src}
                alt={item.alt}
                width={400}
                height={500}
                className="h-full w-full rounded-lg object-cover"
                style={{ aspectRatio: '4/5' }}
                loading="lazy"
              />
            </div>
          ))}
          <div className="col-span-2 row-span-3">
            <Image
              src={CENTER_IMAGE}
              alt="Anaqio hero model"
              width={600}
              height={750}
              className="h-full w-full rounded-lg object-cover"
              style={{ aspectRatio: '4/5' }}
              priority
            />
          </div>
          {LAYER_1.slice(3).map((item, i) => (
            <div key={i}>
              <Image
                src={item.src}
                alt={item.alt}
                width={400}
                height={500}
                className="h-full w-full rounded-lg object-cover"
                style={{ aspectRatio: '4/5' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[280vh] bg-[#0d0d0d]"
      aria-hidden="true"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="scroll-grid">
          {/* Layer 1: outer edges */}
          <GridLayer
            items={LAYER_1}
            layerIndex={0}
            progress={scrollYProgress}
          />

          {/* Layer 2: inner columns */}
          <GridLayer
            items={LAYER_2}
            layerIndex={1}
            progress={scrollYProgress}
          />

          {/* Layer 3: center top + bottom */}
          <GridLayer
            items={LAYER_3}
            layerIndex={2}
            progress={scrollYProgress}
          />

          {/* Center scaler: fills viewport at rest, shrinks to grid cell on scroll */}
          <motion.div
            className="scroll-grid-scaler"
            style={{
              scaleX: scalerScaleX,
              scaleY: scalerScaleY,
              borderRadius: scalerRadius,
              opacity: scalerOpacity,
            }}
          >
            <Image
              src={CENTER_IMAGE}
              alt="Anaqio hero model"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
