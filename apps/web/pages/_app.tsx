import React from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'urql'
import 'tailwindcss/tailwind.css'
import '../editorDraft.css'

import { Windmill } from '@learn49/aura-ui'

import { AccountProvider } from '@/context/AccountContext'
import { AuthProvider } from '@/context/AuthContext'
import { authClient } from '@/services/urqlClient'

import ToastElement from '@/elements/Toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import Head from 'next/head'

const nonAuthenticate = [
  '/',
  '/signup',
  '/forgot',
  '/reset-password/[...ids]',
  '/404',
  '/terms'
]

const MyApp: React.FC<AppProps> = ({ Component, pageProps, router }) => {
  const { account } = pageProps

  const StudentsAuthenticatedLayout = ({ children }) => (
    <AuthProvider role='user'>
      <Windmill>
        <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
          <div className='flex flex-col flex-1 w-full'>
            <Navbar />
            <main className='flex flex-col h-screen lg:overflow-y-auto'>
              <div className='flex-1'>{children}</div>
              <Footer />
            </main>
          </div>
        </div>
      </Windmill>
    </AuthProvider>
  )
  const DefaultLayout = ({ children }) => children

  let Layout = null
  if (nonAuthenticate.includes(router.pathname)) {
    Layout = DefaultLayout
  }
  if (router.pathname.startsWith('/app')) {
    Layout = StudentsAuthenticatedLayout
  }

  return (
    <>
      <Head>
        <link rel='icon' type='image/png' href='/icons/icon-96x96.png' />
      </Head>
      <Provider value={authClient}>
        <AccountProvider account={account}>
          <Layout>
            <ToastElement />
            <Component {...pageProps} />
          </Layout>
        </AccountProvider>
      </Provider>
    </>
  )
}

export default MyApp
