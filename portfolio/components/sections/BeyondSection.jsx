'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/BeyondSection.module.css'

const { hobbies, reading, stage } = profile.beyond

/* ── Carousel: images auto-advance, videos play through then advance ── */
function Carousel({ items, label, fit = 'cover' }) {
  const [i, setI] = useState(0)
  const [muted, setMuted] = useState(true)
  const [broken, setBroken] = useState({})
  const vidRef = useRef(null)
  const n = items.length
  const cur = items[i]
  const go = (d) => setI((x) => (x + d + n) % n)

  useEffect(() => {
    if (cur.type === 'video') return
    const t = setTimeout(() => go(1), 3800)
    return () => clearTimeout(t)
  }, [i]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.carousel} aria-roledescription="carousel" aria-label={label}>
      <div className={styles.stage}>
        {broken[i] ? (
          <div className={styles.placeholder}><span>{label}</span></div>
        ) : cur.type === 'video' ? (
          <video key={cur.src} ref={vidRef} className={styles.media} style={{ objectFit: fit }}
            src={cur.src} poster={cur.poster} autoPlay muted={muted} playsInline preload="metadata"
            onEnded={() => go(1)} onError={() => setBroken((b) => ({ ...b, [i]: true }))} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cur.src} className={styles.media} style={{ objectFit: fit }} src={cur.src}
            alt={cur.alt || label} onError={() => setBroken((b) => ({ ...b, [i]: true }))} />
        )}
        {cur.type === 'video' && (
          <button className={styles.sound} onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? '🔇' : '🔊'}</button>
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
      <div className={styles.inner}>
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
          <ol className={styles.timeline}>
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
