import { useEffect, useRef, useState } from 'react'
import type { Parameter, Values } from './types'

const duration = 3600
const read = (parameters: readonly Parameter[], key: 'initial' | 'target'): Values =>
  Object.fromEntries(parameters.map(parameter => [parameter.key, parameter[key]]))

export function usePlayback(parameters: readonly Parameter[]) {
  const [values, setValues] = useState(() => read(parameters, 'initial'))
  const [playing, setPlaying] = useState(false)
  const progress = useRef(0)
  const start = useRef(values)
  const end = useRef(read(parameters, 'target'))

  useEffect(() => {
    if (!playing) return
    let frame: number
    let last: number | undefined
    function update(time: number) {
      progress.current = Math.min(1, progress.current + (time - (last ?? time)) / duration)
      last = time
      const eased = (1 - Math.cos(Math.PI * progress.current)) / 2
      setValues(Object.fromEntries(parameters.map(({ key }) =>
        [key, start.current[key] + (end.current[key] - start.current[key]) * eased])))
      if (progress.current < 1) frame = requestAnimationFrame(update)
      else setPlaying(false)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [parameters, playing])

  function play() {
    if (!progress.current || progress.current >= 1) {
      start.current = values
      const target = read(parameters, 'target')
      end.current = parameters.every(({ key }) => values[key] === target[key])
        ? read(parameters, 'initial') : target
      progress.current = 0
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValues(end.current)
      progress.current = 1
      return
    }
    setPlaying(true)
  }

  function change(key: string, value: number) {
    setPlaying(false)
    progress.current = 0
    setValues(current => ({ ...current, [key]: value }))
  }

  function reset() {
    setPlaying(false)
    progress.current = 0
    setValues(read(parameters, 'initial'))
  }

  return { values, playing, play, pause: () => setPlaying(false), change, reset }
}
