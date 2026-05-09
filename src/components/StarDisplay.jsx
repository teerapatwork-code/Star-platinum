import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { Star } from 'lucide-react'

function AnimatedCounter({ value }) {
  const count = useMotionValue(0)
  const display = useTransform(count, (v) => Math.round(v).toLocaleString('th-TH'))

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: 'easeOut',
    })
    return controls.stop
  }, [value])

  return <motion.span>{display}</motion.span>
}

const MAX_STARS_SHOWN = 5

export default function StarDisplay({ stars, ratePerUnit, memberType }) {
  if (stars === 0) {
    return (
      <div
        className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl"
        style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.15)',
        }}
      >
        <p className="text-xs text-red-400/80 text-center">
          สินค้านี้ไม่มีดาวสำหรับ {memberType}
        </p>
      </div>
    )
  }

  const displayStars = Math.min(stars, MAX_STARS_SHOWN)
  const multiplier = stars > MAX_STARS_SHOWN ? Math.ceil(stars / MAX_STARS_SHOWN) : null

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 },
    },
  }
  const item = {
    hidden: { scale: 0, rotate: -30, opacity: 0 },
    show: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 400, damping: 20 },
    },
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Animated star icons */}
      <motion.div
        key={stars}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex items-center gap-1.5 flex-wrap justify-center"
      >
        {Array.from({ length: displayStars }).map((_, i) => (
          <motion.div key={i} variants={item}>
            <Star className="w-5 h-5 text-gold-400 fill-gold-400 star-icon" />
          </motion.div>
        ))}
        {multiplier && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-bold text-gold-400 ml-1"
          >
            ×{multiplier}
          </motion.span>
        )}
      </motion.div>

      {/* Big animated counter */}
      <motion.div
        key={`counter-${stars}`}
        className="flex items-baseline gap-1.5"
      >
        <span className="text-3xl font-extrabold text-gold-400 leading-none">
          <AnimatedCounter value={stars} />
        </span>
        <span className="text-sm font-semibold text-gold-500">ดาว</span>
      </motion.div>

      {/* Rate badge */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={{
          background: 'rgba(255,215,0,0.08)',
          border: '1px solid rgba(255,215,0,0.2)',
        }}
      >
        <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
        <span className="text-xs text-gold-400/80">
          {memberType}: {ratePerUnit} ดาว/หน่วย
        </span>
      </div>
    </div>
  )
}
