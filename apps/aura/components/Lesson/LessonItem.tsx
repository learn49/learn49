import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'

interface IContent {
  url: string
  title: string
  completed: boolean
  actually: boolean
}

const LessonItem = ({ url, title, completed, actually = false }: IContent) => {
  const defaultLink = 'px-2 py-3 text-sm border-b flex items-center gap-2'
  const linkStyles = classNames(
    defaultLink,
    actually
      ? 'bg-purple-600 hover:bg-purple-500 text-white'
      : 'bg-gray-100 hover:bg-gray-300 text-gray-700 border-gray-200'
  )

  const defineIcon = () => {
    if (actually) {
      return '/lesson/play.png'
    }
    if (completed) {
      return '/lesson/check-circle.svg'
    }
    return '/lesson/play-circle.svg'
  }

  const WrapperLink = ({ children }) =>
    actually ? (
      <div className={linkStyles}>{children}</div>
    ) : (
      <Link href={url}>
        <a className={linkStyles}>{children}</a>
      </Link>
    )

  return (
    <WrapperLink>
      <div className='w-5 mt-1'>
        <Image
          width={completed ? 18 : 20}
          height={completed ? 18 : 20}
          src={defineIcon()}
          alt='Status Icon'
          layout='fixed'
        />
      </div>
      <div>{title}</div>
    </WrapperLink>
  )
}

export default LessonItem
