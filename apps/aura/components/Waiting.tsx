import React from 'react'
import Loading from './Loading'
import Head from '../elements/Head'

const Waiting = () => (
  <>
    <Head title='Aguarde' />
    <div className='flex h-screen bg-gray-100 items-center'>
      <Loading />
    </div>
  </>
)

export default Waiting
