import { type MotionValue, motion, useTransform } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

export function VisionPointAtom({
  point,
  index,
  scrollYProgress,
  animated,
}: {
  point: { text: string; icon: LucideIcon };
  index: number;
  scrollYProgress: MotionValue<number>;
  animated: boolean;
}) {
  const pointY = useTransform(
    scrollYProgress,
    [0.1 + index * 0.08, 0.45 + index * 0.08],
    ['30px', '0px']
  );
  const pointOp = useTransform(
    scrollYProgress,
    [0.1 + index * 0.08, 0.4 + index * 0.08],
    [0, 1]
  );
  const Icon = point.icon;

  return (
    <motion.div
      data-atom
      style={animated ? { y: pointY, opacity: pointOp } : {}}
      className="flex items-center gap-5 rounded-2xl border border-border/10 bg-card/5 p-5 backdrop-blur-sm"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-aq-blue/5 text-aq-blue">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-display text-xl font-light tracking-wide text-foreground/90">
        {point.text}
      </p>
    </motion.div>
  );
}
