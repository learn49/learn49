import React, { useContext } from 'react'
import Image from 'next/image'
import { useQuery } from 'urql'

import { AccountContext } from '@/context/AccountContext'

import Head from '@/elements/Head'
import Title from '@/elements/Title'
import Copyright from '@/components/Copyright'
import { handleTimeDifference } from '../../utils/handleTimeDifference'

export const GET_TICKETS = `
  query getTickets(
    $accountId: String!
    $myTickets: Boolean
    $limit: Float!
    $offset: Float!
  ) {
    getDiscussions(
      accountId: $accountId
      myTickets: $myTickets
      limit: $limit
      offset: $offset
    ) {
      discussions {
        id
        title
        isClosed
        user {
          id
          profilePicture
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`

const Support = () => {
  const { id: accountId } = useContext(AccountContext)

  const [result] = useQuery({
    query: GET_TICKETS,
    requestPolicy: 'network-only',
    variables: {
      accountId,
      myTickets: true,
      limit: 20,
      offset: 0
    }
  })
  const { data } = result

  return (
    <>
      <Head title='Suporte' />
      <div className='container px-2 md:px-6 py-2 mx-auto'>
        <Title text='Meus Tickets' className='mb-4' />
        <div className='container max-w-5xl mx-auto flex flex-col md:flex-row gap-2 bg-white rounded-lg mb-10'>
          {data?.getDiscussions.discussions.length === 0 && (
            <div className='max-w-2xl px-8 py-4 mx-auto'>
              <Image
                src='/support/sem-tickets.svg'
                width={400}
                height={400}
                alt='No Tickets Created'
              />
              <div className='mt-2'>
                <div className='text-2xl font-bold text-gray-600 text-center'>
                  Não há nenhum ticket
                </div>
                <p className='mt-2 text-gray-600 text-center'>
                  Abra um novo ticket no botão "novo ticket".
                </p>
              </div>
            </div>
          )}
          {data?.getDiscussions.discussions.length > 0 &&
            data?.getDiscussions.discussions.map((e) => (
              <div
                key={e.id}
                className='flex bg-gray-200 text-gray-600 hover:bg-purple-200 w-full rounded-lg shadow-md py-4 px-2 cursor-pointer'
              >
                <div className='w-4/5'>
                  <p className='text-xl font-medium'>{e.title}</p>
                  <p className='text-xs'>{`Há ${handleTimeDifference(
                    new Date(),
                    e.createdAt
                  )}`}</p>
                </div>
                <div className='w-1/5'>
                  <div className='bg-purple-600 px-1 py-2 text-center self-center text-white font-semibold rounded-lg'>
                    {e.isClosed ? 'Fechado' : 'Aberto'}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <Copyright />
      </div>
    </>
  )
}

export default Support
