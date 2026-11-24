import { useId } from 'react'
import type { Lesson } from '../content/lessons'

export function LessonNavigation({ grade, query, results, activeId, onGrade, onSearch }: {
  grade: number
  query: string
  results: Lesson[]
  activeId: string
  onGrade: (grade: number) => void
  onSearch: (query: string) => void
}) {
  const search = useId()
  const grouped = new Map<string, Lesson[]>()
  for (const lesson of results) {
    const heading = grade ? lesson.unit : `중${lesson.grade} · ${lesson.unit}`
    const group = grouped.get(heading)
    if (group) group.push(lesson)
    else grouped.set(heading, [lesson])
  }

  return <aside className="sidebar">
    <nav className="grade-filter" aria-label="학년 선택">
      {[0, 1, 2, 3].map(option => <button key={option} type="button"
        aria-pressed={grade === option} onClick={() => onGrade(option)}>
        {option ? `중${option}` : '전체'}
      </button>)}
    </nav>
    <label className="search-label" htmlFor={search}>단원 및 항목 검색</label>
    <input id={search} className="search" type="search" placeholder="예: 피타고라스, T30"
      value={query} onChange={event => onSearch(event.target.value)} />
    <p className="result-count" aria-live="polite">{results.length}개 항목</p>
    <nav className="lesson-navigation" aria-label="학습 항목" tabIndex={0}>
      {[...grouped].map(([heading, group]) => <section key={heading}>
        <h2>{heading}</h2>
        <ul>
          {group.map(lesson => <li key={lesson.id}>
            <a href={`#${lesson.id}`} aria-current={lesson.id === activeId ? 'page' : undefined}>
              <span className="lesson-code">{lesson.id}</span> {lesson.title}
            </a>
          </li>)}
        </ul>
      </section>)}
    </nav>
  </aside>
}
