import { NumberSetAnimation } from './animations/NumberSetAnimation'

const groups = [
  { number: 12, values: [12, 24, 36, 48, 60, 72, 84, 96, 108] },
  { number: 18, values: [18, 36, 54, 72, 90, 108] },
]
const common = [36, 72, 108]

export function LcmAnimation() {
  return <NumberSetAnimation title="공배수에서 최소공배수 찾기" groups={groups}
    kind="양의 배수" common={common} commonLabel="양의 공배수" answer={36} continuing
    conclusion={<>그러므로 양의 공배수 중 가장 작은 수인 <strong>36</strong>이 최소공배수입니다.</>} />
}
