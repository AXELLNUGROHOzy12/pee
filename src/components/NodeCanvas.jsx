import { useEffect, useRef } from 'react'

// A sparse graph of drifting nodes connected by lines when close enough —
// a literal nod to distributed systems (nodes, links, latency) rather than
// a generic particle effect. Plain Canvas2D: no 3D geometry, so no need
// for Three.js.
export default function NodeCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let width, height
    let nodes = []
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const NODE_COUNT = 42
    const LINK_DIST = 130

    function resize() {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio
      canvas.style.width = canvas.offsetWidth + 'px'
    }

    function init() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15 * window.devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.15 * window.devicePixelRatio,
      }))
    }

    function step() {
      ctx.clearRect(0, 0, width, height)
      for (const n of nodes) {
        if (!prefersReduced) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > width) n.vx *= -1
          if (n.y < 0 || n.y > height) n.vy *= -1
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK_DIST * window.devicePixelRatio) {
            ctx.strokeStyle = `rgba(237,237,237,${0.09 * (1 - d / (LINK_DIST * window.devicePixelRatio))})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(237,237,237,0.5)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.6 * window.devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(step)
    }

    resize()
    init()
    step()
    window.addEventListener('resize', () => {
      resize()
      init()
    })

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-70"
      aria-hidden="true"
    />
  )
}
