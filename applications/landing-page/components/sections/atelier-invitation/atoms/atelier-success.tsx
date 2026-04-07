'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface AtelierSuccessProps {
  title: string;
  description: string;
}

export function AtelierSuccess({ title, description }: AtelierSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.32, 0, 0.18, 1] }}
      className="flex flex-col items-center gap-6 py-12 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-aq-blue/20 bg-aq-blue/10">
        <CheckCircle2 className="h-10 w-10 text-aq-blue" />
      </div>
      <div className="max-w-sm space-y-3">
        <h2 className="font-cormorant text-3xl font-semibold text-foreground">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
