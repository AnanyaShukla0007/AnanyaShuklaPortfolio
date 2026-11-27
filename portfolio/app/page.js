'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import Navbar                from '@/components/ui/Navbar'
import VideoIntro            from '@/components/sections/VideoIntro'
import HeroSection           from '@/components/sections/HeroSection'
import AboutSection          from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ProjectsSection       from '@/components/sections/ProjectsSection'
import WorkExperienceSection from '@/components/sections/WorkExperienceSection'
import BeyondSection from '@/components/sections/BeyondSection'
import PublicationsFooterSection from '@/components/sections/PublicationsFooterSection'
import ScreenLoader from '@/components/sections/ScreenLoader'
import profile               from '@/data/profile.json'

// Snap: 0=video 1=hero 2=about 3..4=projects 5=work-exp 6=publications 7=footer (mobile: 6=publications 7=footer)
const PROJECT_SLIDES = profile.projects.length
const TOTAL          = 9 + PROJECT_SLIDES  // + Skills + Beyond sections

export default function Home() {
  const mainRef        = useRef(null)
  const idxRef         = useRef(0)
  const busyRef        = useRef(false)
  const tweenRef       = useRef(null)
  const loopOverlayRef = useRef(null)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    // Fade to black → instant scrollTop jump → fade in
    // Used whenever we loop footer → first section
    function fadeLoop(targetScrollTop, targetIdx) {
      busyRef.current = true
      tweenRef.current?.kill()
      gsap.to(loopOverlayRef.current, {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.in',
        onComplete: () => {
          el.scrollTop    = targetScrollTop
          idxRef.current  = targetIdx
          gsap.to(loopOverlayRef.current, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.05,
            onComplete: () => {
              setTimeout(() => { busyRef.current = false }, 300)
            },
          })
        },
      })
    }

    function goTo(idx) {
      // Wrap-around
      if (idx >= TOTAL) idx = 0
      if (idx < 0)      idx = TOTAL - 1

      if (idx === idxRef.current || busyRef.current) return

      // Footer → top: fade-cut instead of scrolling back through all sections
      if (idxRef.current === TOTAL - 1 && idx === 0) {
        fadeLoop(0, 0)
        return
      }

      // Top → footer: fade-cut instead of scrolling forward through all sections
      if (idxRef.current === 0 && idx === TOTAL - 1) {
        fadeLoop((TOTAL - 1) * window.innerHeight, TOTAL - 1)
        return
      }

      idxRef.current = idx
      busyRef.current = true
      tweenRef.current?.kill()
      tweenRef.current = gsap.to(el, {
        scrollTop: idx * window.innerHeight,
        duration: 1.0,
        ease: 'power3.inOut',
        onComplete: () => { setTimeout(() => { busyRef.current = false }, 600) },
      })
    }

    // Inner scroll lanes (e.g. the Beyond timeline) scroll themselves until they hit an edge
    function laneCanScroll(target, dy) {
      const lane = target.closest && target.closest('[data-scroll-lane]')
      if (!lane || lane.scrollHeight <= lane.clientHeight + 2) return false
      if (dy < 0) return lane.scrollTop > 1
      return lane.scrollTop + lane.clientHeight < lane.scrollHeight - 1
    }

    // One gesture = one section. Trackpad momentum and small bounces are ignored:
    // a new move needs a pause in wheel events (gesture end) and enough travel.
    let wheelAcc = 0, wheelDir = 0, lastWheel = 0, gestureUsed = false
    function onWheel(e) {
      if (laneCanScroll(e.target, e.deltaY)) return
      e.preventDefault()
      const now = performance.now()
      const dir = Math.sign(e.deltaY)
      if (now - lastWheel > 180 || dir !== wheelDir) { wheelAcc = 0; gestureUsed = false; wheelDir = dir }
      lastWheel = now
      if (busyRef.current || gestureUsed || !dir) return
      wheelAcc += Math.abs(e.deltaY)
      if (wheelAcc < 40) return
      gestureUsed = true
      goTo(idxRef.current + dir)
    }

    let touchY = 0
    function onTouchStart(e) { touchY = e.touches[0].clientY }
    function onTouchEnd(e) {
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40 || busyRef.current) return
      if (laneCanScroll(e.target, dy)) return
      goTo(idxRef.current + (dy > 0 ? 1 : -1))
    }

    function onScroll() {
      idxRef.current = Math.round(el.scrollTop / window.innerHeight)
    }

    // Footer video ends → same fade-cut loop back to top
    function onFooterLoop() {
      if (busyRef.current) return
      fadeLoop(0, 0)
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches

    el.addEventListener('wheel',  onWheel,  { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true  })

    let mTouchY = 0
    function onMobileTouchStart(e) { mTouchY = e.touches[0].clientY }
    function onMobileTouchEnd(e) {
      const dy = mTouchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40) return
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
      const atTop    = el.scrollTop < 8
      if (dy > 0 && atBottom) fadeLoop(0, 0)
      if (dy < 0 && atTop)    fadeLoop(el.scrollHeight - el.clientHeight, TOTAL - 1)
    }

    if (!isMobile) {
      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    } else {
      el.addEventListener('touchstart', onMobileTouchStart, { passive: true })
      el.addEventListener('touchend',   onMobileTouchEnd,   { passive: true })
    }
    window.addEventListener('footer-loop-back', onFooterLoop)

    return () => {
      el.removeEventListener('wheel',  onWheel)
      el.removeEventListener('scroll', onScroll)
      if (!isMobile) {
        el.removeEventListener('touchstart', onTouchStart)
        el.removeEventListener('touchend',   onTouchEnd)
      } else {
        el.removeEventListener('touchstart', onMobileTouchStart)
        el.removeEventListener('touchend',   onMobileTouchEnd)
      }
      window.removeEventListener('footer-loop-back', onFooterLoop)
      tweenRef.current?.kill()
    }
  }, [])

  return (
    <>
      {showLoader && (
        <ScreenLoader onDismiss={() => setShowLoader(false)} />
      )}

      {/* Full-screen fade overlay for seamless footer → top loop */}
      <div
        ref={loopOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9999,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <Navbar />
      <main ref={mainRef} style={{ height: '100vh', overflowY: 'scroll', overscrollBehavior: 'none' }}>
        <div>
          <VideoIntro />
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <WorkExperienceSection />
          <BeyondSection />
          <PublicationsFooterSection />
        </div>
      </main>
    </>
  )
}
