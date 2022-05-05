import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <Image
      className='cursor-pointer'
      src='/devpleno.svg'
      width={130}
      height={24}
      alt='DevPleno'
    />
  )
}

export default Logo
