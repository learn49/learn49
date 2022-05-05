import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'

import { useCourseData } from '@/context/CourseContext'

const LessonControls = () => {
  const router = useRouter()
  const {
    getCourseLessonByEnrollment,
    handleMarkLesson,
    handleUpdateLastLessonAccess
  } = useCourseData()
  const { courseId, courseVersionId } = router.query

  useEffect(() => {
    handleUpdateLastLessonAccess()
  }, [])

  const defaultStyle =
    'w-1/2 md:w-auto text-center text-sm py-3 font-semibold rounded text-white'

  const buttonStyles = classNames(
    defaultStyle,
    'cursor-pointer',
    getCourseLessonByEnrollment?.completed
      ? 'bg-purple-500 hover:bg-purple-400 md:px-12'
      : 'bg-purple-700 hover:bg-purple-600 md:px-4'
  )

  const linkStyles = classNames(
    defaultStyle,
    'md:px-12',
    getCourseLessonByEnrollment?.nextLesson
      ? 'bg-purple-700 hover:bg-purple-600 '
      : 'bg-purple-300'
  )

  const markLesson = (state) => async () => {
    const url = `/app/courses/${courseId}/version/${courseVersionId}/learn/${getCourseLessonByEnrollment.nextLesson}`
    await handleMarkLesson(state)()
    if (getCourseLessonByEnrollment?.nextLesson) {
      router.push(url)
    }
  }

  const HasNextLesson = ({ children }) => {
    const url = `/app/courses/${courseId}/version/${courseVersionId}/learn/${getCourseLessonByEnrollment.nextLesson}`
    if (getCourseLessonByEnrollment?.nextLesson) {
      return (
        <Link href={url}>
          <a className={linkStyles}>{children}</a>
        </Link>
      )
    }
    return <div className={linkStyles}>Fim da(s) Aula(s)</div>
  }

  if (!getCourseLessonByEnrollment) {
    return (
      <div className='h-12 animate-pulse bg-purple-100 rounded-md w-1/2'></div>
    )
  }

  return (
    <div className='flex justify-between px-4 md:px-0 gap-4'>
      {getCourseLessonByEnrollment?.completed ? (
        <button onClick={handleMarkLesson(false)} className={buttonStyles}>
          Aula Concluida
        </button>
      ) : (
        <button onClick={markLesson(true)} className={buttonStyles}>
          Marcar como Concluída
        </button>
      )}

      <HasNextLesson>Próxima Aula</HasNextLesson>
    </div>
  )
}

export default LessonControls
