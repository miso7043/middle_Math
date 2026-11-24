import type { Point } from './types'

export const WIDTH = 900
export const HEIGHT = 506.25
export const ink = '#173831'
export const green = '#167751'
export const orange = '#bb542f'
export const radians = (degrees: number) => degrees * Math.PI / 180
export const polar = (center: Point, radius: number, degrees: number): Point => ({
  x: center.x + radius * Math.cos(radians(degrees)),
  y: center.y + radius * Math.sin(radians(degrees)),
})
export const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
const formatter = new Intl.NumberFormat('ko', { maximumFractionDigits: 2 })
export const decimal = (value: number) => formatter.format(value)

export function path(ctx: CanvasRenderingContext2D, points: Point[], stroke = ink, fill?: string) {
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (const point of points.slice(1)) ctx.lineTo(point.x, point.y)
  if (fill) {
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
  }
  ctx.lineWidth = 4
  ctx.strokeStyle = stroke
  ctx.stroke()
}

export function arc(ctx: CanvasRenderingContext2D, center: Point, radius: number, start: number, end: number, stroke: string, fill?: string) {
  ctx.beginPath()
  if (fill) ctx.moveTo(center.x, center.y)
  ctx.arc(center.x, center.y, radius, radians(start), radians(end))
  if (fill) {
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
  }
  ctx.lineWidth = 4
  ctx.strokeStyle = stroke
  ctx.stroke()
}

export function dot(ctx: CanvasRenderingContext2D, point: Point, color = ink) {
  ctx.beginPath()
  ctx.arc(point.x, point.y, 7, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}
