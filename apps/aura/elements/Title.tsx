import React from 'react'
import classNames from 'classnames'

interface Props {
  text: string
  subText?: string
  className?: string
}

const Title = ({ text, subText, className }: Props) => {
  const Styles = classNames(className)

  return (
    <div className={Styles}>
      <h1 className='text-2xl font-semibold text-gray-600'>{text}</h1>
      {subText && <p className='text-gray-500'>{subText}</p>}
    </div>
  )
}

export default Title
