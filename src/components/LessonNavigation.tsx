import { useEffect, useId, useRef } from 'react'
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
  const navigation = useRef<HTMLElement>(null)
  useEffect(() => {
    const nav = navigation.current
    const active = nav?.querySelector<HTMLElement>('[aria-current]')
    if (!nav || !active) return
    const bounds = nav.getBoundingClientRect()
    const item = active.getBoundingClientRect()
    if (item.top < bounds.top) nav.scrollTop -= bounds.top - item.top
    else if (item.bottom > bounds.bottom) nav.scrollTop += item.bottom - bounds.bottom
  }, [activeId])
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
    <nav ref={navigation} className="lesson-navigation" aria-label="학습 항목" tabIndex={0}>
      {[...grouped].map(([heading, group]) => <section key={heading}>
        <h2>{heading}</h2>
        <ul>
          {group.map(lesson => <li key={lesson.id}>
            <a href={`#${lesson.id}`} aria-current={lesson.id === activeId ? 'location' : undefined}>
              <span className="lesson-code">{lesson.id}</span> {lesson.title}
            </a>
          </li>)}
        </ul>
      </section>)}
    </nav>
  </aside>
}
