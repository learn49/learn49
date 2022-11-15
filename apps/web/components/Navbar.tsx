import React, { useState } from 'react'
import Link from 'next/link'
import { OutlineLogoutIcon, OutlineCogIcon, User } from '../icons'
import { Avatar, Dropdown, DropdownItem } from '@learn49/aura-ui'

import { useAuth } from '../context/AuthContext'
import Logo from '../elements/Logo'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  return (
    <header className='z-40 py-2 bg-white shadow-bottom'>
      <div className='container flex items-center justify-between h-full px-2 md:px-0 mx-auto text-purple-600 dark:text-purple-300'>
        <Link href='/app'>
          <a className='pt-2'>
            <Logo />
          </a>
        </Link>
        <ul className='flex items-center flex-shrink-0 space-x-6'>
          <li className='relative'>
            <button
              className='rounded-full focus:shadow-outline-purple focus:outline-none'
              onClick={handleProfileClick}
              aria-label='Account'
              aria-haspopup='true'
            >
              {user.profilePicture ? (
                <Avatar
                  className='align-middle w-8 h-8'
                  size='regular'
                  src={user.profilePicture}
                  alt={user.firstName}
                  aria-hidden='true'
                />
              ) : (
                <User
                  className='w-8 h-8 bg-purple-600 rounded-full text-white p-1'
                  aria-hidden='true'
                />
              )}
            </button>
            <Dropdown
              align='right'
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <Link href='/app/profile'>
                <DropdownItem tag='a' className='flex items-center'>
                  <OutlineCogIcon className='w-4 h-4 mr-3' aria-hidden='true' />
                  <span>Perfil</span>
                </DropdownItem>
              </Link>
              <DropdownItem onClick={signOut} className='flex items-center'>
                <OutlineLogoutIcon
                  className='w-4 h-4 mr-3'
                  aria-hidden='true'
                />
                <span>Deslogar</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Navbar
