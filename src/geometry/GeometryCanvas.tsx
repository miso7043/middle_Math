import { useLayoutEffect, useRef, useState } from 'react'
import { HEIGHT, WIDTH } from './drawing'
import type { FigureLabel, Scene, Values } from './types'

export function GeometryCanvas({ scene, values }: { scene: Scene; values: Values }) {
  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [width, setWidth] = useState(0)
  const [labels, setLabels] = useState<FigureLabel[]>([])

  useLayoutEffect(() => {
    const element = viewport.current!
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const surface = canvas.current!
    const ctx = surface.getContext('2d')
    if (!ctx || !width) return
    const pixelRatio = window.devicePixelRatio || 1
    const scale = width / WIDTH * pixelRatio
    const pixelWidth = Math.round(WIDTH * scale)
    const pixelHeight = Math.round(HEIGHT * scale)
    if (surface.width !== pixelWidth) surface.width = pixelWidth
    if (surface.height !== pixelHeight) surface.height = pixelHeight
    ctx.setTransform(pixelWidth / WIDTH, 0, 0, pixelHeight / HEIGHT, 0, 0)
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    setLabels(scene.draw(ctx, values))
  }, [scene, values, width])

  return <div ref={viewport} className="geometry-viewport" aria-hidden="true">
    <canvas ref={canvas} />
    <div className="geometry-overlay">
      {labels.map(({ x, y, text, tone }, index) => <span key={index}
        className={`figure-label ${tone ?? ''}`}
        style={{ left: `${100 * x / WIDTH}%`, top: `${100 * y / HEIGHT}%` }}>{text}</span>)}
    </div>
  </div>
}
