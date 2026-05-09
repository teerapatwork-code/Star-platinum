import { motion } from 'framer-motion'

export default function MemberTypeToggle({ memberType, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-widest t-label font-medium">
        ประเภทสมาชิก
      </span>
      <div
        className="relative flex rounded-xl p-1"
        style={{
          background: 'var(--c-inner)',
          border: '1px solid var(--c-input-border)',
          boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.4)',
        }}
      >
        {['AMB', 'TMW'].map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className="relative flex-1 py-2 text-sm font-bold rounded-lg z-10 transition-colors duration-200"
            style={{
              color: memberType === type ? '#050A1A' : 'rgba(148,163,184,0.7)',
            }}
          >
            {memberType === type && (
              <motion.div
                layoutId="member-type-pill"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFC200)',
                  boxShadow: '0 0 16px rgba(255,215,0,0.4)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <span>{type}</span>
              <span className="text-xs font-normal opacity-70 hidden sm:inline">
                {type === 'AMB' ? '(ตัวแทน)' : '(ลูกค้า)'}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
