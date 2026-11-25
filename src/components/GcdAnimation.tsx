import { NumberSetAnimation } from './animations/NumberSetAnimation'

const groups = [
  { number: 12, values: [1, 2, 3, 4, 6, 12] },
  { number: 18, values: [1, 2, 3, 6, 9, 18] },
]
const common = [1, 2, 3, 6]

export function GcdAnimation() {
  return <NumberSetAnimation title="공약수에서 최대공약수 찾기" groups={groups}
    kind="약수" common={common} commonLabel="공약수" answer={6}
    conclusion={<>그러므로 공약수 중 가장 큰 수인 <strong>6</strong>이 최대공약수입니다.</>} />
}
