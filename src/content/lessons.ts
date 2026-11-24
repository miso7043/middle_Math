import first from './grade-1.json'
import second from './grade-2.json'
import third from './grade-3.json'

export interface Lesson {
  id: string
  grade: number
  unit: string
  page: number
  title: string
  body: string
  lines: string[]
  note?: string
}

export const lessons: Lesson[] = [...first, ...second, ...third]

export function findLessons(grade: number, query: string) {
  const words = query.trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean)
  return lessons.filter(lesson => {
    if (grade && lesson.grade !== grade) return false
    const source = [lesson.id, lesson.unit, lesson.title, lesson.body, ...lesson.lines, lesson.note]
      .join(' ').toLocaleLowerCase('ko')
    return words.every(word => source.includes(word))
  })
}
