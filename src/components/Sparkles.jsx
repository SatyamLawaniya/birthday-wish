import { motion } from 'framer-motion'
import './Sparkles.css'

export default function Sparkles({ count = 30 }) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 14 + 6,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
    char: ['✦', '✧', '⋆', '·', '✿', '❀'][Math.floor(Math.random() * 6)],
  }))

  return (
    <div className="sparkle-layer" aria-hidden="true">
      {sparkles.map(s => (
        <motion.span
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {s.char}
        </motion.span>
      ))}
    </div>
  )
}
