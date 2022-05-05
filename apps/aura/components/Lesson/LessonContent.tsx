import React from 'react'
import { useCourseData } from '@/context/CourseContext'
import LessonsModule from './LessonsModule'

const LessonContent = () => {
  const { getCourseModules } = useCourseData()

  return (
    <>
      {getCourseModules?.map((e) => (
        <LessonsModule key={e.id} {...e} />
      ))}
    </>
  )
}

export default LessonContent
