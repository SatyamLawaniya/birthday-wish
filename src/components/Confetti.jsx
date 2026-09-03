import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Confetti.css'

const SHAPES = ['🌸','💖','✨','🎀','⭐','🌷','💕','🦋','🍡','🧁','🌈','☁️']
const COLORS = ['#ffb3d1','#c5a3ff','#a3d8ff','#b3f0d1','#ffd6a3','#fff0f5']

export default function Confetti() {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    const arr = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 3 + Math.random() * 3,
      rot: Math.random() * 360,
      size: 14 + Math.random() * 18,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: (Math.random() - 0.5) * 200,
    }))
    setPieces(arr)
  }, [])

  return (
    <div className="confetti-layer" aria-hidden="true">
      <AnimatePresence>
        {pieces.map(p => (
          <motion.span
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.x}%`,
              fontSize: `${p.size}px`,
              color: p.color,
            }}
            initial={{ y: '-10%', opacity: 0, rotate: 0 }}
            animate={{
              y: '110vh',
              opacity: [0, 1, 1, 0],
              rotate: [0, p.rot, p.rot * 2],
              x: [0, p.drift, p.drift * 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeIn',
            }}
          >
            {p.shape}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
