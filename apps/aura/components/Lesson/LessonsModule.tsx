import React, { useState } from 'react'
import { useRouter } from 'next/router'

import LessonItem from './LessonItem'

interface IContent {
  id: string
  title: string
  completed: boolean
}

interface IProps {
  title: string
  lessons: [IContent]
}

const OpenIcon = () => (
  <svg
    className='w-6 h-6'
    fill='currentColor'
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
      clipRule='evenodd'
    ></path>
  </svg>
)

const CloseIcon = () => (
  <svg
    className='w-6 h-6'
    fill='currentColor'
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
      clipRule='evenodd'
    ></path>
  </svg>
)

const LessonModule = ({ title, lessons }: IProps) => {
  const router = useRouter()
  const { courseId, courseVersionId, lessonId } = router.query
  const [isOpen, setOpen] = useState(true)

  const toggle = () => setOpen(!isOpen)

  return (
    <div className='border-gray-400 border-b hover:bg-gray-300'>
      <div
        onClick={toggle}
        className='sticky z-10 flex justify-between items-center py-2 px-1 cursor-pointer select-none bg-gray-200 hover:bg-gray-300'
      >
        <div className='flex items-center text-gray-700 w-5/6'>
          <div className='rounded-full text-gray-500 w-7 h-7 flex items-center justify-center'>
            {isOpen ? <OpenIcon /> : <CloseIcon />}
          </div>
          {title}
        </div>
        <p className='flex text-sm font-thin justify-end lg:text-center pr-1 w-1/6'>
          {lessons?.length} aula{lessons?.length > 1 && 's'}
        </p>
      </div>
      {lessons?.length > 0 &&
        isOpen &&
        lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            url={`/app/courses/${courseId}/version/${courseVersionId}/learn/${lesson.id}`}
            actually={lesson.id === lessonId}
            {...lesson}
          />
        ))}
    </div>
  )
}

export default LessonModule
