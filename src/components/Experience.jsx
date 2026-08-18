import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { experience } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.log-row',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
      gsap.fromTo(
        '.log-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'bottom 80%', scrub: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="log" ref={sectionRef} className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 border-b border-ink-600">
      <p className="font-mono text-xs tracking-widest2 uppercase text-ink-400 mb-14">$ git log --history</p>

      <div className="relative pl-8 md:pl-12">
        <div className="log-line absolute left-[3px] md:left-[7px] top-2 bottom-2 w-px bg-ink-600" />

        <div className="space-y-14">
          {experience.map((e) => (
            <div key={e.hash} className="log-row relative">
              <div className="absolute -left-8 md:-left-12 top-1.5 w-2 h-2 rounded-full bg-ink-100" />
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                <span className="font-mono text-xs text-bronze">{e.hash}</span>
                <span className="font-mono text-xs text-ink-400">{e.date}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
                {e.title} <span className="text-ink-400 font-normal">/ {e.org}</span>
              </h3>
              <p className="font-body text-ink-300 mt-2 max-w-xl">{e.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
