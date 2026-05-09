import { motion } from 'framer-motion'
import { Star, Clock, Hash, Package } from 'lucide-react'

export default function DiaryEntry({ entry }) {
  const date = new Date(entry.timestamp)
  const timeStr = date.toLocaleString('th-TH', {
    day: '2-digit', month: 'short', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div
        className="p-4 rounded-2xl mb-2"
        style={{
          background: 'var(--c-entry)',
          border: '1px solid var(--c-entry-border)',
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs t-muted">
            <Clock className="w-3 h-3" />
            <span>{timeStr}</span>
          </div>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={
              entry.memberType === 'AMB'
                ? { background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }
                : { background: 'rgba(139,92,246,0.15)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)' }
            }
          >
            {entry.memberType}
          </span>
        </div>

        {/* Product name */}
        <p className="text-sm font-semibold t-text leading-snug mb-2 line-clamp-2">
          {entry.productName}
        </p>

        {/* Details row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs t-muted">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {entry.productCode}
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {entry.quantity} หน่วย
          </span>
          <span>฿{entry.totalPrice?.toLocaleString('th-TH')}</span>
        </div>

        {/* Stars earned */}
        <div className="flex items-center justify-end gap-1.5 mt-2">
          <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
          <span className="text-sm font-bold text-gold-400">
            +{entry.starsEarned.toLocaleString('th-TH')} ดาว
          </span>
          <span className="text-xs t-faint">
            (รวม {entry.cumulativeBalance?.toLocaleString('th-TH')})
          </span>
        </div>
      </div>
    </motion.div>
  )
}
