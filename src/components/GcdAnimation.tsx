import { useEffect, useId, useRef, useState } from 'react'

const groups = [
  { number: 12, divisors: [1, 2, 3, 4, 6, 12] },
  { number: 18, divisors: [1, 2, 3, 6, 9, 18] },
]
const common = [1, 2, 3, 6]

export function GcdAnimation() {
  const viewport = useRef<HTMLDivElement>(null)
  const titleId = useId()
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

  return <div ref={viewport} className={`gcd-animation${visible ? ' is-visible' : ''}`} role="group" aria-labelledby={titleId}>
    <h4 id={titleId}>공약수에서 최대공약수 찾기</h4>
    {groups.map(({ number, divisors }, index) => <div key={number} className={`gcd-row gcd-row-${index}`}>
      <strong>{number}의 약수</strong>
      <div className="gcd-divisors">{divisors.map(value => <span key={value} className="gcd-divisor">
        {value}
        {common.includes(value) && <svg className="gcd-circle" style={{ animationDelay: `${1.5 + (index * common.length + common.indexOf(value)) * 0.2}s` }} viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" pathLength="1" /></svg>}
      </span>)}</div>
    </div>)}
    <p className="gcd-common">동그라미 친 수가 공약수: <strong>1, 2, 3, 6</strong></p>
    <p className="gcd-order" aria-label="1 < 2 < 3 < 6">
      {common.map((value, index) => <span key={value} className="gcd-order-step" aria-hidden="true" style={{ animationDelay: `${3.4 + index * 0.3}s` }}>
        {index > 0 && ' < '}{value === 6 ? <strong>{value}</strong> : value}
      </span>)}
    </p>
    <p className="gcd-conclusion">그러므로 공약수 중 가장 큰 수인 <strong>6</strong>이 최대공약수입니다.</p>
  </div>
}
