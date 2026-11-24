import { arc, decimal, dot, green, path, polar } from '../drawing'
import type { Scene } from '../types'

const center = { x: 450, y: 253 }
export const vertical: Scene = {
  title: '맞꼭지각',
  instructions: '한 직선의 방향을 바꿔 서로 마주 보는 두 각의 크기를 비교하세요.',
  parameters: [{ key: 'angle', label: '직선 사이의 표시 각', unit: '°', min: 15, max: 155, initial: 45, target: 125 }],
  draw(ctx, { angle }) {
    arc(ctx, center, 72, 0, angle, green, '#bee5ce')
    arc(ctx, center, 72, 180, 180 + angle, green, '#bee5ce')
    path(ctx, [polar(center, 205, 180), polar(center, 205, 0)])
    path(ctx, [polar(center, 205, 180 + angle), polar(center, 205, angle)])
    dot(ctx, center)
    return [angle / 2, 180 + angle / 2].map(direction => ({
      ...polar(center, 112, direction), text: `${decimal(angle)}°`, tone: 'primary',
    }))
  },
  result: ({ angle }) => `맞꼭지각은 각각 ${decimal(angle)}°입니다.`,
}
