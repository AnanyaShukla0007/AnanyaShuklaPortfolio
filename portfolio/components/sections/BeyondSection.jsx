'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/BeyondSection.module.css'

const { hobbies, reading, stage } = profile.beyond

/* ── Lightbox: full-screen viewer for a carousel's photos/videos ── */
function Lightbox({ items, start, label, onClose }) {
  const [i, setI] = useState(start)
  const n = items.length
  const cur = items[i]
  const go = (d) => setI((x) => (x + d + n) % n)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return createPortal(
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={label}
      onClick={(e) => e.target === e.currentTarget && onClose()} onWheel={(e) => e.stopPropagation()}>
      <button className={styles.lbClose} onClick={onClose} aria-label="Close">✕</button>
      <div className={styles.lbStage} onClick={(e) => e.target === e.currentTarget && onClose()}>
        {cur.type === 'video' ? (
          <video key={cur.src} className={styles.lbMedia} src={cur.src} poster={cur.poster}
            muted loop autoPlay playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cur.src} className={`${styles.lbMedia} ${styles.fadeIn}`} src={cur.src} alt={cur.alt || label} />
        )}
      </div>
      {n > 1 && (
        <>
          <button className={`${styles.lbArrow} ${styles.lbPrev}`} onClick={() => go(-1)} aria-label="Previous">‹</button>
          <button className={`${styles.lbArrow} ${styles.lbNext}`} onClick={() => go(1)} aria-label="Next">›</button>
        </>
      )}
      <p className={styles.lbCount}>{label} · {i + 1} / {n}</p>
    </div>,
    document.body
  )
}

/* ── Carousel: whole photo shown (no head cropping) over a blurred backdrop.
   Runs only while on screen; videos play through, images rotate. ── */
function Carousel({ items, label }) {
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(false)
  const [broken, setBroken] = useState({})
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const vidRef = useRef(null)
  const n = items.length
  const cur = items[i]
  const go = (d) => setI((x) => (x + d + n) % n)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // images auto-advance only while visible
  useEffect(() => {
    if (!visible || open || cur.type === 'video' || n < 2) return
    const t = setTimeout(() => go(1), 4000)
    return () => clearTimeout(t)
  }, [i, visible, open]) // eslint-disable-line react-hooks/exhaustive-deps

  // play / pause videos with visibility
  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    v.muted = true
    if (visible && !open) v.play().catch(() => {})
    else v.pause()
  }, [visible, i, open])

  const backdrop = cur.type === 'video' ? cur.poster : cur.src

  return (
    <div ref={boxRef} className={styles.carousel} aria-roledescription="carousel" aria-label={label}>
      <div className={styles.stage} onClick={(e) => { if (e.target.closest('button')) return; setOpen(true) }}
        role="button" tabIndex={0} aria-label={`Open ${label} full screen`}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}>
        {broken[i] ? (
          <div className={styles.placeholder}><span>{label}</span></div>
        ) : (
          <>
            {backdrop && cur.type !== 'video' && <div className={styles.backdrop} style={{ backgroundImage: `url(${backdrop})` }} aria-hidden />}
            {cur.type === 'video' ? (
              <video key={cur.src} ref={vidRef} className={styles.media} src={cur.src}
                poster={cur.poster} muted playsInline preload="metadata"
                onEnded={() => (n > 1 ? go(1) : vidRef.current?.play())}
                onError={() => setBroken((b) => ({ ...b, [i]: true }))} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={cur.src} className={`${styles.media} ${styles.fadeIn}`} src={cur.src}
                alt={cur.alt || label} loading="eager" decoding="async"
                onError={() => setBroken((b) => ({ ...b, [i]: true }))} />
            )}
          </>
        )}
        {n > 1 && (
          <>
            <button className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous">‹</button>
            <button className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label="Next">›</button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className={styles.dots}>
          {items.map((_, k) => (
            <button key={k} className={k === i ? styles.dotOn : styles.dotBtn}
              onClick={() => setI(k)} aria-label={`Show ${k + 1} of ${n}`} />
          ))}
        </div>
      )}
      {open && <Lightbox items={items} start={i} label={label} onClose={() => setOpen(false)} />}
    </div>
  )
}

export default function BeyondSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const scroller = document.querySelector('main')
    if (!section || !scroller) return
    const els = section.querySelectorAll('[data-reveal]')
    gsap.set(els, { opacity: 0, y: 28 })
    let shown = false
    function check() {
      if (shown) return
      if (section.getBoundingClientRect().top < window.innerHeight * 0.6) {
        shown = true
        gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 })
      }
    }
    check()
    scroller.addEventListener('scroll', check, { passive: true })
    return () => scroller.removeEventListener('scroll', check)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Beyond code">
      <div className={styles.inner} data-scroll-lane>
        {/* ── Left: hobbies ── */}
        <div className={styles.left}>
          <p className={styles.eyebrow} data-reveal>Beyond the code</p>
          <h2 className={styles.title} data-reveal>
            On stage, <em>in step</em>, between pages.
          </h2>

          <div className={styles.hobbyGrid}>
            {hobbies.map((h) => (
              <article key={h.title} className={styles.hobby} data-reveal>
                <Carousel items={h.media} label={h.title} />
                <div className={styles.hobbyText}>
                  <h3><span aria-hidden>{h.icon}</span> {h.title}</h3>
                  <p>{h.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.reading} data-reveal>
            <h3><span aria-hidden>{reading.icon}</span> {reading.title}</h3>
            <p>{reading.desc}</p>
          </div>
        </div>

        {/* ── Right: leadership & stage ── */}
        <div className={styles.right}>
          <p className={styles.eyebrow} data-reveal>Leadership & stage</p>
          <ol className={styles.timeline} data-scroll-lane>
            {stage.map((s) => (
              <li key={s.title} className={styles.event} data-reveal>
                <div className={styles.dot} aria-hidden />
                <span className={styles.when}>{s.when}</span>
                <h4>{s.title}</h4>
                <span className={styles.role}>{s.role}</span>
                <p>{s.desc}</p>
                {s.media?.length > 0 && (
                  <div className={styles.eventMedia}><Carousel items={s.media} label={s.title} /></div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
