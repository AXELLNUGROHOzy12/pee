import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// A small dot + trailing ring that follows the pointer, and grows on
// interactive elements. Disabled automatically on touch devices via the
// pointer:fine media query in index.css / the JS check below.
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches
    if (!isFine) return
    document.body.classList.add('custom-cursor-active')

    const dot = dotRef.current
    const ring = ringRef.current
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }

    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      gsap.set(dot, { x: pos.x, y: pos.y })
    }
    window.addEventListener('mousemove', move)

    const ticker = gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      gsap.set(ring, { x: ringPos.x, y: ringPos.y })
    })

    const growables = document.querySelectorAll('[data-cursor="grow"]')
    const grow = () => gsap.to(ring, { scale: 2.4, duration: 0.3, ease: 'power2.out' })
    const shrink = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' })
    growables.forEach((el) => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      gsap.ticker.remove(ticker)
      growables.forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
      })
      document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[998]">
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-ink-100"
      />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-ink-300"
      />
    </div>
  )
}
