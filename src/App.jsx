import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Slide from './components/Slide'
import WishText from './components/WishText'
import Sparkles from './components/Sparkles'
import Confetti from './components/Confetti'
import Intro from './components/Intro'
import './App.css'

const PHOTOS = [
  { src: '/photos/photo2.jpg',  caption: 'chhabdi 2'  },
  { src: '/photos/photo3.jpg',  caption: 'chhabdi 3'  },
  { src: '/photos/photo1.jpg',  caption: 'chhabdi 1'  },
  { src: '/photos/photo4.jpg',  caption: 'chhabdi 4'  },
  { src: '/photos/photo5.jpg',  caption: 'chhabdi 5'  },
  { src: '/photos/photo6.jpg',  caption: 'chhabdi 6'  },
  { src: '/photos/photo7.jpg',  caption: 'chhabdi 7'  },
  { src: '/photos/photo8.jpg',  caption: 'chhabdi 8'  },
  { src: '/photos/photo9.jpg',  caption: 'chhabdi 9'  },
  { src: '/photos/photo10.jpg', caption: 'chhabdi 10', objectPosition: 'top' },
]


const FILTERS = [
  { name: 'Peach',     value: 'sepia(0.48) hue-rotate(320deg) saturate(1.68) brightness(1.296) contrast(1.14)' },
  { name: 'Lavender',  value: 'hue-rotate(260deg) saturate(1.56) brightness(1.32) contrast(1.08)' },
  { name: 'Mint',      value: 'hue-rotate(140deg) saturate(1.44) brightness(1.32)' },
  { name: 'Rose',      value: 'sepia(0.36) hue-rotate(310deg) saturate(1.8) brightness(1.26) contrast(1.104)' },
  { name: 'Vanilla',   value: 'sepia(0.42) saturate(1.92) brightness(1.344)' },
  { name: 'Sky',       value: 'hue-rotate(190deg) saturate(1.56) brightness(1.296) contrast(1.14)' },
]

const WISH_LINES = [
  'meri jersey nahi milegi ✨',
  'nachti reh 🌷',
  'ye le cake khale 🍰',
  'btao sabse chhoti bhi 16 ki ho gayi 💗',
]

const NAME = 'Chhabdi'

const WISH_LINE_INTERVAL = 3500
const SLIDE_INTERVAL = 3000 // slideshow interval set to 3s per user request
const FILTER_INTERVAL = 12000

export default function App() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [activeFilter, setActiveFilter] = useState(3)
  const [playing, setPlaying] = useState(true)
  const [activeLine, setActiveLine] = useState(0)
  const [started, setStarted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioCtxRef = useRef(null)
  const musicRef = useRef(null)
  const padIntervalRef = useRef(null)
  const musicAudioRef = useRef(null)

  const goNext = useCallback(() => {
    setDirection(1)
    setIndex(i => (i + 1) % PHOTOS.length)
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setIndex(i => (i - 1 + PHOTOS.length) % PHOTOS.length)

  // MiniFrame removed — slideshow will display the main photo enlarged
  }, [])

  // slideshow
  useEffect(() => {
    if (!playing || !started) return
    const t = setTimeout(goNext, SLIDE_INTERVAL)
    return () => clearTimeout(t)
  }, [index, playing, goNext, started])

  // rotating wish line
  useEffect(() => {
    if (!started) return
    const t = setInterval(() => {
      setActiveLine(l => (l + 1) % WISH_LINES.length)
    }, WISH_LINE_INTERVAL)
    return () => clearInterval(t)
  }, [started])

  // auto-rotate filters
  useEffect(() => {
    if (!playing || !started) return
    const t = setInterval(() => {
      setActiveFilter(f => (f + 1) % FILTERS.length)
    }, FILTER_INTERVAL)
    return () => clearInterval(t)
  }, [playing, started])

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (!started) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setStarted(true) }
        return
      }
      if (e.key === 'ArrowRight') { setPlaying(false); goNext() }
      if (e.key === 'ArrowLeft')  { setPlaying(false); goPrev() }
      if (e.key === ' ')          { e.preventDefault(); setPlaying(p => !p) }
      if (e.key.toLowerCase() === 'm') setMuted(m => !m)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, started])

  // soft pastel pad synth using WebAudio (no asset needed)
  useEffect(() => {
    if (!started || muted) return

    // Try to play a user-provided song at /song.mp3 (public folder). If it plays,
    // use that as the background audio. Otherwise fall back to the soft synth.
    let cancelled = false
    const trySongThenSynth = async () => {
      try {
        const audio = new Audio('/song.mp3')
        audio.loop = true
        audio.volume = 0.64
        await audio.play()
        if (cancelled) { audio.pause(); return }
        musicAudioRef.current = audio
        return
      } catch (e) {
        // playing the audio failed (missing file or autoplay blocked) — fall back
      }

      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      const ctx = new Ctx()
      audioCtxRef.current = ctx

      const master = ctx.createGain()
      master.gain.value = 0.08
      master.connect(ctx.destination)

      // dreamy arpeggio notes (A major pentatonic-ish)
      const notes = [440, 523.25, 659.25, 783.99, 659.25, 523.25]
      let step = 0
      const playNote = () => {
        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const filter = ctx.createBiquadFilter()
        osc.type = 'sine'
        osc.frequency.value = notes[step % notes.length]
        filter.type = 'lowpass'
        filter.frequency.value = 1200
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.6, now + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6)
        osc.connect(filter); filter.connect(gain); gain.connect(master)
        osc.start(now)
        osc.stop(now + 1.7)
        step++
      }
      playNote()
      musicRef.current = setInterval(playNote, 720)

      // sparkle blip
      const blip = () => {
        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(1200 + Math.random() * 800, now)
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.3)
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(0.15, now + 0.02)
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
        osc.connect(g); g.connect(master)
        osc.start(now); osc.stop(now + 0.45)
      }
      padIntervalRef.current = setInterval(() => {
        if (Math.random() < 0.5) blip()
      }, 900)
    }

    trySongThenSynth()

    return () => {
      cancelled = true
      try { if (musicRef.current) { clearInterval(musicRef.current); musicRef.current = null } } catch (e) {}
      try { if (padIntervalRef.current) { clearInterval(padIntervalRef.current); padIntervalRef.current = null } } catch (e) {}
      try { if (musicAudioRef.current) { musicAudioRef.current.pause(); musicAudioRef.current.src = ''; musicAudioRef.current = null } } catch (e) {}
      try { if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null } } catch (e) {}
    }
  }, [started, muted])

  // chime when photo changes
  useEffect(() => {
    if (!started || muted) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = audioCtxRef.current
    if (!ctx) return
    const now = ctx.currentTime
    const freqs = [880, 1108.73, 1318.51]
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.setValueAtTime(0, now + i * 0.08)
      g.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.04)
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 1.2)
      osc.connect(g); g.connect(ctx.destination)
      osc.start(now + i * 0.08)
      osc.stop(now + i * 0.08 + 1.3)
    })
  }, [index, started, muted])

  const handleStart = () => {
    setStarted(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 6000)
  }

  const photo = PHOTOS[index]
  const filter = FILTERS[activeFilter]

  return (
    <div className="app">
      <Sparkles count={48} />
      {showConfetti && <Confetti />}

      <div className="floating-shapes" aria-hidden="true">
        {['💗','🌸','☁️','💖','🌷','⭐','🦋','🎈','🍡','🧁','🌈','✨'].map((c, i) => (
          <motion.span
            key={i}
            className="float-shape"
            style={{ left: `${((i + 1) * 8.3) % 95}%`, fontSize: `${22 + (i % 3) * 8}px` }}
            animate={{
              y: [0, -40 - (i % 4) * 10, 0],
              x: [0, (i % 2 ? 20 : -20), 0],
              rotate: [0, 18, -18, 0],
              opacity: [0.55, 1, 0.55],
            }}
            transition={{ duration: 7 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
          >
            {c}
          </motion.span>
        ))}
      </div>

      {/* tiny orbiting critters */}
      <div className="orbit-layer" aria-hidden="true">
        {['🐰','🦄','🐻','🐱'].map((c, i) => (
          <motion.div
            key={c}
            className="orbiter"
            style={{ fontSize: 32 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 22 + i * 4, repeat: Infinity, ease: 'linear' }}
            initial={false}
          >
            <span style={{
              display: 'inline-block',
              transform: `rotate(${i * 90}deg) translateX(${130 + i * 20}px) rotate(-${i * 90}deg)`,
            }}>{c}</span>
          </motion.div>
        ))}
      </div>

      <header className="top-bar">
        <motion.div
          className="brand"
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={started ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, type: 'spring' }}
        >
          <span className="brand-emoji">🎀</span>
          <span>for {NAME}</span>
          <span className="brand-emoji">🎀</span>
        </motion.div>
      </header>

      <AnimatePresence>
        {!started && <Intro onStart={handleStart} name={NAME} />}
      </AnimatePresence>

      {started && (
        <motion.main
          className="stage"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, type: 'spring' }}
        >
          <div className="slideshow">
            <Slide
              photo={photo}
              activeFilter={activeFilter}
              index={index}
              isActive
              direction={direction}
              onPrev={goPrev}
              onNext={goNext}
            />

            {/* caption removed per request */}

            <button className="nav nav-left" onClick={() => { setPlaying(false); goPrev() }} aria-label="previous">‹</button>
            <button className="nav nav-right" onClick={() => { setPlaying(false); goNext() }} aria-label="next">›</button>
          </div>

          <WishText lines={WISH_LINES} activeIndex={activeLine} name={NAME} photo={photo} />
        </motion.main>
      )}

      {started && (
        <motion.footer
          className="controls"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="dots">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === index ? 'dot-active' : ''}`}
                onClick={() => { setPlaying(false); setDirection(i > index ? 1 : -1); setIndex(i) }}
                aria-label={`go to photo ${i + 1}`}
              />
            ))}
          </div>

          <div className="filter-row">
            {FILTERS.map((f, i) => (
              <button
                key={f.name}
                className={`chip ${i === activeFilter ? 'chip-active' : ''}`}
                onClick={() => setActiveFilter(i)}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div className="btn-row">
            <button className="play-btn" onClick={() => setPlaying(p => !p)}>
              {playing ? '❚❚ pause' : '▶ play'}
            </button>
            <button className="play-btn play-btn-alt" onClick={() => setMuted(m => !m)}>
              {muted ? '🔇 sound off' : '🎵 sound on'}
            </button>
          </div>
        </motion.footer>
      )}
    </div>
  )
}
