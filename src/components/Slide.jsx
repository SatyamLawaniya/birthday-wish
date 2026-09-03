import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import './Slide.css'

const filters = [
  { name: 'Peach', value: 'sepia(0.48) hue-rotate(320deg) saturate(1.68) brightness(1.296) contrast(1.14)' },
  { name: 'Lavender', value: 'hue-rotate(260deg) saturate(1.56) brightness(1.32) contrast(1.08)' },
  { name: 'Mint', value: 'hue-rotate(140deg) saturate(1.44) brightness(1.32)' },
  { name: 'Rose', value: 'sepia(0.36) hue-rotate(310deg) saturate(1.8) brightness(1.26) contrast(1.104)' },
  { name: 'Vanilla', value: 'sepia(0.42) saturate(1.92) brightness(1.344)' },
  { name: 'Sky', value: 'hue-rotate(190deg) saturate(1.56) brightness(1.296) contrast(1.14)' },
]

const variants = {
  enter: (dir) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.92,
    rotate: dir > 0 ? 6 : -6,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
  exit: (dir) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.92,
    rotate: dir > 0 ? -6 : 6,
  }),
}

export default function Slide({ photo, activeFilter, index, isActive, direction, onPrev, onNext }) {
  const [dims, setDims] = useState({ w: 1, h: 1 })
  const imgRef = useRef(null)
  const filter = filters[activeFilter] || filters[0]

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const update = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setDims({ w: img.naturalWidth, h: img.naturalHeight })
      }
    }
    update()
    img.addEventListener('load', update)
    return () => img.removeEventListener('load', update)
  }, [photo.src])

  const ratio = dims.h / dims.w || 1
  const maxW = Math.min(Math.max(520, window.innerWidth * 0.75), 1200)
  const maxH = Math.min(window.innerHeight * 0.65, 900)
  let displayW = maxW
  let displayH = displayW * ratio
  if (displayH > maxH) {
    displayH = maxH
    displayW = displayH / ratio
  }
  const isPortrait = ratio > 1
  const isLandscape = ratio < 1

  return (
    <AnimatePresence custom={direction} mode="wait">
      {isActive && (
        <motion.div
          key={index}
          className="slide"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) onNext()
            else if (info.offset.x > 80) onPrev()
          }}
        >
          <div
            className="photo-frame"
            style={{
              width: `${displayW}px`,
              maxWidth: '90vw',
            }}
          >
            <div
              className="photo-inner"
              style={{
                aspectRatio: `${dims.w} / ${dims.h}`,
                maxHeight: `${displayH}px`,
              }}
            >
              <img
                ref={imgRef}
                className="base-layer"
                src={photo.src}
                alt={photo.caption || 'memory'}
                draggable={false}
                style={{ objectPosition: photo.objectPosition || 'center', objectFit: photo.objectFit || 'cover' }}
              />

              {/* filtered layer at 50% opacity to reduce intensity */}
              <img
                className="filtered-layer"
                src={photo.src}
                alt={photo.caption || 'memory'}
                style={{ filter: filter.value, opacity: 0.5, objectPosition: photo.objectPosition || 'center', objectFit: photo.objectFit || 'cover' }}
                draggable={false}
              />

              <div className="photo-overlay-glow" />
            </div>
            {isPortrait && <div className="frame-decor top-left">✿</div>}
            {isPortrait && <div className="frame-decor bottom-right">✿</div>}
            {isLandscape && <div className="frame-decor top-right">✦</div>}
            {isLandscape && <div className="frame-decor bottom-left">✦</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
