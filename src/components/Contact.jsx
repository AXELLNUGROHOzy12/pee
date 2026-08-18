import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { profile, socials } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-reveal',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)

    const btn = btnRef.current
    const onMove = (e) => {
      const r = btn.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    btn?.addEventListener('mousemove', onMove)
    btn?.addEventListener('mouseleave', onLeave)

    return () => {
      ctx.revert()
      btn?.removeEventListener('mousemove', onMove)
      btn?.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="relative px-6 md:px-12 lg:px-20 py-28 md:py-40">
      <p className="contact-reveal font-mono text-xs tracking-widest2 uppercase text-ink-400 mb-8">
        $ send-message --to={profile.name.split(' ')[0].toLowerCase()}
      </p>

      <a
        ref={btnRef}
        href={socials.find((s) => s.label === 'Email')?.href}
        data-cursor="grow"
        className="contact-reveal font-display font-semibold text-[12vw] md:text-[7vw] leading-[0.9] tracking-tightest inline-block hover:text-bronze transition-colors duration-300"
      >
        Let's talk.
      </a>

      <div className="contact-reveal mt-16 flex flex-wrap gap-x-10 gap-y-3 font-mono text-sm text-ink-300">
        {socials.map((s) => (
          <a key={s.label} href={s.href} data-cursor="grow" className="hover:text-ink-100 transition-colors border-b border-transparent hover:border-ink-100 pb-0.5">
            {s.label}
          </a>
        ))}
      </div>

      <div className="contact-reveal mt-24 pt-8 border-t border-ink-600 flex flex-wrap justify-between gap-4 font-mono text-[11px] text-ink-400 uppercase tracking-widest2">
        <span>{profile.name} — {profile.role}</span>
        <span>Built with React, GSAP &amp; Lenis</span>
      </div>
    </section>
  )
}
