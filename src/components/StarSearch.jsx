import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Telescope, Star, ChevronDown, ChevronUp, X, Search } from 'lucide-react'
import { productMaster } from '../data/products'

const PAGE_SIZE = 12

function ResultCard({ product, memberType, starsFilter }) {
  const ambStars = product.ambStars
  const tmwStars = product.tmwStars
  const highlight = memberType === 'AMB' ? ambStars : tmwStars

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="p-3 rounded-xl flex flex-col gap-2"
      style={{
        background: 'var(--c-entry)',
        border: highlight >= starsFilter
          ? '1px solid rgba(255,215,0,0.3)'
          : '1px solid var(--c-entry-border)',
      }}
    >
      {/* Product code + name */}
      <div>
        <span className="text-xs t-faint font-mono">{product.code}</span>
        <p className="text-xs font-semibold t-text leading-snug mt-0.5 line-clamp-2">
          {product.name}
        </p>
      </div>

      {/* Price */}
      <p className="text-xs t-muted">
        ฿{product.pricePerPiece.toLocaleString('th-TH')} / {product.qtyUnit}
      </p>

      {/* Star badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
          style={
            memberType === 'AMB'
              ? { background: 'rgba(255,215,0,0.2)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.35)' }
              : { background: 'rgba(255,215,0,0.06)', color: 'rgba(255,215,0,0.5)', border: '1px solid rgba(255,215,0,0.12)' }
          }
        >
          <Star className="w-2.5 h-2.5 fill-current" />
          AMB {ambStars}
        </div>
        {tmwStars > 0 && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
            style={
              memberType === 'TMW'
                ? { background: 'rgba(192,132,252,0.2)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.35)' }
                : { background: 'rgba(192,132,252,0.05)', color: 'rgba(192,132,252,0.4)', border: '1px solid rgba(192,132,252,0.12)' }
            }
          >
            <Star className="w-2.5 h-2.5 fill-current" />
            TMW {tmwStars}
          </div>
        )}
      </div>

      {/* Promotion tag */}
      {product.promotion && (
        <p className="text-xs text-gold-500/60 leading-snug line-clamp-1">
          {product.promotion}
        </p>
      )}
    </motion.div>
  )
}

export default function StarSearch({ memberType }) {
  const [minStars, setMinStars] = useState('')
  const [maxStars, setMaxStars] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(true)

  const min = parseInt(minStars) || 0
  const max = parseInt(maxStars) || Infinity

  const results = useMemo(() => {
    if (!minStars && !maxStars && !nameFilter.trim()) return []

    return Object.values(productMaster).filter((p) => {
      const stars = memberType === 'AMB' ? p.ambStars : p.tmwStars
      const starMatch = stars >= min && stars <= max && stars > 0
      const nameMatch = !nameFilter.trim() ||
        p.name.toLowerCase().includes(nameFilter.trim().toLowerCase()) ||
        p.code.includes(nameFilter.trim())
      return starMatch && nameMatch
    }).sort((a, b) => {
      const aS = memberType === 'AMB' ? a.ambStars : a.tmwStars
      const bS = memberType === 'AMB' ? b.ambStars : b.tmwStars
      return bS - aS
    })
  }, [minStars, maxStars, nameFilter, memberType])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const paged = results.slice(0, page * PAGE_SIZE)
  const hasMore = paged.length < results.length

  function reset() {
    setMinStars('')
    setMaxStars('')
    setNameFilter('')
    setPage(1)
  }

  const hasFilter = minStars || maxStars || nameFilter.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-4 sm:p-6 flex flex-col gap-4"
    >
      {/* Header toggle */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))',
              border: '1px solid rgba(255,215,0,0.3)',
            }}
          >
            <Telescope className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-left">
            <p className="text-xs uppercase tracking-widest t-label font-medium">
              ค้นหาสินค้า
            </p>
            <h2 className="text-sm font-semibold t-text">Star Product Finder</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {results.length > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
            >
              {results.length} รายการ
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 t-label" />
          ) : (
            <ChevronDown className="w-4 h-4 t-label" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-1">
              {/* Filter row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Min stars */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-widest t-label font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold-500" />
                    ดาวขั้นต่ำ
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minStars}
                    onChange={(e) => { setMinStars(e.target.value); setPage(1) }}
                    placeholder="เช่น 10"
                    className="neu-input px-3 py-2.5 text-sm"
                  />
                </div>

                {/* Max stars */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-widest t-label font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold-500" />
                    ดาวสูงสุด
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={maxStars}
                    onChange={(e) => { setMaxStars(e.target.value); setPage(1) }}
                    placeholder="เช่น 50"
                    className="neu-input px-3 py-2.5 text-sm"
                  />
                </div>

                {/* Name / code search */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-widest t-label font-medium flex items-center gap-1">
                    <Search className="w-3 h-3 text-gold-500" />
                    ชื่อ / รหัสสินค้า
                  </label>
                  <input
                    type="text"
                    value={nameFilter}
                    onChange={(e) => { setNameFilter(e.target.value); setPage(1) }}
                    placeholder="เช่น นม, โค้ก..."
                    className="neu-input px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Quick filter chips */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs t-faint self-center">ค้นเร็ว:</span>
                {[
                  { label: '10 ดาว', min: '10', max: '10' },
                  { label: '≥ 15 ดาว', min: '15', max: '' },
                  { label: '≥ 30 ดาว', min: '30', max: '' },
                  { label: '≥ 100 ดาว', min: '100', max: '' },
                  { label: '1–5 ดาว', min: '1', max: '5' },
                  { label: 'ทั้งหมด', min: '1', max: '' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => {
                      setMinStars(chip.min)
                      setMaxStars(chip.max)
                      setNameFilter('')
                      setPage(1)
                    }}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                    style={{
                      background:
                        minStars === chip.min && maxStars === chip.max && !nameFilter
                          ? 'rgba(255,215,0,0.2)'
                          : 'var(--c-chip)',
                      border:
                        minStars === chip.min && maxStars === chip.max && !nameFilter
                          ? '1px solid rgba(255,215,0,0.4)'
                          : '1px solid var(--c-chip-border)',
                      color:
                        minStars === chip.min && maxStars === chip.max && !nameFilter
                          ? '#FFD700'
                          : 'var(--c-btn-sec-text)',
                    }}
                  >
                    {chip.label}
                  </button>
                ))}

                {hasFilter && (
                  <button
                    onClick={reset}
                    className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: 'rgba(248,113,113,0.8)',
                    }}
                  >
                    <X className="w-3 h-3" />
                    ล้าง
                  </button>
                )}
              </div>

              {/* Member type note */}
              <p className="text-xs t-faint">
                แสดงดาวสำหรับ{' '}
                <span className="text-gold-400 font-semibold">{memberType}</span>
                {' '}— สลับประเภทสมาชิกในส่วน Member Profile เพื่อกรองอีกประเภท
              </p>

              {/* Results grid */}
              <AnimatePresence>
                {hasFilter && results.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center"
                  >
                    <p className="text-sm t-muted">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                  </motion.div>
                )}

                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
                  >
                    <AnimatePresence>
                      {paged.map((product) => (
                        <ResultCard
                          key={product.code}
                          product={product}
                          memberType={memberType}
                          starsFilter={min}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: 'rgba(255,215,0,0.08)',
                      border: '1px solid rgba(255,215,0,0.25)',
                      color: '#FFD700',
                    }}
                  >
                    โหลดเพิ่ม ({results.length - paged.length} รายการ)
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
