import React, { useCallback } from 'react'
import { Avatar } from '@learn49/aura-ui'
import { useMutation } from 'urql'
import { toast } from 'react-toastify'
import Dropzone from 'react-dropzone'

import { EditIcon, OutlinePersonIcon } from '../../icons'
import { useAccount } from '../../context/AccountContext'
import { useAuth } from '../../context/AuthContext'

const UPLOAD_PROFILE_PICTURE = `
  mutation($file: Upload!, $accountId: String!) {
    uploadProfilePicture(accountId: $accountId, file: $file) {
      id
      firstName
      lastName
      email
      profilePicture
    }
  }
`

const AvatarProfile = () => {
  const { user, updateAuthUser } = useAuth()
  const { id: accountId } = useAccount()
  const [, uploadProfilePicture] = useMutation(UPLOAD_PROFILE_PICTURE)

  const handleAvatarChange = useCallback(async (acceptedFiles) => {
    if (acceptedFiles) {
      const { data } = await uploadProfilePicture({
        accountId,
        file: acceptedFiles[0]
      })
      if (!data) {
        toast.error('Ocorreu um erro ao atualizar.')
        return
      }
      updateAuthUser(data.uploadProfilePicture)
    }
  }, [])

  return (
    <Dropzone onDrop={handleAvatarChange}>
      {({ getRootProps, getInputProps }) => (
        <section className='relative cursor-pointer'>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {user.profilePicture && (
              <Avatar
                size='large'
                className='object-cover w-20 h-20 bg-gray-500 hover:bg-gray-600'
                src={user.profilePicture}
                alt={user.firstName}
              />
            )}
            {!user.profilePicture && (
              <OutlinePersonIcon
                className='w-20 h-20 bg-purple-600 hover:bg-purple-700 rounded-full text-white p-4'
                aria-hidden='true'
              />
            )}
            <div className='absolute top-0 -right-1'>
              <EditIcon
                className='w-7 h-7 bg-purple-600 hover:bg-purple-700 rounded-full text-white p-0.5 border-white border-double border-2'
                aria-hidden='true'
              />
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  )
}
export default AvatarProfile
