import { useId } from 'react'
import { decimal } from './drawing'
import { GeometryCanvas } from './GeometryCanvas'
import type { Scene } from './types'
import { usePlayback } from './usePlayback'

export function GeometryLab({ scene }: { scene: Scene }) {
  const id = useId()
  const { viewport, values, playing, change } = usePlayback(scene.parameters, scene.playback)
  return <section className="geometry-lab" aria-labelledby={id}>
    <h3 id={id}>{scene.title}</h3>
    <p>{scene.instructions}</p>
    <div ref={viewport}><GeometryCanvas scene={scene} values={values} /></div>
    <output className="geometry-result" aria-live={playing ? 'off' : 'polite'}>{scene.result(values)}</output>
    <div className="geometry-parameters">
      {scene.parameters.filter(parameter => parameter.key !== 'progress').map(({ key, label, unit, min, max }) =>
        <label key={key}>
          <span>{label} <strong>{decimal(values[key])}{unit}</strong></span>
          <input type="range" min={min} max={max} value={Math.round(values[key])} aria-valuetext={`${decimal(values[key])}${unit}`}
            onChange={event => change(key, event.target.valueAsNumber)} />
        </label>)}
    </div>
  </section>
}
