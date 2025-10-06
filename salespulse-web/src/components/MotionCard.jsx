import { motion } from 'framer-motion'
export default function MotionCard({ children, className='' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: .98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .35, ease: 'easeOut' }}
      className={`rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur p-4 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  )
}
