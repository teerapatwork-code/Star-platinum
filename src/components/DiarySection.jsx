import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Star, Trash2, AlertTriangle } from 'lucide-react'
import DiaryEntry from './DiaryEntry'
import { accumulatedStars } from '../utils/starCalc'

export default function DiarySection({ memberName, diary, clearDiary }) {
  const [confirmClear, setConfirmClear] = useState(false)
  const total = accumulatedStars(diary)

  if (!memberName.trim()) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      className="glass-card p-4 sm:p-6 flex flex-col gap-4 sm:gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))', border: '1px solid rgba(255,215,0,0.3)' }}>
            <BookOpen className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest t-label font-medium">
              Member Diary
            </p>
            <h2 className="text-sm font-semibold t-text">
              บันทึกของ {memberName.trim()}
            </h2>
          </div>
        </div>

        {diary.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
            style={{ border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.6)' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Confirm clear dialog */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-xl flex flex-col gap-3"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-sm font-semibold text-red-400">ล้างประวัติทั้งหมด?</p>
            </div>
            <p className="text-xs t-muted">ข้อมูลจะถูกลบออกจาก localStorage และไม่สามารถกู้คืนได้</p>
            <div className="flex gap-2">
              <button
                onClick={() => { clearDiary(); setConfirmClear(false) }}
                className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                ยืนยันลบ
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background: 'var(--c-btn-sec)', color: 'var(--c-btn-sec-text)', border: '1px solid var(--c-btn-sec-border)' }}
              >
                ยกเลิก
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accumulated Stars Banner */}
      <motion.div
        key={total}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-5 py-4 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,194,0,0.06) 100%)',
          border: '1px solid rgba(255,215,0,0.25)',
        }}
      >
        <div>
          <p className="text-xs t-muted uppercase tracking-wider">ดาวสะสมทั้งหมด</p>
          <p className="text-3xl font-extrabold text-gold-400 leading-none mt-1">
            {total.toLocaleString('th-TH')}
          </p>
          <p className="text-xs text-gold-500/60 mt-0.5">ดาว</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Star className="w-10 h-10 text-gold-400 fill-gold-400 star-icon" />
          </motion.div>
          <span className="text-xs t-muted">{diary.length} รายการ</span>
        </div>
      </motion.div>

      {/* Diary Entries */}
      {diary.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <BookOpen className="w-10 h-10 t-faint" />
          <p className="text-sm t-muted">ยังไม่มีประวัติการซื้อ</p>
          <p className="text-xs t-faint">ค้นหาสินค้าและยืนยันการซื้อเพื่อเริ่มสะสมดาว</p>
        </div>
      ) : (
        <div
          className="overflow-y-auto pr-1"
          style={{ maxHeight: '480px' }}
        >
          <AnimatePresence initial={false}>
            {diary.map((entry) => (
              <DiaryEntry key={entry.id} entry={entry} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
