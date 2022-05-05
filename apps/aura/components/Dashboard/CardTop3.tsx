import { Card, CardBody } from '@learn49/aura-ui'
import Image from 'next/image'
import Link from 'next/link'

interface CourseValues {
  id?: string
  version: string
  image: string
  title: string
  subTitle?: string
  description: string
}

interface PropsValues {
  courseOne: CourseValues
  courseTwo: CourseValues
  courseThree: CourseValues
}

const CardTop3 = ({ courseOne, courseTwo, courseThree }: PropsValues) => (
  <div className='flex flex-col md:flex-row gap-4 my-4 w-full'>
    {[courseOne, courseTwo, courseThree].map(
      ({ id, version, image, title, subTitle, description }: CourseValues) => (
        <Link key={id} href={`/app/courses/${id}/version/${version}`}>
          <Card className='pb-4 md:w-1/3 hover:bg-gray-200 cursor-pointer'>
            <div
              className='flex items-center justify-center py-8'
              style={{
                backgroundColor: '#000024'
              }}
            >
              <Image
                width={220}
                height={70}
                src={image}
                alt={title}
                layout='fixed'
                objectFit='contain'
              />
            </div>
            <CardBody className='text-gray-600'>
              <p className='font-bold text-2xl'>{title}</p>
              <p className='text-sm font-light'>{subTitle}</p>
              <p className='py-3'>{description}</p>
            </CardBody>
          </Card>
        </Link>
      )
    )}
  </div>
)

export default CardTop3
