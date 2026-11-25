import type { Point, Scene } from '../types'

const nodes = [
  { x: 300, y: 65, value: 60, prime: false },
  { x: 180, y: 185, value: 2, prime: true },
  { x: 480, y: 185, value: 30, prime: false },
  { x: 360, y: 305, value: 2, prime: true },
  { x: 660, y: 305, value: 15, prime: false },
  { x: 540, y: 425, value: 3, prime: true },
  { x: 780, y: 425, value: 5, prime: true },
]
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const progress = (value: number, step: number) => {
  const t = clamp((value - (step * 30 + 5)) / 23)
  return t * t * (3 - 2 * t)
}
const position = (parent: Point, child: Point, t: number): Point => ({
  x: parent.x + (child.x - parent.x) * t,
  y: parent.y + (child.y - parent.y) * t,
})

export const factorization: Scene = {
  title: '60의 소인수분해 · 소수는 빨간색',
  instructions: '화면에 도형이 나타나면 60 → 2 × 30 → 2 × 2 × 15 → 2 × 2 × 3 × 5 순서로 가지가 자동으로 펼쳐집니다.',
  playback: { durationMs: 4800 },
  parameters: [{ key: 'progress', label: '분해 진행', unit: '%', min: 0, max: 100, initial: 0, target: 100 }],
  draw(ctx, values) {
    const visible: { point: Point; node: typeof nodes[number]; opacity: number }[] = [
      { point: nodes[0], node: nodes[0], opacity: 1 },
    ]
    for (let step = 0; step < 3; step++) {
      const t = progress(values.progress, step)
      if (t === 0) continue
      const parent = nodes[step * 2]
      for (const index of [step * 2 + 1, step * 2 + 2]) {
        const node = nodes[index]
        const point = position(parent, node, t)
        ctx.globalAlpha = t
        ctx.beginPath()
        ctx.moveTo(parent.x, parent.y)
        ctx.lineTo(point.x, point.y)
        ctx.strokeStyle = '#666666'
        ctx.lineWidth = 4
        ctx.stroke()
        visible.push({ point, node, opacity: t })
      }
    }
    // Paint nodes after edges so branches never cross a number.
    for (const { point, node, opacity } of visible) {
      ctx.globalAlpha = opacity
      ctx.beginPath()
      ctx.arc(point.x, point.y, 38, 0, Math.PI * 2)
      ctx.fillStyle = node.prime ? '#f8ddd6' : '#dce6f5'
      ctx.strokeStyle = node.prime ? '#bb3d32' : '#3262ac'
      ctx.lineWidth = 4
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#17211f'
      ctx.font = '32px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(node.value), point.x, point.y + 1)
    }
    ctx.globalAlpha = 1
    return []
  },
  result: ({ progress: p }) => p < 28 ? '60을 2와 30으로 나눕니다.'
    : p < 58 ? '60 = 2 × 30. 30을 2와 15로 나눕니다.'
    : p < 88 ? '60 = 2 × 2 × 15. 15를 3과 5로 나눕니다.'
    : '60 = 2 × 2 × 3 × 5 = 2² × 3 × 5. 빨간색으로 표시한 소수만 남았습니다.',
}
