'use client';

import { cubicBezier, motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { useAnimationReady } from '@/hooks/use-animation-ready';

const LAYER_1 = [
  { src: '/media/images/grid/lookbook-31.png', alt: 'Fashion lookbook 31' },
  { src: '/media/images/grid/lookbook-30.png', alt: 'Fashion lookbook 30' },
  { src: '/media/images/grid/lookbook-12.png', alt: 'Fashion lookbook 12' },
  { src: '/media/images/grid/lookbook-10.png', alt: 'Fashion lookbook 5' },
];

const LAYER_2 = [
  { src: '/media/images/grid/lookbook-9.png', alt: 'Fashion lookbook 9' },
  { src: '/media/images/grid/lookbook-7.png', alt: 'Fashion lookbook 7' },
  { src: '/media/images/grid/lookbook-4.png', alt: 'Fashion lookbook 4' },
  { src: '/media/images/grid/lookbook-2.png', alt: 'Fashion lookbook 2' },
  { src: '/media/images/grid/lookbook-1.png', alt: 'Fashion lookbook 1' },
  { src: '/media/images/grid/lookbook-01.png', alt: 'Fashion lookbook 01' },
];

const LAYER_3 = [
  { src: '/media/images/grid/lookbook-0.png', alt: 'Fashion lookbook 0' },
  { src: '/media/images/grid/lookbook-5.png', alt: 'Fashion lookbook 5' },
];

const CENTER_IMAGE = '/media/images/grid/lookbook-5.png';

const LAYER_CONFIGS = [
  { holdEnd: 0.3, layerEnd: 0.65, ease: cubicBezier(0.42, 0, 0.58, 1) },
  { holdEnd: 0.4, layerEnd: 0.75, ease: cubicBezier(0.76, 0, 0.24, 1) },
  { holdEnd: 0.5, layerEnd: 0.85, ease: cubicBezier(0.87, 0, 0.13, 1) },
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
  const { animated, reduced, mounted } = useAnimationReady();

  const [vw, setVw] = useState(1440);
  const [vh, setVh] = useState(900);

  useEffect(() => {
    if (!mounted) return;
    setVw(window.innerWidth);
    setVh(window.innerHeight);

    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [mounted]);

  const gap = Math.min(40, Math.max(10, 0.04 * vw));
  const gridW = Math.min(1200, vw - 64);
  const naturalW = Math.max(1, (gridW - 4 * gap) / 5);
  const naturalH = naturalW * 1.25;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

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

  if (!animated) {
    return (
      <section
        ref={sectionRef}
        className="relative bg-purple-400 px-6 py-24"
        style={{ minHeight: mounted ? 'auto' : '280vh' }}
      >
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
              className="h-full w-full rounded-lg object-contain"
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
    <section ref={sectionRef} className="relative h-[280vh]" aria-hidden="true">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#2b3ae6]/40">
        <div className="scroll-grid">
          <GridLayer
            items={LAYER_1}
            layerIndex={0}
            progress={scrollYProgress}
          />

          <GridLayer
            items={LAYER_2}
            layerIndex={1}
            progress={scrollYProgress}
          />

          <GridLayer
            items={LAYER_3}
            layerIndex={2}
            progress={scrollYProgress}
          />

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
              className="object-cover"
              width={1900}
              height={1900}
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
