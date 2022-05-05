import React from 'react'
import { useCourseData } from '@/context/CourseContext'

const CourseDescription = () => {
  const { getCourse } = useCourseData()
  return (
    <div className='py-4 mb-5 text-gray-600 text-sm'>
      {getCourse?.description || (
        <div className='h-16 animate-pulse bg-purple-100 rounded-md'></div>
      )}
    </div>
  )
}

export default CourseDescription
