import React from 'react'

import Head from '@/elements/Head'
import AvatarProfile from '@/components/Profile/Avatar'
import CardProfile from '@/components/Profile/CardProfile'
import FormProfile from '@/components/Profile/FormProfile'
import FormSecurity from '@/components/Profile/FormSecurity'
import Copyright from '@/components/Copyright'

const Profile = () => {
  return (
    <>
      <Head title='Perfil' />
      <div className='container px-2 md:px-6 py-2 mx-auto'>
        <div className='container max-w-5xl mx-auto flex flex-col md:flex-row gap-2 bg-white rounded-lg mb-10'>
          <div className='md:w-1/6 flex flex-col items-center bg-gray-50 py-4'>
            <AvatarProfile />
            <div className='mt-4'>
              {/* <p className='text-xs font-thin'>Desde: 15/10/2021</p> */}
            </div>
          </div>
          <div className='w-full md:w-5/6 py-6 px-4'>
            <CardProfile />
            <FormProfile />
            <div className='py-8'>
              <FormSecurity />
            </div>
          </div>
        </div>
        <Copyright />
      </div>
    </>
  )
}

export default Profile
