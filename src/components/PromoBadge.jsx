import { motion } from 'framer-motion'
import { Calendar, Star } from 'lucide-react'

export default function PromoBadge() {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex justify-center mb-2 sm:mb-6"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full max-w-xs sm:max-w-none"
        style={{
          background: 'var(--c-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,215,0,0.35)',
          boxShadow: '0 0 24px rgba(255,215,0,0.15), 0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 fill-gold-400" />
        </motion.div>
        <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
          Campaign Star
        </span>
        <span className="text-xs t-muted hidden sm:inline">·</span>
        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 t-muted hidden sm:inline" />
        <span className="text-xs t-muted font-medium">
          24 เม.ย. – 23 พ.ค. 2569
        </span>
      </motion.div>
    </motion.div>
  )
}
