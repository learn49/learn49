import { Card, CardBody } from '@learn49/aura-ui'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames'

import Title from '@/elements/Title'
import fullCourses from '@/data/fullCourses.json'

export type CardType = 'default' | 'lite'
interface PropsValues {
  courseName?: string
  courseId: string
  moduleTitle: string
  lessonId: string
  lessonTitle: string
  courseVersionId: string
  defaultVersion: string
  type?: CardType
}

const LastCourseAccess = ({
  courseName,
  courseId,
  moduleTitle,
  lessonId,
  lessonTitle,
  courseVersionId,
  defaultVersion,
  type = 'default'
}: PropsValues) => {
  const WrapperStyles = classNames(
    type === 'lite' && 'bg-gray-200 rounded-md p-4 mt-4 mb-8'
  )

  const cardTypeModels = {
    default: 'py-10 lg:py-20',
    lite: 'py-4'
  }[type]

  const CardStyles = classNames(
    'flex flex-col lg:flex-row w-full mt-2 mb-4 px-4 lg:px-10 gap-4 cursor-pointer',
    cardTypeModels
  )

  return (
    <div className={WrapperStyles}>
      <Title
        text='Continue Assistindo'
        subText='Não perca o foco! Continue de onde parou.'
      />
      <Link
        // eslint-disable-next-line prettier/prettier
        href={`/app/courses/${courseId}/version/${courseVersionId || defaultVersion}/learn/${lessonId}`}
      >
        <Card className={CardStyles} style={{ backgroundColor: '#000024' }}>
          {type === 'default' && (
            <div className='flex items-center justify-center py-8 mr-4 text-white'>
              <Image
                width={220}
                height={70}
                src={fullCourses[courseId].image}
                alt={fullCourses[courseId].title}
                layout='fixed'
                objectFit='contain'
              />
            </div>
          )}
          <CardBody>
            <p className='font-bold text-2xl lg:text-3xl text-white'>
              {[courseName, moduleTitle].filter((x) => x).join(' - ')}
            </p>
            <p className='text-gray-200 mt-2'>Assunto: {lessonTitle}</p>
          </CardBody>
        </Card>
      </Link>
    </div>
  )
}

export default LastCourseAccess
