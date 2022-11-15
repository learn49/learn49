import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface IContent {
  id: string
  title: string
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

const ContentList = ({ title, lessons }: IProps) => {
  const router = useRouter()
  const { courseId, courseVersionId } = router.query
  const [isOpen, setOpen] = useState(false)

  const toggle = () => setOpen(!isOpen)

  return (
    <div className='border-gray-400 border-b hover:bg-gray-300'>
      <div
        onClick={toggle}
        className='flex flex-col md:flex-row justify-between md:items-center py-5 px-8 cursor-pointer select-none bg-gray-200 hover:bg-gray-300'
      >
        <div className='flex gap-2 text-xl text-gray-700'>
          <div className='rounded-full text-gray-500 mt-0.5 w-7 h-7 flex items-center justify-center'>
            {isOpen && <OpenIcon />}
            {!isOpen && <CloseIcon />}
          </div>
          <p>{title}</p>
        </div>
        <p className='flex text-sm font-thin self-end md:self-auto'>
          {lessons?.length} aula{lessons?.length > 1 && 's'}
        </p>
      </div>
      {lessons?.length > 0 &&
        isOpen &&
        lessons.map((lesson: IContent) => (
          <Link
            key={lesson.id}
            href={`/app/courses/${courseId}/version/${courseVersionId}/learn/${lesson.id}`}
          >
            <a className='px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 border-b flex items-center gap-2'>
              <Image
                height={15}
                width={15}
                src='/courses/play-button.png'
                alt='Play Icon'
                layout='fixed'
              />
              {lesson.title}
            </a>
          </Link>
        ))}
    </div>
  )
}

export default ContentList
