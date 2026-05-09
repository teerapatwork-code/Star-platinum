import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function roundRect(ctx, x, y, w, h, r, fill) {
  const radius = typeof r === 'number' ? { tl: r, tr: r, bl: r, br: r } : r
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + w - radius.tr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius.tr)
  ctx.lineTo(x + w, y + h - radius.br)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h)
  ctx.lineTo(x + radius.bl, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
}

async function drawReceipt(canvas, entry, isDark) {
  const W = 420, H = 640
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Load Sarabun font
  await document.fonts.ready

  const bg = isDark ? '#0A1628' : '#FFFFFF'
  const cardBg = isDark ? '#0F2040' : '#F8FAFC'
  const textPrimary = isDark ? '#E2E8F0' : '#1E293B'
  const textMuted = isDark ? 'rgba(147,197,253,0.6)' : 'rgba(71,85,105,0.7)'
  const gold = '#FFD700'
  const divider = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  // Background
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Card with rounded corners
  roundRect(ctx, 16, 16, W - 32, H - 32, 20, cardBg)

  // Gold header gradient
  const grad = ctx.createLinearGradient(0, 16, 0, 100)
  grad.addColorStop(0, '#FFD700')
  grad.addColorStop(1, '#FFC200')
  roundRect(ctx, 16, 16, W - 32, 84, { tl: 20, tr: 20, bl: 0, br: 0 }, grad)

  // Star emoji in header
  ctx.font = '32px Sarabun, sans-serif'
  ctx.fillText('⭐', 32, 72)

  // Title
  ctx.fillStyle = '#050A1A'
  ctx.font = 'bold 22px Sarabun, sans-serif'
  ctx.fillText('Campaign Star', 76, 52)
  ctx.font = '13px Sarabun, sans-serif'
  ctx.fillStyle = 'rgba(5,10,26,0.6)'
  ctx.fillText('ใบเสร็จการซื้อ · Receipt', 76, 72)

  // Member section
  let y = 120
  ctx.fillStyle = textMuted
  ctx.font = '11px Sarabun, sans-serif'
  ctx.fillText('สมาชิก', 32, y)
  y += 20
  ctx.fillStyle = textPrimary
  ctx.font = 'bold 17px Sarabun, sans-serif'
  ctx.fillText(entry.memberName, 32, y)

  // Member type badge
  const badgeBg = entry.memberType === 'AMB' ? 'rgba(255,215,0,0.2)' : 'rgba(192,132,252,0.2)'
  const badgeText = entry.memberType === 'AMB' ? '#FFD700' : '#c084fc'
  roundRect(ctx, W - 80, y - 16, 52, 22, 11, badgeBg)
  ctx.fillStyle = badgeText
  ctx.font = 'bold 12px Sarabun, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(entry.memberType, W - 80 + 26, y - 1)
  ctx.textAlign = 'left'

  y += 16
  // Divider
  ctx.strokeStyle = divider
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(32, y); ctx.lineTo(W - 32, y); ctx.stroke()
  y += 16

  // Product section
  ctx.fillStyle = textMuted
  ctx.font = '11px Sarabun, sans-serif'
  ctx.fillText('สินค้า', 32, y)
  y += 18
  ctx.fillStyle = gold
  ctx.font = '12px Sarabun, sans-serif'
  ctx.fillText(entry.productCode, 32, y)
  y += 18
  ctx.fillStyle = textPrimary
  ctx.font = '14px Sarabun, sans-serif'
  // Wrap long product name
  const maxW = W - 64
  const words = (entry.productName || '').split(' ')
  let line = ''
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, 32, y); y += 20; line = word
    } else { line = test }
  }
  if (line) { ctx.fillText(line, 32, y); y += 20 }

  y += 4
  // Price row — split to avoid overflow
  ctx.fillStyle = textMuted
  ctx.font = '12px Sarabun, sans-serif'
  ctx.fillText(`หน่วย: ${entry.qtyUnit}   จำนวน: ${entry.quantity} หน่วย`, 32, y)
  y += 18
  ctx.fillText(`ราคา/ชิ้น: ฿${entry.pricePerPiece?.toLocaleString('th-TH')}`, 32, y)
  y += 18
  ctx.fillStyle = textPrimary
  ctx.font = 'bold 14px Sarabun, sans-serif'
  ctx.fillText(`ราคารวม: ฿${entry.totalPrice?.toLocaleString('th-TH')}`, 32, y)
  y += 18

  // Divider
  ctx.strokeStyle = divider
  ctx.beginPath(); ctx.moveTo(32, y); ctx.lineTo(W - 32, y); ctx.stroke()
  y += 20

  // Stars section - centered
  ctx.fillStyle = textMuted
  ctx.font = '11px Sarabun, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('ดาวที่ได้รับ', W / 2, y)
  y += 24
  ctx.fillStyle = gold
  ctx.font = 'bold 22px Sarabun, sans-serif'
  ctx.fillText(`⭐ ${entry.starsEarned?.toLocaleString('th-TH')} ดาว`, W / 2, y)
  y += 20
  ctx.fillStyle = textMuted
  ctx.font = '12px Sarabun, sans-serif'
  ctx.fillText(`${entry.memberType}: ${entry.ratePerUnit} ดาว/หน่วย`, W / 2, y)
  ctx.textAlign = 'left'
  y += 20

  // Divider
  ctx.strokeStyle = divider
  ctx.beginPath(); ctx.moveTo(32, y); ctx.lineTo(W - 32, y); ctx.stroke()
  y += 16

  // Cumulative balance
  ctx.fillStyle = textMuted
  ctx.font = '12px Sarabun, sans-serif'
  ctx.fillText('ดาวสะสมทั้งหมด:', 32, y)
  ctx.fillStyle = gold
  ctx.font = 'bold 15px Sarabun, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`${entry.cumulativeBalance?.toLocaleString('th-TH')} ดาว`, W - 32, y)
  ctx.textAlign = 'left'
  y += 28

  // Footer
  ctx.fillStyle = textMuted
  ctx.font = '11px Sarabun, sans-serif'
  const date = new Date(entry.timestamp)
  ctx.fillText(date.toLocaleString('th-TH'), 32, y)
  ctx.textAlign = 'right'
  ctx.fillStyle = textMuted
  ctx.fillText('24 เม.ย. – 23 พ.ค. 2569', W - 32, y)
  ctx.textAlign = 'left'
}

export default function ReceiptModal({ entry, onClose }) {
  const canvasRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    if (entry && canvasRef.current) {
      drawReceipt(canvasRef.current, entry, isDark)
    }
  }, [entry, isDark])

  function handleDownload() {
    if (!canvasRef.current) return
    canvasRef.current.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt_${entry.memberName}_${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(5,10,26,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-card p-6 flex flex-col gap-5 w-full max-w-sm"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest t-label font-medium">ใบเสร็จการซื้อ</p>
                <h2 className="text-base font-bold t-text">Receipt</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'var(--c-btn-sec)',
                  border: '1px solid var(--c-btn-sec-border)',
                  color: 'var(--c-btn-sec-text)',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Canvas Preview */}
            <div className="flex justify-center overflow-hidden rounded-xl" style={{ background: isDark ? '#0A1628' : '#EFF6FF' }}>
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '8px',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="gold-btn flex-1 py-3 flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                ดาวน์โหลด
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'var(--c-btn-sec)',
                  border: '1px solid var(--c-btn-sec-border)',
                  color: 'var(--c-btn-sec-text)',
                }}
              >
                ปิด
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
