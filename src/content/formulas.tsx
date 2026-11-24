import { Formula, math as m } from '../components/Formula'

const n = m.number
const v = m.variable
const op = m.operator
const row = m.row
const frac = m.fraction
const pow = (base: string, exponent: string) => m.power(v(base), n(exponent))

const formulas: Record<string, React.ReactNode> = {
  T5: row(v('x'), op('='), frac(row(op('−'), v('b')), v('a'))),
  T12: row(v('ℓ'), op('='), n('2'), v('π'), v('r'), frac(v('θ'), n('360')), op(','), v('S'), op('='), v('π'), pow('r','2'), frac(v('θ'), n('360')), op('='), frac(n('1'), n('2')), v('r'), v('ℓ')),
  T30: row(pow('a','2'), op('+'), pow('b','2'), op('='), pow('c','2')),
  T38: row(v('x'), op('='), frac(row(op('−'), v('b'), op('±'), m.root(row(pow('b','2'), op('−'), n('4'), v('a'), v('c')))), row(n('2'), v('a')))),
}

export function LessonFormula({ id }: { id: string }) {
  return formulas[id] ? <div className="formula"><Formula>{formulas[id]}</Formula></div> : null
}

const half = () => frac(n('1'), n('2'))
const radicalFraction = (radicand: string, denominator: string) => frac(m.root(n(radicand)), n(denominator))
const trigRows = [
  ['sin', half(), radicalFraction('2', '2'), radicalFraction('3', '2')],
  ['cos', radicalFraction('3', '2'), radicalFraction('2', '2'), half()],
  ['tan', radicalFraction('3', '3'), n('1'), m.root(n('3'))],
] as const

export function TrigTable() {
  return <table className="trig-table" aria-label="특수각의 삼각비">
    <thead><tr><th scope="col">삼각비</th>{['30°','45°','60°'].map(angle => <th scope="col" key={angle}>{angle}</th>)}</tr></thead>
    <tbody>{trigRows.map(([label, ...values]) => <tr key={label}>
      <th scope="row">{label}</th>
      {values.map((value, index) => <td key={index}><Formula>{value}</Formula></td>)}
    </tr>)}</tbody>
  </table>
}
