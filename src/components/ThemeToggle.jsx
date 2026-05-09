import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center"
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-card-border)',
        boxShadow: 'var(--c-card-shadow)',
        backdropFilter: 'blur(12px)',
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
