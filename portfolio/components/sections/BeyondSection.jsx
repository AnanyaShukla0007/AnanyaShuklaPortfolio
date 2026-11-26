'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/BeyondSection.module.css'

const { hobbies, stage } = profile.beyond

function Media({ item, index }) {
  if (item.video) {
    return (
      <video className={styles.media} src={item.video} poster={item.image || undefined}
        autoPlay muted loop playsInline preload="metadata" aria-label={item.title} />
    )
  }
  if (item.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={styles.media} src={item.image} alt={item.title} loading="lazy" />
  }
  return (
    <div className={styles.placeholder} data-variant={index % 3}>
      <span className={styles.phIcon} aria-hidden>{item.icon}</span>
    </div>
  )
}

export default function BeyondSection() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const scroller = document.querySelector('main')
    if (!section || !scroller) return
    const items = section.querySelectorAll('[data-reveal]')
    gsap.set(items, { opacity: 0, y: 28 })
    let shown = false
    function check() {
      if (shown) return
      const r = section.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.6) {
        shown = true
        gsap.to(items, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 })
      }
    }
    check()
    scroller.addEventListener('scroll', check, { passive: true })
    return () => scroller.removeEventListener('scroll', check)
  }, [])

  const h = hobbies[active]

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Beyond code">
      <div className={styles.inner}>
        {/* ── Left: hobbies ───────────────────── */}
        <div className={styles.left}>
          <p className={styles.eyebrow} data-reveal>Beyond the code</p>
          <h2 className={styles.title} data-reveal>
            On stage, <em>in step</em>,<br />between pages.
          </h2>

          <div className={styles.tabs} data-reveal role="tablist">
            {hobbies.map((x, i) => (
              <button key={x.title} role="tab" aria-selected={i === active}
                className={i === active ? styles.tabOn : styles.tab}
                onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                <span aria-hidden>{x.icon}</span>{x.title}
              </button>
            ))}
          </div>

          <div className={styles.feature} data-reveal key={h.title}>
            <div className={styles.frame}><Media item={h} index={active} /></div>
            <div className={styles.featureText}>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
              {h.tags && <div className={styles.tags}>{h.tags.map(t => <span key={t}>{t}</span>)}</div>}
            </div>
          </div>
        </div>

        {/* ── Right: stage & leadership ───────── */}
        <div className={styles.right}>
          <p className={styles.eyebrow} data-reveal>Leadership & stage</p>
          <ol className={styles.timeline}>
            {stage.map((s, i) => (
              <li key={s.title} className={styles.event} data-reveal>
                <div className={styles.dot} aria-hidden />
                <div className={styles.eventBody}>
                  <span className={styles.when}>{s.when}</span>
                  <h4>{s.title}</h4>
                  <span className={styles.role}>{s.role}</span>
                  <p>{s.desc}</p>
                  {(s.image || s.video) && (
                    <div className={styles.eventMedia}><Media item={s} index={i} /></div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
