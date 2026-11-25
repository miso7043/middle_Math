import { useEffect, useRef, useState } from 'react'

// Reset on leaving the viewport so each animation can replay on re-entry.
export function useViewportAnimation() {
  const viewport = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { viewport, visible }
}
