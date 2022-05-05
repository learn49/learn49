import React from 'react'

import { Refresh } from '../icons'

const Loading = () => (
  <div className='flex flex-row mx-auto justify-center mt-4 text-gray-400'>
    <svg className='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24'>
      <Refresh className='w-4 h-4' aria-hidden='true' />
    </svg>
    <h1>Aguarde...</h1>
  </div>
)

export default Loading
