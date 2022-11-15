import React, { createContext, useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'urql'

import Waiting from '../components/Waiting'
import Head from '../elements/Head'

import {
  GetAccountByDomain,
  GetAccountByDomainData,
  GetAccountByDomainVariables
} from '@learn49/aura-data'

interface Account {
  id?: string
  friendlyName?: string
  subdomain?: string
}

export const AccountContext = createContext<Account>(null)

export const AccountProvider = ({ children, account = {} }) => {
  const [currentAccount, setAccount] = useState(account)
  const [subDomain, setSubDomain] = useState()

  const [getAccount] = useQuery<
    GetAccountByDomainData,
    GetAccountByDomainVariables
  >({
    query: GetAccountByDomain,
    variables: {
      domain: subDomain
    },
    pause: !subDomain || !!account
  })

  const { data, error } = getAccount

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      setSubDomain(process.env.NEXT_PUBLIC_ACCOUNT || window.location.hostname)
    }
  }, [])

  useEffect(() => {
    if (data && data.account) {
      setAccount(data.account)
    }
  }, [data])

  if (!data && !error && !account) {
    return <Waiting />
  }

  if (!Object.keys(currentAccount).length) {
    return (
      <>
        <Head title='Account Not Found' />
        <div className='text-center mt-10'>
          <h1>Conta não encontrada!</h1>
          <p>Em caso de dúvidas, entre em contato por: contato@id49.com</p>
        </div>
      </>
    )
  }

  return (
    <AccountContext.Provider value={currentAccount}>
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => {
  return useContext(AccountContext)
}

AccountProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]).isRequired
}
