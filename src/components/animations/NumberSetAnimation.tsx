import { type ReactNode, useId } from 'react'
import './number-set-animation.css'
import { useViewportAnimation } from './useViewportAnimation'

type NumberSetAnimationProps = {
  title: string
  groups: { number: number; values: number[] }[]
  kind: '약수' | '양의 배수'
  common: number[]
  commonLabel: string
  answer: number
  conclusion: ReactNode
  continuing?: boolean
}

export function NumberSetAnimation({ title, groups, kind, common, commonLabel, answer, conclusion, continuing = false }: NumberSetAnimationProps) {
  const titleId = useId()
  const { viewport, visible } = useViewportAnimation()

  return <div ref={viewport} className={`number-set-animation${visible ? ' is-visible' : ''}`} role="group" aria-labelledby={titleId}>
    <h4 id={titleId}>{title}</h4>
    {groups.map(({ number, values }, index) => <div key={number} className={`number-set-row number-set-row-${index}`}>
      <strong>{number}의 {kind}</strong>
      <div className="number-set-values">{values.map(value => <span key={value} className="number-set-value">
        {value}
        {common.includes(value) && <svg className="number-set-circle" style={{ animationDelay: `${1.5 + (index * common.length + common.indexOf(value)) * 0.2}s` }} viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" pathLength="1" /></svg>}
      </span>)}{continuing && <span className="number-set-value" aria-hidden="true">…</span>}</div>
    </div>)}
    <p className="number-set-common">동그라미 친 수가 {commonLabel}: <strong>{common.join(', ')}{continuing && ', …'}</strong></p>
    <p className="number-set-order" aria-label={`${common.join(' < ')}${continuing ? ' < …' : ''}`}>
      {common.map((value, index) => <span key={value} className="number-set-order-step" aria-hidden="true" style={{ animationDelay: `${3.4 + index * 0.3}s` }}>
        {index > 0 && ' < '}{value === answer ? <strong>{value}</strong> : value}
      </span>)}
      {continuing && <span className="number-set-order-step" aria-hidden="true" style={{ animationDelay: `${3.4 + common.length * 0.3}s` }}> &lt; …</span>}
    </p>
    <p className="number-set-conclusion">{conclusion}</p>
  </div>
}
