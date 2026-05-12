import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Package, Tag, Hash, ShoppingCart, Zap, TrendingDown } from 'lucide-react'
import StarDisplay from './StarDisplay'
import { calculateStars } from '../utils/starCalc'

function InfoRow({ icon: Icon, label, value, highlight, accent }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--c-entry-border)' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}>
        <Icon className="w-3.5 h-3.5 text-gold-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs t-label uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 leading-snug ${highlight ? 'text-gold-400' : accent ? accent : 't-text'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

function SavingsRow({ label, priceAfter, savings, accentColor, borderColor }) {
  if (priceAfter == null) return null
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-xl"
      style={{ background: `rgba(${accentColor},0.06)`, border: `1px solid rgba(${accentColor},0.2)` }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `rgb(${accentColor})` }} />
        <span className="text-xs font-medium truncate" style={{ color: `rgb(${accentColor})` }}>{label}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="text-xs t-muted">฿{priceAfter.toLocaleString('th-TH')}</span>
        {savings != null && savings > 0 && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: `rgba(${accentColor},0.15)`, color: `rgb(${accentColor})`, border: `1px solid rgba(${accentColor},0.3)` }}
          >
            ประหยัด ฿{savings.toLocaleString('th-TH')}
          </span>
        )}
      </div>
    </div>
  )
}

export default function LivePreviewCard({ foundProduct, productCode, quantity, memberType }) {
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 30 })

  function onMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const starData = foundProduct
    ? calculateStars(foundProduct, quantity, memberType)
    : null

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="glass-card-elevated p-4 sm:p-6 flex flex-col gap-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))', border: '1px solid rgba(255,215,0,0.3)' }}>
            <ShoppingCart className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest t-label font-medium">Live Preview</p>
            <h3 className="text-sm font-semibold t-text">รายละเอียดการซื้อ</h3>
          </div>
        </div>
        {foundProduct && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            พบสินค้า
          </motion.div>
        )}
      </div>

      {/* Empty State */}
      {!foundProduct && (
        <motion.div
          className="flex-1 flex flex-col items-center justify-center gap-3 py-8"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              border: '2px dashed rgba(255,215,0,0.2)',
              background: 'rgba(255,215,0,0.03)',
            }}
          >
            <Package className="w-7 h-7 t-faint" />
          </div>
          <p className="text-sm t-muted text-center">
            ค้นหาสินค้าด้วยรหัส<br />
            <span className="text-xs t-faint">กรอกรหัสสินค้า 7 หลัก</span>
          </p>
        </motion.div>
      )}

      {/* Product Details */}
      {foundProduct && (
        <motion.div
          key={foundProduct.code}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-1"
        >
          <InfoRow icon={Hash} label="รหัสสินค้า" value={productCode} />
          <InfoRow icon={Package} label="ชื่อสินค้า" value={foundProduct.name} />
          <InfoRow icon={Tag} label="หน่วยซื้อ" value={foundProduct.qtyUnit} />
          <InfoRow
            icon={Tag}
            label="ราคาปกติ/ชิ้น"
            value={`฿${foundProduct.pricePerPiece.toLocaleString('th-TH')}`}
            highlight
          />
          <InfoRow
            icon={ShoppingCart}
            label="จำนวน × ราคารวม"
            value={`${quantity} หน่วย = ฿${starData.totalPrice.toLocaleString('th-TH')}`}
          />

          {/* Savings section */}
          {(foundProduct.priceAfterAMB != null || foundProduct.priceAfterTMW != null) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-1 flex flex-col gap-2"
            >
              <p className="text-xs t-label uppercase tracking-wide flex items-center gap-1.5 mt-1">
                <TrendingDown className="w-3.5 h-3.5 text-gold-500" />
                ผลประหยัดจากดาว
              </p>

              <SavingsRow
                label={`ผลประหยัดจากดาว AMB (${foundProduct.ambStars} ดาว)`}
                priceAfter={foundProduct.priceAfterAMB}
                savings={starData.savingsAMB}
                accentColor="255,215,0"
              />

              <SavingsRow
                label={`ผลประหยัดจากดาว TMW (${foundProduct.tmwStars} ดาว)`}
                priceAfter={foundProduct.priceAfterTMW}
                savings={starData.savingsTMW}
                accentColor="192,132,252"
              />
            </motion.div>
          )}

          {/* Promotion badge */}
          {foundProduct.promotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 mt-1 p-3 rounded-xl"
              style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.18)' }}
            >
              <Zap className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gold-400/80 leading-relaxed">{foundProduct.promotion}</p>
            </motion.div>
          )}

          {/* Star Display */}
          <div className="mt-3 py-4 rounded-2xl"
            style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)' }}>
            <p className="text-xs text-center t-label uppercase tracking-wider mb-3">
              ดาวที่ได้รับ ({memberType})
            </p>
            <StarDisplay
              stars={starData.starsEarned}
              ratePerUnit={starData.ratePerUnit}
              memberType={memberType}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
