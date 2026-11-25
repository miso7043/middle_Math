import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { LessonMotivation as Motivation } from '../content/lessonMotivations'
import './lesson-motivation.css'

export function LessonMotivation({ title, content }: { title: string; content: Motivation }) {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const element = dialog.current
    if (!element) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      trigger.current?.focus({ preventScroll: true })
    }
  }, [open])

  const sections = [
    { title: '왜 이런 개념일까요?', paragraphs: content.explanation },
    { title: '왜 배우고 왜 중요한가요?', items: content.reasons },
    { title: '어디에 쓰일까요?', items: content.applications },
    { title: '나중에 무엇으로 이어질까요?', items: content.next },
  ]

  return <>
    <button ref={trigger} type="button" className="motivation-trigger" aria-haspopup="dialog" onClick={() => setOpen(true)}>
      왜 공부할까요?<span className="motivation-sr-only">: {title}</span>
    </button>
    {open && createPortal(<dialog ref={dialog} className="motivation-dialog" aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); setOpen(false) }} onClose={() => setOpen(false)}>
      <div className="motivation-header">
        <div><p>왜 공부할까요?</p><h2 id={titleId}>{title}</h2></div>
        <button type="button" onClick={() => setOpen(false)} aria-label={`${title} 설명 닫기`} autoFocus>닫기</button>
      </div>
      <div className="motivation-content">
        <p className="motivation-insight">{content.insight}</p>
        {sections.map(section => <section key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs?.map(text => <p key={text}>{text}</p>)}
          {section.items && <ul>{section.items.map(text => <li key={text}>{text}</li>)}</ul>}
        </section>)}
        <p className="motivation-takeaway">{content.takeaway}</p>
      </div>
    </dialog>, document.body)}
  </>
}
