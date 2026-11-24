import { arc, decimal, dot, green, path, polar } from '../drawing'
import type { Scene } from '../types'

const center = { x: 450, y: 253 }
export const sector: Scene = {
  title: '부채꼴의 호와 넓이',
  instructions: '반지름을 고정한 채 중심각을 두 배로 만들고 호의 길이와 넓이를 비교하세요.',
  parameters: [
    { key: 'theta', label: '중심각', unit: '°', min: 15, max: 345, initial: 75, target: 150 },
    { key: 'radius', label: '반지름', unit: '', min: 2, max: 7, initial: 5, target: 5 },
  ],
  draw(ctx, { theta, radius }) {
    const size = radius * 23
    arc(ctx, center, size, 0, 360, '#c0d2c8')
    arc(ctx, center, size, -90, -90 + theta, green, '#bee5ce')
    path(ctx, [center, polar(center, size, -90)])
    dot(ctx, center)
    return [
      { ...polar(center, size + 36, -90 + theta / 2), text: `${decimal(theta)}°`, tone: 'primary' },
      { x: center.x - 44, y: center.y - size / 2, text: `r = ${decimal(radius)}` },
    ]
  },
  result: ({ theta, radius }) =>
    `호의 길이 ≈ ${decimal(2 * Math.PI * radius * theta / 360)}, 넓이 ≈ ${decimal(Math.PI * radius ** 2 * theta / 360)}`,
}
