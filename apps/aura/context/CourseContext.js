import React, { createContext, useState, useEffect, useContext } from 'react'
import { useMutation, useQuery } from 'urql'
import { useRouter } from 'next/router'

import Head from '@/elements/Head'
import { AccountContext } from '@/context/AccountContext'

const GET_COURSE = `
  query getCourse(
    $accountId: String!
    $courseId: String!
  ) {
    getCourse(accountId: $accountId, courseId: $courseId) {
      id
      title
      description
      progress
    }
  }
`

const GET_COURSE_MODULES = `
  query getCourseModules(
    $accountId: String!
    $courseVersionId: String!
    $limit: Int
    $offset: Int
  ) {
    getCourseModules(
      accountId: $accountId
      courseVersionId: $courseVersionId
      limit: $limit
      offset: $offset
    ) {
      id
      title
      isActive
      baseId
      sortOrder
      lessons {
        id
        title
        releaseOnDate
        releaseAfter
        completed
      }
    }
  }
`

const GET_COURSE_LESSON_BY_ENROLLMENT = `
  query getCourseLessonByEnrollment(
    $accountId: String!
    $courseId: String!
    $courseVersionId: String!
    $lessonId: String!
  ) {
    getCourseLessonByEnrollment(
      accountId: $accountId
      courseId: $courseId
      courseVersionId: $courseVersionId
      lessonId: $lessonId
    ) {
      id
      title
      sortOrder
      blocks
      baseLessonId
      moduleId
      nextLesson
      releaseOnDate
      completed
    }
  }
`

const MARK_LESSON_AS_SEEN = `
  mutation markLessonAsSeen(
    $accountId: String!
    $courseId: String!
    $lessonId: String!
    $isCompleted: Boolean!
  ) {
    markLessonAsSeen(
      accountId: $accountId
      courseId: $courseId
      lessonId: $lessonId
      isCompleted: $isCompleted
    ){
      id
      completed
    }
  }
`

const CREATE_OR_UPDATE_LAST_COURSE_LESSON_ACCESS = `
  mutation createOrUpdateLastCourseLessonAccess(
    $accountId: String!
    $courseId: String!
    $courseVersionId: String!
    $lessonId: String!
  ) {
    createOrUpdateLastCourseLessonAccess(
      accountId: $accountId
      courseId: $courseId
      courseVersionId: $courseVersionId
      lessonId: $lessonId
    ) {
      id
    }
  }
`

export const CourseContext = createContext()

export const CourseProvider = ({ children }) => {
  const router = useRouter()
  const { id: accountId } = useContext(AccountContext)
  const { courseId, courseVersionId, lessonId } = router.query
  const [lessons, setLessons] = useState({})
  const [, markLesson] = useMutation(MARK_LESSON_AS_SEEN)
  const [, updateLastLessonAccess] = useMutation(
    CREATE_OR_UPDATE_LAST_COURSE_LESSON_ACCESS
  )

  const [courseData] = useQuery({
    query: GET_COURSE,
    requestPolicy: 'cache-and-network',
    variables: { accountId, courseId }
  })
  const { data: course } = courseData

  const [modulesData] = useQuery({
    query: GET_COURSE_MODULES,
    requestPolicy: 'cache-and-network',
    variables: {
      accountId,
      courseVersionId,
      limit: 50,
      offset: 0
    }
  })
  const { data: modules } = modulesData

  const [lessonsData] = useQuery({
    query: GET_COURSE_LESSON_BY_ENROLLMENT,
    requestPolicy: 'cache-and-network',
    variables: {
      accountId,
      courseId,
      courseVersionId,
      lessonId
    }
  })
  const { data: currentLesson } = lessonsData

  useEffect(() => {
    setLessons(currentLesson)
  }, [currentLesson])

  const handleMarkLesson = (completed) => async () => {
    const { getCourseLessonByEnrollment } = currentLesson
    setLessons({
      ...currentLesson,
      getCourseLessonByEnrollment: {
        ...getCourseLessonByEnrollment,
        completed
      }
    })

    await markLesson({
      accountId,
      courseId,
      lessonId,
      isCompleted: completed
    })
  }

  const handleUpdateLastLessonAccess = async () => {
    await updateLastLessonAccess({
      accountId,
      courseId,
      courseVersionId,
      lessonId
    })
  }

  const parsedBody =
    lessons?.getCourseLessonByEnrollment?.blocks &&
    JSON.parse(lessons?.getCourseLessonByEnrollment?.blocks)

  return (
    <CourseContext.Provider
      value={{
        ...course,
        ...modules,
        ...lessons,
        parsedBody,
        handleMarkLesson,
        handleUpdateLastLessonAccess
      }}
    >
      <Head title={course?.getCourse.title || 'Aguarde'} />
      {children}
    </CourseContext.Provider>
  )
}

export const useCourseData = () => useContext(CourseContext)
