import { useEffect, useMemo, useState } from 'react'
import { LessonDetail } from './components/LessonDetail'
import { LessonNavigation } from './components/LessonNavigation'
import { findLessons, lessons } from './content/lessons'

const linkedLesson = () => window.location.hash.slice(1).toUpperCase()

export function App() {
  const [id, setId] = useState(linkedLesson)
  const [grade, setGrade] = useState(0)
  const [query, setQuery] = useState('')
  const results = useMemo(() => findLessons(grade, query), [grade, query])

  useEffect(() => {
    function syncLink() {
      const target = document.getElementById(linkedLesson())
      if (target) target.scrollIntoView({ block: 'start' })
    }
    syncLink()
    window.addEventListener('hashchange', syncLink)
    return () => window.removeEventListener('hashchange', syncLink)
  }, [results])

  useEffect(() => {
    let frame = 0
    function updateActive() {
      frame = 0
      const sections = results.map(lesson => document.getElementById(lesson.id))
        .filter((section): section is HTMLElement => section !== null)
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top > 100) break
        current = section
      }
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1]
      }
      setId(current?.id ?? '')
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateActive)
    }
    const observer = new ResizeObserver(scheduleUpdate)
    const content = document.getElementById('lesson-content')
    if (content) observer.observe(content)
    updateActive()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [results])

  function resetPosition() {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    document.getElementById('lesson-content')?.scrollIntoView({ block: 'start' })
  }
  return <>
    <a className="skip" href="#lesson-content" onClick={event => {
      event.preventDefault()
      document.getElementById('lesson-content')?.focus()
    }}>학습 내용으로 건너뛰기</a>
    <header className="site-header">
      <div className="header-inner">
        <span className="site-kicker">중학교 수학</span>
        <h1>정의와 정리</h1>
        <p>중1부터 중3까지, {lessons.length}개 핵심 개념과 직접 움직여 보는 도형</p>
      </div>
    </header>
    <div className="app-layout">
      <LessonNavigation grade={grade} query={query} results={results} activeId={id}
        onGrade={value => { resetPosition(); setGrade(value) }} onSearch={value => { resetPosition(); setQuery(value) }} />
      <main id="lesson-content" tabIndex={-1}>
        {results.length > 0 ? results.map(lesson => <LessonDetail key={lesson.id} lesson={lesson} />) : <div className="empty">
          <h2>검색 결과가 없습니다</h2>
          <p>다른 검색어 또는 학년을 선택하세요.</p>
          <button type="button" onClick={() => { setGrade(0); setQuery('') }}>전체 항목 보기</button>
        </div>}
      </main>
    </div>
  </>
}
