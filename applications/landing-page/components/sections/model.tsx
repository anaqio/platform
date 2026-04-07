'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import heroModelImage from '@/public/images/model-t.png';

export default function ModelSection() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 bottom-0 right-0 z-0 w-[57%] select-none"
      aria-hidden
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={heroModelImage}
          alt=""
          fill
          className="object-contain"
          draggable={false}
          sizes="57vw"
        />
      </motion.div>
    </motion.div>
  );
}
