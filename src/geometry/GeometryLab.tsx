import { useId } from 'react'
import { decimal } from './drawing'
import { GeometryCanvas } from './GeometryCanvas'
import type { Scene } from './types'
import { usePlayback } from './usePlayback'

export function GeometryLab({ scene }: { scene: Scene }) {
  const id = useId()
  const { values, playing, play, pause, change, reset } = usePlayback(scene.parameters)
  return <section className="geometry-lab" aria-labelledby={id}>
    <h3 id={id}>{scene.title}</h3>
    <p>{scene.instructions}</p>
    <GeometryCanvas scene={scene} values={values} />
    <output className="geometry-result" aria-live={playing ? 'off' : 'polite'}>{scene.result(values)}</output>
    <div className="geometry-parameters">
      {scene.parameters.map(({ key, label, unit, min, max }) =>
        <label key={key}>
          <span>{label} <strong>{decimal(values[key])}{unit}</strong></span>
          <input type="range" min={min} max={max} value={Math.round(values[key])} aria-valuetext={`${decimal(values[key])}${unit}`}
            onChange={event => change(key, event.target.valueAsNumber)} />
        </label>)}
    </div>
    <div className="playback">
      <button type="button" className="play" onClick={playing ? pause : play}>{playing ? '일시정지' : '재생'}</button>
      <button type="button" onClick={reset}>초기화</button>
    </div>
  </section>
}
