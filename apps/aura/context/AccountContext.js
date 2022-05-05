import React, { createContext, useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'urql'

import Waiting from '../components/Waiting'
import Head from '../elements/Head'

export const AccountContext = createContext()

const GET_ACCOUNT_BY_DOMAIN = `
  query getAccountSettingsByDomain($domain: String!) {
    account: getAccountSettingsByDomain(domain: $domain) {
      id
      subdomain
      friendlyName
      description
      recaptchaSiteKey
    }
  }
`

export const AccountProvider = ({ children, account = {} }) => {
  const [currentAccount, setAccount] = useState(account)
  const [subDomain, setSubDomain] = useState()

  const [getAccount] = useQuery({
    query: GET_ACCOUNT_BY_DOMAIN,
    variables: {
      domain: subDomain
    },
    pause: !subDomain
  })
  const { data, error } = getAccount

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSubDomain(process.env.NEXT_PUBLIC_ACCOUNT || window.location.hostname)
    }
  }, [])

  useEffect(() => {
    if (data && data.account) {
      setAccount(data.account)
    }
  }, [data])

  if (!data && !error) {
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
    <AccountContext.Provider value={{ ...currentAccount, setAccount }}>
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
