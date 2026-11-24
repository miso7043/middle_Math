import { decimal, green, ink, midpoint, orange, path } from '../drawing'
import type { FigureLabel, Point, Scene } from '../types'

function square(ctx: CanvasRenderingContext2D, a: Point, b: Point, area: number, stroke: string, fill: string): FigureLabel {
  const offset = { x: b.y - a.y, y: a.x - b.x }
  const c = { x: b.x + offset.x, y: b.y + offset.y }
  const d = { x: a.x + offset.x, y: a.y + offset.y }
  path(ctx, [a, b, c, d], stroke, fill)
  return { ...midpoint(a, c), text: decimal(area) }
}

export const pythagoras: Scene = {
  title: '세 정사각형의 넓이',
  instructions: '직각을 낀 두 변의 길이를 바꿔 두 작은 정사각형의 넓이 합을 확인하세요.',
  parameters: [
    { key: 'a', label: '직각변 a', unit: '', min: 3, max: 7, initial: 3, target: 6 },
    { key: 'b', label: '직각변 b', unit: '', min: 3, max: 7, initial: 4, target: 7 },
  ],
  draw(ctx, { a, b }) {
    const o = { x: 380, y: 315 }
    const x = { x: o.x + 19 * a, y: o.y }
    const y = { x: o.x, y: o.y - 19 * b }
    const labels = [
      square(ctx, x, o, a ** 2, green, '#bee5ce'),
      square(ctx, o, y, b ** 2, green, '#bee5ce'),
      square(ctx, y, x, a ** 2 + b ** 2, orange, '#f4dcca'),
    ]
    path(ctx, [o, x, y], ink, '#fffdf5')
    path(ctx, [{ x: o.x + 19, y: o.y }, { x: o.x + 19, y: o.y - 19 }, { x: o.x, y: o.y - 19 }])
    return labels
  },
  result: ({ a, b }) => {
    const equality = Number.isInteger(a) && Number.isInteger(b) ? '=' : '≈'
    return `${decimal(a)}² + ${decimal(b)}² ${equality} ${decimal(a ** 2)} + ${decimal(b ** 2)} ${equality} ${decimal(a ** 2 + b ** 2)}`
  },
}
