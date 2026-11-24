import { createElement } from 'react'

// React's HTML JSX types omit MathML elements. Keeping their tags here preserves the native namespace.
export const math = {
  row: (...children: React.ReactNode[]) => createElement('mrow', null, ...children),
  variable: (value: string) => createElement('mi', null, value),
  number: (value: string) => createElement('mn', null, value),
  operator: (value: string) => createElement('mo', null, value),
  fraction: (upper: React.ReactNode, lower: React.ReactNode) =>
    createElement('mfrac', null, upper, lower),
  root: (value: React.ReactNode) => createElement('msqrt', null, value),
  power: (base: React.ReactNode, exponent: React.ReactNode) =>
    createElement('msup', null, base, exponent),
}

export function Formula({ children }: { children: React.ReactNode }) {
  return createElement('math', null, children)
}
