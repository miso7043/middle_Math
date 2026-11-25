import { useEffect, useRef, useState } from 'react'
import type { Parameter, Values } from './types'

const readInitial = (parameters: readonly Parameter[]): Values =>
  Object.fromEntries(parameters.map(parameter => [parameter.key, parameter.initial]))

// Visibility and animation timing live here, independently of the lesson UI.
export function usePlayback(parameters: readonly Parameter[], options?: { durationMs: number }) {
  const viewport = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState(() => readInitial(parameters))
  const [playing, setPlaying] = useState(false)
  const stop = useRef<() => void>(() => {})
  const duration = Math.min(5000, Math.max(1, options?.durationMs ?? 3600))

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    let frame = 0
    let visible = false
    const cancel = () => {
      cancelAnimationFrame(frame)
      setPlaying(false)
    }
    stop.current = cancel
    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting && entry.intersectionRatio > 0
      if (visible === nextVisible) return
      visible = nextVisible
      cancel()
      setValues(readInitial(parameters))
      if (!visible) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setValues(Object.fromEntries(parameters.map(({ key, target }) => [key, target])))
        return
      }
      setPlaying(true)
      const started = performance.now()
      function update(time: number) {
        const progress = Math.min(1, (time - started) / duration)
        const eased = (1 - Math.cos(Math.PI * progress)) / 2
        setValues(Object.fromEntries(parameters.map(({ key, initial, target }) =>
          [key, initial + (target - initial) * eased])))
        if (progress < 1) frame = requestAnimationFrame(update)
        else setPlaying(false)
      }
      frame = requestAnimationFrame(update)
    }, { threshold: 0 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      stop.current = () => {}
    }
  }, [parameters, duration])

  function change(key: string, value: number) {
    stop.current()
    setValues(current => ({ ...current, [key]: value }))
  }

  return { viewport, values, playing, change }
}
