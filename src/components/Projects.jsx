import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { projects } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects-eyebrow',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )

      const cards = cardRefs.current
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        const next = cards[i + 1]
        gsap.to(card, {
          scale: 0.94,
          opacity: 0.5,
          filter: 'blur(1.5px)',
          ease: 'none',
          scrollTrigger: {
            trigger: next,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef} className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 border-b border-ink-600">
      <p className="projects-eyebrow font-mono text-xs tracking-widest2 uppercase text-ink-400 mb-14 opacity-0">
        $ cat projects.log
      </p>

      <div className="relative">
        {projects.map((p, i) => (
          <div
            key={p.hash}
            ref={(el) => (cardRefs.current[i] = el)}
            className="sticky mb-8 last:mb-0"
            style={{ top: `${88 + i * 14}px` }}
          >
            <a
              href={p.href}
              data-cursor="grow"
              className="group block border border-ink-600 bg-ink-900 hover:bg-ink-800 transition-colors duration-300 p-8 md:p-12"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                <span className="font-mono text-xs text-ink-400">
                  <span className="text-bronze">#</span>{p.hash} · {p.year}
                </span>
                <span className="font-mono text-xs text-ink-400 uppercase tracking-widest2">{p.role}</span>
              </div>

              <h3 className="font-display font-semibold text-4xl md:text-6xl tracking-tight mb-6 group-hover:translate-x-1 transition-transform duration-300">
                {p.name}
              </h3>

              <p className="font-body text-ink-300 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="font-mono text-[11px] px-2 py-1 border border-ink-600 text-ink-300">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
