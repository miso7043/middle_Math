import { useEffect, useState } from 'react'
import { LessonDetail } from './components/LessonDetail'
import { LessonNavigation } from './components/LessonNavigation'
import { findLessons, lessons } from './content/lessons'

const defaultLesson = 'T30'
const linkedLesson = () => window.location.hash.slice(1).toUpperCase()

export function App() {
  const [id, setId] = useState(() => lessons.some(lesson => lesson.id === linkedLesson()) ? linkedLesson() : defaultLesson)
  const [grade, setGrade] = useState(0)
  const [query, setQuery] = useState('')
  useEffect(() => {
    function syncLink() {
      const linked = lessons.find(lesson => lesson.id === linkedLesson())
      if (!linked) {
        setId(defaultLesson)
        return
      }
      setId(linked.id)
    }
    window.addEventListener('hashchange', syncLink)
    return () => window.removeEventListener('hashchange', syncLink)
  }, [])

  const results = findLessons(grade, query)
  const active = results.find(lesson => lesson.id === id) ?? results[0]
  return <>
    <a className="skip" href="#lesson-content" onClick={event => {
      event.preventDefault()
      document.getElementById('lesson-content')?.focus()
    }}>학습 내용으로 건너뛰기</a>
    <header className="site-header">
      <div className="header-inner">
        <span className="site-kicker">중학교 수학</span>
        <h1>정의와 정리</h1>
        <p>중1부터 중3까지, 84개 핵심 개념과 직접 움직여 보는 도형</p>
      </div>
    </header>
    <div className="app-layout">
      <LessonNavigation grade={grade} query={query} results={results} activeId={active?.id ?? ''}
        onGrade={setGrade} onSearch={setQuery} />
      <main id="lesson-content" tabIndex={-1}>
        {active ? <LessonDetail lesson={active} /> : <div className="empty">
          <h2>검색 결과가 없습니다</h2>
          <p>다른 검색어 또는 학년을 선택하세요.</p>
          <button type="button" onClick={() => { setGrade(0); setQuery('') }}>전체 항목 보기</button>
        </div>}
      </main>
    </div>
  </>
}
