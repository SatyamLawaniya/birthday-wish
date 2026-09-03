import { motion, AnimatePresence } from 'framer-motion'
import './WishText.css'

const lineVariants = {
  hidden: { opacity: 0, y: 20, rotate: -3, scale: 0.92 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      type: 'spring',
      stiffness: 90,
    },
  }),
}

const floatAnim = {
  y: [0, -8, 0],
  rotate: [0, -3, 3, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
}

export default function WishText({ lines, activeIndex, name, photo }) {
  return (
    <motion.div
      className="wish-text"
      initial="hidden"
      animate="visible"
    >
      <motion.div className="wish-cake" animate={floatAnim}>🎂</motion.div>

      <div className="wish-title">
        <span className="wish-hbd">Happy Birthday,</span>{' '}
        <span className="wish-name">{name}</span>
        <span className="wish-hbd">!</span>
        <div className="title-hearts">💗 🌸 💕</div>
      </div>

      <div className="wish-rotator">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIndex}
            className="wish-msg"
            initial={{ opacity: 0, y: 16, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -16, rotate: 2 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
          >
            {lines[activeIndex]}
          </motion.p>
        </AnimatePresence>
        <div className="wish-dots">
          {lines.map((_, i) => (
            <span key={i} className={`wish-dot ${i === activeIndex ? 'wish-dot-on' : ''}`} />
          ))}
        </div>
      </div>

      <motion.div
        className="wish-hearts"
        animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌷 🦋 🌷
      </motion.div>
    </motion.div>
  )
}
