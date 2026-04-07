import { type MotionValue, motion, useTransform } from 'framer-motion';

export function ScrollWord({
  word,
  start,
  end,
  scrollYProgress,
  animated,
}: {
  word: string;
  start: number;
  end: number;
  scrollYProgress: MotionValue<number>;
  animated: boolean;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.18, 1]);
  return (
    <motion.span
      data-atom
      style={animated ? { opacity } : {}}
      className="me-[0.28em] inline-block font-display text-[clamp(1.6rem,3.2vw,3.5rem)] font-light leading-tight text-foreground"
    >
      {word}
    </motion.span>
  );
}
