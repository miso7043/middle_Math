import { lazy, Suspense } from 'react'
import { getFigure } from '../content/figures'
import { LessonFormula, TrigTable } from '../content/formulas'
import type { Lesson } from '../content/lessons'
import { scenes } from '../geometry/scenes'

const GeometryLab = lazy(() => import('../geometry/GeometryLab').then(module => ({ default: module.GeometryLab })))

export function LessonDetail({ lesson }: { lesson: Lesson }) {
  const scene = scenes[lesson.id]
  const figure = getFigure(lesson.id)
  return <article id={lesson.id} className="lesson-detail" aria-labelledby={`lesson-title-${lesson.id}`}>
    <div className="lesson-meta">중학교 {lesson.grade}학년 <span aria-hidden="true">/</span> {lesson.unit}</div>
    <div className="lesson-heading">
      <span className="type-chip">{lesson.id.startsWith('D') ? '정의' : '정리'} {lesson.id}</span>
      <h2 id={`lesson-title-${lesson.id}`}>{lesson.title}</h2>
    </div>
    {lesson.body && <p className="lesson-copy">{lesson.body}</p>}
    {lesson.lines.length > 0 && <ul className="formula-lines">
      {lesson.lines.map(line => <li key={line}>{line}</li>)}
    </ul>}
    <LessonFormula id={lesson.id} />
    {lesson.id === 'T43' && <TrigTable />}
    {lesson.note && <aside className="lesson-note"><strong>보충 설명</strong><p>{lesson.note}</p></aside>}
    {lesson.examples.length > 0 && <section className="lesson-example" aria-labelledby={`example-${lesson.id}`}>
      <h3 id={`example-${lesson.id}`}>예제와 풀이</h3>
      <p className="example-question">{lesson.examples[0]}</p>
      <ol>{lesson.examples.slice(1).map(step => <li key={step}>{step}</li>)}</ol>
    </section>}
    {scene && <Suspense fallback={<p>도형을 불러오는 중…</p>}><GeometryLab key={lesson.id} scene={scene} /></Suspense>}
    {figure && <figure className="source-figure">
      <img src={figure.src} alt={figure.alt} loading="lazy" />
      <figcaption>원본 도판</figcaption>
    </figure>}
    <footer className="lesson-source">정의·정리 출처 · 한국 중학교 수학 핵심 정의와 정리, {lesson.page}쪽</footer>
  </article>
}
