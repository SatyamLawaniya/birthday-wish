import { motion } from 'framer-motion'
import './Intro.css'

export default function Intro({ onStart, name }) {
  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    >
      <div className="intro-rays" aria-hidden="true" />

      <motion.div
        className="intro-card"
        initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 90, damping: 12, delay: 0.1 }}
      >
        <motion.div
          className="intro-emoji"
          animate={{ rotate: [0, -8, 8, -6, 6, 0], y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🎁
        </motion.div>
        <div className="intro-eyebrow">~ a little something for you ~</div>
        <h1 className="intro-title">
          hello, <span className="intro-name">{name}</span>
        </h1>
        <p className="intro-msg">
          i made a tiny world of sparkles &amp; memories for you.<br/>
          ready to open it?
        </p>
        <motion.button
          className="intro-btn"
          onClick={onStart}
          whileHover={{ scale: 1.08, rotate: -2 }}
          whileTap={{ scale: 0.94 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }}
        >
          ✨ open the magic ✨
        </motion.button>
        <div className="intro-hint">tip: press <kbd>space</kbd> to pause · <kbd>←</kbd>/<kbd>→</kbd> to flip · <kbd>m</kbd> to mute</div>
      </motion.div>

      <div className="intro-bubble-field" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="bubble"
            style={{
              left: `${(i * 7.3) % 100}%`,
              width: `${10 + (i % 4) * 6}px`,
              height: `${10 + (i % 4) * 6}px`,
              background: ['#ffb3d1','#c5a3ff','#a3d8ff','#b3f0d1','#ffd6a3'][i % 5],
            }}
            animate={{
              y: ['110%', '-20%'],
              x: [0, (i % 2 ? 30 : -30), 0],
            }}
            transition={{
              duration: 8 + (i % 4) * 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
