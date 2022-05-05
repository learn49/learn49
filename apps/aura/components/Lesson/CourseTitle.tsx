import React from 'react'

import { useCourseData } from '@/context/CourseContext'
import ProgressBar from '../ProgressBar'

const CourseTitle = () => {
  const { getCourse } = useCourseData()
  return (
    <div className='text-2xl font-extrabold text-gray-700 leading-none sm:text-4xl'>
      {getCourse?.title || (
        <div className='h-8 animate-pulse bg-purple-100 rounded-md w-1/2'></div>
      )}
      {/* <p className='font-thin text-sm'>Duração: 42min - 10 aulas</p> */}
      <ProgressBar {...getCourse} />
    </div>
  )
}

export default CourseTitle
