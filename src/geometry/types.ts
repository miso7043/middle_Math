export type Point = { x: number; y: number }
export type Values = Readonly<Record<string, number>>

export interface Parameter {
  key: string
  label: string
  unit: string
  min: number
  max: number
  initial: number
  target: number
}

export interface FigureLabel extends Point {
  text: string
  tone?: 'primary' | 'secondary'
}

export interface Scene {
  title: string
  instructions: string
  parameters: readonly Parameter[]
  draw: (canvas: CanvasRenderingContext2D, values: Values) => FigureLabel[]
  result: (values: Values) => string
}
