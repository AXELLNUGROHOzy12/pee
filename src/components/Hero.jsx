import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import NodeCanvas from './NodeCanvas.jsx'
import { profile } from '../data/content.js'

const BOOT_LINES = [
  'initializing session…',
  `whoami → ${profile.name.toLowerCase().replace(' ', '.')}`,
  `role   → ${profile.role}`,
  'status → ready',
]

export default function Hero() {
  const bootRef = useRef(null)
  const nameRef = useRef(null)
  const metaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = bootRef.current.querySelectorAll('.boot-line')
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      lines.forEach((line, i) => {
        tl.to(line, { opacity: 1, duration: 0.05 }, i * 0.28)
      })
      tl.to(bootRef.current, { opacity: 0, height: 0, marginBottom: 0, duration: 0.5, ease: 'power2.inOut' }, '+=0.5')
        .fromTo(
          nameRef.current.querySelectorAll('.reveal-char'),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.02, ease: 'power4.out' },
          '-=0.1'
        )
        .fromTo(metaRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    })
    return () => ctx.revert()
  }, [])

  const nameChars = profile.name.split('')

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-b border-ink-600">
      <NodeCanvas />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/40 to-ink-950" />

      <div className="relative z-10 px-6 md:px-12 lg:px-20">
        <div ref={bootRef} className="font-mono text-xs md:text-sm text-ink-300 space-y-1.5 mb-10 overflow-hidden">
          {BOOT_LINES.map((line, i) => (
            <p key={i} className="boot-line opacity-0">
              <span className="text-ink-400 mr-2">$</span>
              {line}
            </p>
          ))}
        </div>

        <h1
          ref={nameRef}
          className="font-display font-semibold uppercase leading-[0.88] tracking-tightest text-[13vw] md:text-[8.5vw] lg:text-[7.5vw]"
        >
          <span className="flex flex-wrap">
            {nameChars.map((c, i) => (
              <span key={i} className="overflow-hidden inline-block">
                <span className="reveal-char inline-block">{c === ' ' ? '\u00A0' : c}</span>
              </span>
            ))}
          </span>
        </h1>

        <div ref={metaRef} className="mt-8 flex flex-col md:flex-row md:items-center gap-3 md:gap-8 font-mono text-sm text-ink-300 opacity-0">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-bronze animate-pulse" />
            {profile.status}
          </span>
          <span className="text-ink-400">{profile.focus}</span>
          <span className="text-ink-400">{profile.location}</span>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 md:left-12 lg:left-20 z-10 font-mono text-[11px] tracking-widest2 uppercase text-ink-400">
        scroll to continue
      </div>
    </section>
  )
}
