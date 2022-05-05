import React from 'react'

import Title from '@/elements/Title'
import CardInstructor from '@/components/Courses/CardInstructor'
import { CourseProvider } from '@/context/CourseContext'
import LessonControls from '@/components/Lesson/LessonControls'
import EditorDraftJS from '@/components/EditorDraftJS'
import LessonTitle from '@/components/Lesson/LessonTitle'
import CourseTitle from '@/components/Lesson/CourseTitle'
import CourseDescription from '@/components/Lesson/CourseDescription'
import LessonContent from '@/components/Lesson/LessonContent'

const Learn = () => {
  return (
    <CourseProvider>
      <main className='flex flex-col lg:flex-row 2xl:container xl:mx-auto'>
        <div className='w-full lg:w-3/4 m-0 p-0'>
          <div className='flex flex-col'>
            <EditorDraftJS />
            <LessonTitle />
            <div className='w-full md:flex md:flex-row md:justify-end md:items-center md:px-4 lg:px-2 py-1'>
              <LessonControls />
            </div>
          </div>
          <div className='flex flex-col justify-center px-4 lg:px-2'>
            <CardInstructor type='clean' />
            <CourseTitle />
            <CourseDescription />
          </div>
          <div className='lg:py-10'></div>
        </div>
        <div className='py-10 lg:py-0 lg:w-1/4'>
          <div className='flex justify-between items-center bg-gray-300'>
            <Title text='Conteúdo' className='p-2' />
          </div>
          <div className='pb-2'>
            <LessonContent />
          </div>
        </div>
      </main>
    </CourseProvider>
  )
}

export default Learn
