import { vertical } from './vertical'
import { sector } from './sector'
import { pythagoras } from './pythagoras'
import { inscribed } from './inscribed'
import type { Scene } from '../types'

export const scenes: Record<string, Scene> = {
  T6: vertical,
  D10: sector,
  T11: sector,
  T12: sector,
  T30: pythagoras,
  T44: inscribed,
  T45: inscribed,
  T46: { ...inscribed, parameters: inscribed.parameters.map(parameter =>
    parameter.key === 'theta' ? { ...parameter, initial: 180, target: 180 } : parameter) },
}
