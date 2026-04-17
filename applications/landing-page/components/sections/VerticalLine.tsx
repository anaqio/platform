import { motion } from 'framer-motion'

export function VerticalLine() {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ originY: 0 }}
      className="absolute left-6 top-[18%] z-10 h-[40%] w-10 bg-emerald-700 bg-gradient-to-b from-transparent via-border to-transparent fill-emerald-700 sm:left-12 lg:block"
    />
  )
}
