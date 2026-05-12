import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { productMaster } from './data/products'
import { useDiary } from './hooks/useDiary'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import PromoBadge from './components/PromoBadge'
import MemberCard from './components/MemberCard'
import ProductSearch from './components/ProductSearch'
import LivePreviewCard from './components/LivePreviewCard'
import DiarySection from './components/DiarySection'
import StarSearch from './components/StarSearch'
import ReceiptModal from './components/ReceiptModal'

function AppContent() {
  const [memberName, setMemberName] = useState('')
  const [memberType, setMemberType] = useState('AMB')
  const [productCode, setProductCode] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [foundProduct, setFoundProduct] = useState(null)
  const [receiptEntry, setReceiptEntry] = useState(null)

  const { diary, addEntry, clearDiary } = useDiary(memberName)

  useEffect(() => {
    if (productCode.length === 7) {
      setFoundProduct(productMaster[productCode] || null)
    } else {
      setFoundProduct(null)
    }
  }, [productCode])

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: 'var(--c-bg-grad)',
      }}
    >
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Ambient glow spots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
          style={{ background: 'var(--c-glow-1)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full"
          style={{ background: 'var(--c-glow-2)', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full"
          style={{ background: 'var(--c-glow-3)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 pt-16 sm:pt-8 pb-8 flex flex-col gap-4 sm:gap-6">

        {/* Title & Badge */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1"
            style={{
              background: 'linear-gradient(135deg, #FFE566 0%, #FFD700 40%, #FFC200 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.3))',
            }}
          >
            Campaign Star
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm t-muted"
          >
            โปรแกรมสะสมดาวสำหรับตัวแทน
          </motion.p>
        </div>

        <PromoBadge />

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full flex justify-center"
        >
          <img
            src={`${import.meta.env.BASE_URL}promo-banner.png`}
            alt="คุ้มค่า ล่าดาว Campaign Star"
            className="w-full max-w-2xl rounded-2xl shadow-lg object-cover"
            style={{ border: '1px solid rgba(255,215,0,0.2)' }}
          />
        </motion.div>

        {/* Main Grid: Member + Purchase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Left */}
          <div className="flex flex-col gap-5">
            <MemberCard
              memberName={memberName}
              setMemberName={setMemberName}
              memberType={memberType}
              setMemberType={setMemberType}
              diary={diary}
            />
            <ProductSearch
              productCode={productCode}
              setProductCode={setProductCode}
              quantity={quantity}
              setQuantity={setQuantity}
              foundProduct={foundProduct}
              memberName={memberName}
              memberType={memberType}
              diary={diary}
              addEntry={addEntry}
              onConfirmSuccess={(entry) => setReceiptEntry(entry)}
            />
          </div>

          {/* Right */}
          <div className="flex flex-col gap-5">
            <LivePreviewCard
              foundProduct={foundProduct}
              productCode={productCode}
              quantity={quantity}
              memberType={memberType}
            />
            <DiarySection
              memberName={memberName}
              diary={diary}
              clearDiary={clearDiary}
            />
          </div>
        </div>

        {/* Star Product Finder (full-width) */}
        <StarSearch memberType={memberType} />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center pb-4"
        >
          <p className="text-xs t-faint">
            Campaign Star Loyalty System · {Object.keys(productMaster).length.toLocaleString('th-TH')} สินค้า · พ.ค. 2569 · ข้อมูลจาก Star Patinum.xlsx
          </p>
        </motion.div>

      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        entry={receiptEntry}
        onClose={() => setReceiptEntry(null)}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
