import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, XCircle, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react'
import { calculateStars } from '../utils/starCalc'
import { accumulatedStars } from '../utils/starCalc'
import AutocompleteSearch from './AutocompleteSearch'

export default function ProductSearch({
  productCode, setProductCode,
  quantity, setQuantity,
  foundProduct, memberName, memberType,
  diary, addEntry,
  onConfirmSuccess,
}) {
  const [showSuccess, setShowSuccess] = useState(false)

  const canConfirm = foundProduct && memberName.trim() && quantity >= 1

  function handleConfirm() {
    if (!canConfirm) return
    const starData = calculateStars(foundProduct, quantity, memberType)
    const currentBalance = accumulatedStars(diary) + starData.starsEarned

    const entry = {
      memberName: memberName.trim(),
      memberType,
      productCode,
      productName: foundProduct.name,
      qtyUnit: foundProduct.qtyUnit,
      quantity,
      pricePerPiece: foundProduct.pricePerPiece,
      ...starData,
      cumulativeBalance: currentBalance,
      promotion: foundProduct.promotion || null,
      timestamp: new Date().toISOString(),
    }

    addEntry(entry)

    // Backend simulation
    console.log('[CampaignStar] PURCHASE CONFIRMED', JSON.stringify({
      timestamp: new Date().toISOString(),
      memberName: entry.memberName,
      memberType: entry.memberType,
      productCode: entry.productCode,
      productName: entry.productName,
      qtyUnit: entry.qtyUnit,
      quantity: entry.quantity,
      pricePerPiece: entry.pricePerPiece,
      totalPrice: entry.totalPrice,
      ratePerUnit: entry.ratePerUnit,
      starsEarned: entry.starsEarned,
      currentTotalBalance: entry.cumulativeBalance,
      promotion: entry.promotion,
    }, null, 2))

    // Reset
    setProductCode('')
    setQuantity(1)
    setShowSuccess(true)
    onConfirmSuccess?.(entry)
    setTimeout(() => setShowSuccess(false), 2500)
  }

  const isCodeValid = productCode.length === 7
  const isCodeNotFound = isCodeValid && !foundProduct

  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
      className="glass-card p-4 sm:p-6 flex flex-col gap-4 sm:gap-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))', border: '1px solid rgba(255,215,0,0.3)' }}>
          <Search className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest t-label font-medium">ค้นหาสินค้า</p>
          <h2 className="text-sm font-semibold t-text">Product Search</h2>
        </div>
      </div>

      {/* Autocomplete Search */}
      <AutocompleteSearch onSelect={(code) => setProductCode(code)} />

      {/* Product Code Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest t-label font-medium">
          รหัสสินค้า (7 หลัก)
        </label>
        <div className="relative">
          <input
            type="text"
            value={productCode}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 7)
              setProductCode(v)
            }}
            placeholder="เช่น 2901255"
            maxLength={7}
            className="neu-input w-full px-4 py-3 text-sm pr-10"
            style={
              isCodeNotFound
                ? { borderColor: 'rgba(239,68,68,0.5)', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' }
                : foundProduct
                ? { borderColor: 'rgba(34,197,94,0.5)', boxShadow: '0 0 0 3px rgba(34,197,94,0.1)' }
                : {}
            }
          />
          <AnimatePresence>
            {isCodeValid && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {foundProduct
                  ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                  : <XCircle className="w-5 h-5 text-red-400" />
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {isCodeNotFound && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-red-400"
            >
              ไม่พบรหัสสินค้านี้ในระบบ
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Quantity Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest t-label font-medium">
          จำนวน (หน่วย)
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: 'var(--c-inner)',
              border: '1px solid var(--c-btn-sec-border)',
              color: 'var(--c-btn-sec-text)',
            }}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const v = Math.max(1, Math.min(999, parseInt(e.target.value) || 1))
              setQuantity(v)
            }}
            min={1}
            max={999}
            className="neu-input flex-1 px-4 py-3 text-sm text-center font-bold"
          />
          <button
            onClick={() => setQuantity((q) => Math.min(999, q + 1))}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: 'var(--c-inner)',
              border: '1px solid var(--c-btn-sec-border)',
              color: 'var(--c-btn-sec-text)',
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Validation hints */}
      <AnimatePresence>
        {!memberName.trim() && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs t-muted flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--c-label)' }} />
            กรุณากรอกชื่อสมาชิกก่อนยืนยัน
          </motion.p>
        )}
      </AnimatePresence>

      {/* Confirm Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleConfirm}
        disabled={!canConfirm}
        className="gold-btn w-full py-4 text-base relative overflow-hidden"
      >
        {/* Shimmer overlay */}
        {canConfirm && (
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              animation: 'shimmer 2s infinite',
            }}
          />
        )}
        <span className="relative flex items-center justify-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          ยืนยันการซื้อ
        </span>
      </motion.button>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">บันทึกการซื้อสำเร็จ!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
