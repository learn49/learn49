import React, { useContext } from 'react'
import { useQuery } from 'urql'
import Link from 'next/link'

import { AccountContext } from '@/context/AccountContext'
import Title from '@/elements/Title'
import Head from '@/elements/Head'
import CardLastCourseAccess from '@/components/Dashboard/CardLastCourseAccess'
import CardTop3 from '@/components/Dashboard/CardTop3'
import CardCourses from '@/components/Dashboard/CardCourses'
import Support from '@/components/Dashboard/Support'
import Copyright from '@/components/Copyright'
import fullCourses from '@/data/fullCourses.json'

const HOME_QUERY = `
  query getHome($accountId: String!, $limit: Float!, $offset: Float!) {
    getCourses(accountId: $accountId, limit: $limit, offset: $offset) {
      id
      title
      description
      courseVersionId
      defaultVersion
      progress
      versions
      latestVersion
      labels {
        label,
        isPrivate
      }
    }
    getLastCourseAccess(accountId: $accountId) {
      id
      courseId
      courseVersionId
      lessonId
      courseTitle
      moduleTitle
      lessonTitle
      lastAccess
    }
  }
`

const Dashboard = () => {
  const { id: accountId } = useContext(AccountContext)

  const [result] = useQuery({
    query: HOME_QUERY,
    requestPolicy: 'network-only',
    variables: {
      accountId,
      limit: 20,
      offset: 0
    }
  })
  const { data, fetching } = result

  return (
    <div className='container px-2 lg:px-1 py-6 mx-auto'>
      <Head title='Dashboard' />
      {!fetching && data &&
        Object.keys(data).length > 0 &&
        Object.keys(fullCourses).includes(
          data?.getLastCourseAccess?.courseId
        ) && (
          <CardLastCourseAccess
            courseName={fullCourses[data.getLastCourseAccess?.courseId].title}
            {...data?.getLastCourseAccess}
          />
        )}
      <Title text='Destaques' />
      <CardTop3
        courseOne={Object.values(fullCourses)[0]}
        courseTwo={Object.values(fullCourses)[1]}
        courseThree={Object.values(fullCourses)[2]}
      />
      <Title
        text='Especialize-se!'
        subText='Cursos específicos e direto ao ponto'
      />
      <div className='py-4 grid lg:grid-cols-2 gap-4'>
        {Object.values(fullCourses)
          .filter((key, id) => id > 2 && id < 10 && key?.id)
          .map((each, i) => (
            <CardCourses key={i} {...each} />
          ))}
      </div>
      <div className='py-4 gap-4'>
        <Title text='Projetos' subText='Aumente sua experiência prática!' />
        {[13, 14, 15, 16].map((courseId) => (
          <Link
            key={courseId}
            href={`/app/courses/${Object.values(fullCourses)[courseId].id
              }/version/${Object.values(fullCourses)[courseId].version}`}
          >
            <a>
              <div className='container px-6 my-2 py-8 mx-auto bg-gray-100 hover:bg-gray-300 rounded-lg'>
                <div className='items-center lg:flex'>
                  <div className='lg:w-1/2 xl:w-2/3'>
                    <h2 className='text-3xl font-bold text-gray-600'>
                      {Object.values(fullCourses)[courseId].title}
                    </h2>

                    <p className='mt-4 text-gray-500'>
                      {Object.values(fullCourses)[courseId].description}
                    </p>
                  </div>

                  <div className='mt-8 lg:mt-0 lg:w-1/2 xl:w-1/3'>
                    <div className='flex items-center justify-center lg:justify-end'>
                      <div className='max-w-lg'>
                        <img
                          className='object-cover object-center w-full h-64 rounded-md shadow'
                          src={Object.values(fullCourses)[courseId].image}
                          alt='Projeto'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <Support />
      <Copyright />
    </div>
  )
}

export default Dashboard
