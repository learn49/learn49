import { useCourseData } from '@/context/CourseContext'

const LessonTitle = () => {
  const { getCourseLessonByEnrollment } = useCourseData()

  return (
    <div className='flex items-center text-2xl text-gray-600 font-semibold mb-2 px-4 lg:px-2'>
      {!getCourseLessonByEnrollment && (
        <div className='ml-2 h-6 animate-pulse bg-purple-100 rounded-md w-full'></div>
      )}
      {getCourseLessonByEnrollment && (
        <p>Aula: {getCourseLessonByEnrollment?.title}</p>
      )}
    </div>
  )
}

export default LessonTitle
