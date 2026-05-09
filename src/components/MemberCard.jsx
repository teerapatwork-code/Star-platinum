import { motion, AnimatePresence } from 'framer-motion'
import { User, Star } from 'lucide-react'
import MemberTypeToggle from './MemberTypeToggle'
import { accumulatedStars } from '../utils/starCalc'

export default function MemberCard({ memberName, setMemberName, memberType, setMemberType, diary }) {
  const totalStars = accumulatedStars(diary)

  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-card p-4 sm:p-6 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))',
            border: '1px solid rgba(255,215,0,0.3)',
          }}
        >
          <User className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest t-label font-medium">
            ข้อมูลสมาชิก
          </p>
          <h2 className="text-sm font-semibold t-text">Member Profile</h2>
        </div>
      </div>

      {/* Name Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest t-label font-medium">
          ชื่อสมาชิก
        </label>
        <input
          type="text"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          placeholder="กรอกชื่อสมาชิก..."
          className="neu-input w-full px-4 py-3 text-sm"
        />
      </div>

      {/* Welcome message */}
      <AnimatePresence>
        {memberName.trim() && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,215,0,0.03))',
                border: '1px solid rgba(255,215,0,0.2)',
              }}
            >
              <div>
                <p className="text-xs t-muted">ยินดีต้อนรับ</p>
                <p className="text-sm font-bold text-gold-400">{memberName.trim()}</p>
              </div>
              <motion.div
                className="flex items-center gap-1.5"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-4 h-4 text-gold-400 fill-gold-400 star-icon" />
                <span className="text-lg font-bold text-gold-400">
                  {totalStars.toLocaleString('th-TH')}
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Type Toggle */}
      <MemberTypeToggle memberType={memberType} onChange={setMemberType} />
    </motion.div>
  )
}
