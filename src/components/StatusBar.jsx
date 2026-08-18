import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'about', label: '~/about' },
  { id: 'work', label: '~/projects' },
  { id: 'log', label: '~/experience' },
  { id: 'contact', label: '~/contact' },
]

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function StatusBar() {
  const [active, setActive] = useState('~')
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = SECTIONS.find((s) => s.id === entry.target.id)
            if (match) setActive(match.label)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    const clock = setInterval(() => setTime(formatTime(new Date())), 30000)
    return () => {
      observer.disconnect()
      clearInterval(clock)
    }
  }, [])

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4 px-4 py-2 rounded-full border border-ink-600 bg-ink-950/80 backdrop-blur-sm font-mono text-[11px] text-ink-300">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
          {active}
        </span>
        <span className="w-px h-3 bg-ink-600" />
        <span className="hidden sm:inline">{time}</span>
      </div>
    </div>
  )
}
