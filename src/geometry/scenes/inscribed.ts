import { arc, decimal, dot, green, midpoint, orange, path, polar } from '../drawing'
import type { Scene } from '../types'

const center = { x: 450, y: 253 }
const radius = 160
export const inscribed: Scene = {
  title: '한 호를 바라보는 원주각',
  instructions: '점 P를 반대쪽 호에서 움직여 보세요. 중심각을 180°로 설정하면 반원에 대한 원주각을 볼 수 있습니다.',
  parameters: [
    { key: 'position', label: '점 P의 위치', unit: '°', min: 110, max: 250, initial: 125, target: 235 },
    { key: 'theta', label: '중심각', unit: '°', min: 40, max: 180, initial: 120, target: 120 },
  ],
  draw(ctx, { position, theta }) {
    const a = polar(center, radius, -theta / 2)
    const b = polar(center, radius, theta / 2)
    const p = polar(center, radius, position)
    arc(ctx, center, radius, 0, 360, '#a3bfb0')
    path(ctx, [a, p, b], green)
    arc(ctx, center, 44, -theta / 2, theta / 2, orange, '#f4dcca')
    path(ctx, [a, center, b], orange)
    arc(ctx, center, radius, -theta / 2, theta / 2, orange)
    dot(ctx, a, orange)
    dot(ctx, b, orange)
    dot(ctx, p, green)
    const chordMiddle = midpoint(a, b)
    const label = midpoint(p, midpoint(p, chordMiddle))
    return [
      { ...polar(center, radius + 32, position), text: 'P', tone: 'primary' },
      { x: center.x + 65, y: center.y, text: `${decimal(theta)}°`, tone: 'secondary' },
      { ...label, text: `${decimal(theta / 2)}°`, tone: 'primary' },
    ]
  },
  result: ({ theta }) => `중심각 ${decimal(theta)}° ÷ 2 = 원주각 ${decimal(theta / 2)}°`,
}
