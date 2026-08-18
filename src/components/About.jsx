import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-reveal',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
      gsap.fromTo(
        '.tag-item',
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative border-b border-ink-600 px-6 md:px-12 lg:px-20 py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-3">
          <p className="about-reveal font-mono text-xs tracking-widest2 uppercase text-ink-400">$ cat about.md</p>
        </div>

        <div className="md:col-span-7">
          {profile.bio.map((p, i) => (
            <p
              key={i}
              className="about-reveal font-display text-2xl md:text-4xl leading-[1.25] tracking-tight mb-6 last:mb-0"
            >
              {i === 0 ? (
                <>
                  {p.split("don't have a UI")[0]}
                  <span className="font-serif-accent text-bronze">don't have a UI</span>
                  {p.split("don't have a UI")[1]}
                </>
              ) : (
                p
              )}
            </p>
          ))}
        </div>

        <div className="md:col-span-2">
          <p className="about-reveal font-mono text-xs tracking-widest2 uppercase text-ink-400 mb-4">Stack</p>
          <ul className="flex flex-wrap md:flex-col gap-2">
            {profile.stack.map((s) => (
              <li
                key={s}
                className="tag-item font-mono text-xs px-2.5 py-1 border border-ink-600 text-ink-200 md:w-fit"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
