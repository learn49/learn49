import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='flex flex-col justify-between items-center px-6 py-2 bg-gray-300 dark:bg-gray-800 sm:flex-row'>
      <p className='py-2 text-gray-500 sm:py-0 uppercase font-light text-sm'>
        Copyright ©{' '}
        {/* <a
          href='https://aluno.tv/'
          target='_blank'
          rel='noreferrer'
          className='cursor-pointer hover:bg-gray-500 hover:text-white p-1 rounded'
        >
          Learn49
        </a>{' '} */}
        {/* <a
          onClick={showTerms}
          className='ml-4 cursor-pointer hover:bg-gray-500 hover:text-white p-1 rounded'
        >
          Termos de Uso
        </a> */}
      </p>
      <div className='flex -mx-2 text-white mr-4 font-bold'>
        <a href='https://devpleno.com' className='text-gray-200 text-right'>
          <Image src='/devpleno.svg' alt='Logo' height={15} width={80} />
        </a>
      </div>
    </footer>
  )
}

export default Footer
