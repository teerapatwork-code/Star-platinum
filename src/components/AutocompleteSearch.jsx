import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star } from 'lucide-react'
import { productMaster } from '../data/products'

const MAX_RESULTS = 8

export default function AutocompleteSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return Object.values(productMaster)
      .filter((p) =>
        p.name.toLowerCase().includes(q) || p.code.startsWith(query.trim())
      )
      .slice(0, MAX_RESULTS)
  }, [query])

  useEffect(() => {
    setHighlighted(0)
    setIsOpen(results.length > 0 && query.trim().length >= 1)
  }, [results, query])

  // Close on outside click / touch
  useEffect(() => {
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [])

  function handleSelect(code) {
    onSelect(code)
    setQuery('')
    setIsOpen(false)
  }

  function handleKeyDown(e) {
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[highlighted]) handleSelect(results[highlighted].code)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest t-label font-medium">
        ค้นหาจากชื่อสินค้า
      </label>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--c-label)' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          placeholder="พิมพ์ชื่อสินค้าหรือรหัส..."
          className="neu-input w-full pl-9 pr-4 py-3 text-sm"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              transformOrigin: 'top',
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 100,
              marginTop: '4px',
              background: 'var(--c-drop)',
              border: '1px solid var(--c-drop-border)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              maxHeight: 'min(320px, 50vh)',
              overflowY: 'auto',
            }}
          >
            {results.map((product, idx) => (
              <button
                key={product.code}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(product.code) }}
                onMouseEnter={() => setHighlighted(idx)}
                className="w-full text-left px-4 py-3 flex items-start gap-3 transition-all"
                style={{
                  background: highlighted === idx ? 'var(--c-drop-hover)' : 'transparent',
                  borderBottom: idx < results.length - 1 ? '1px solid var(--c-entry-border)' : 'none',
                }}
              >
                {/* Code */}
                <span
                  className="text-xs font-mono font-bold flex-shrink-0 mt-0.5"
                  style={{ color: '#FFD700', minWidth: '60px' }}
                >
                  {product.code}
                </span>

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs t-text font-medium leading-snug line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs t-muted mt-0.5">
                    ฿{product.pricePerPiece.toLocaleString('th-TH')} / {product.qtyUnit}
                  </p>
                </div>

                {/* AMB stars badge */}
                {product.ambStars > 0 && (
                  <div
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{
                      background: 'rgba(255,215,0,0.15)',
                      color: '#FFD700',
                      border: '1px solid rgba(255,215,0,0.3)',
                    }}
                  >
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {product.ambStars}
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
