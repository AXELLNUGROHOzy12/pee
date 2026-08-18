import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Cursor from './components/Cursor.jsx'
import StatusBar from './components/StatusBar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Experience from './components/Experience.jsx'
import Contact from './components/Contact.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const progressRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lenis
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenis.on('scroll', ScrollTrigger.update)
      const raf = (time) => {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }

    gsap.ticker.add(() => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`
      }
    })

    return () => {
      lenis?.destroy()
    }
  }, [])

  return (
    <>
      <Cursor />

      {/* Thin scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[600] bg-ink-800">
        <div ref={progressRef} className="h-full bg-ink-100 origin-left" style={{ transform: 'scaleX(0)' }} />
      </div>

      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <StatusBar />
    </>
  )
}
