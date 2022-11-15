import React, { useEffect } from 'react'
import { Label, Input, Button, HelperText } from '@learn49/aura-ui'
import { toast } from 'react-toastify'
import { useMutation } from 'urql'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Title from '../../elements/Title'
import { useAccount } from '../../context/AccountContext'
import { useAuth } from '../../context/AuthContext'

const UPDATE_USER = `
  mutation($accountId: String!, $input: UpdateUserInput!) {
    updateUser(accountId: $accountId, input: $input) {
      id
      firstName
      lastName
      email
      profilePicture
    }
  }
`

interface FormValues {
  firstName: string
  lastName: string
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Campo obrigatório'),
  lastName: Yup.string().required('Campo obrigatório')
})

const FormProfile = () => {
  const { user, updateAuthUser } = useAuth()
  const { id: accountId } = useAccount()
  const [, updateUser] = useMutation(UPDATE_USER)

  const onSubmit = async (values: FormValues) => {
    const { data } = await updateUser({ accountId, input: { ...values } })
    if (!data) {
      toast.error('Ocorreu um erro ao atualizar.')
      return
    }
    toast.success('Dados alterados com sucesso.')
    updateAuthUser(data.updateUser)
  }

  const form = useFormik({
    initialValues: { firstName: '', lastName: '' },
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    form.setFieldValue('firstName', user.firstName)
    form.setFieldValue('lastName', user.lastName)
    form.setValues({ firstName: user.firstName, lastName: user.lastName })
  }, [user])

  return (
    <>
      <Title text='Meu Perfil' />
      <form className='mt-4' onSubmit={form.handleSubmit}>
        <div className='flex flex-col md:flex-row justify-between gap-4'>
          <Label className='w-full'>
            <span>Primeiro Nome</span>
            <Input
              //css='mt-1 border border-opacity-50'
              type='text'
              id='firstName'
              valid={!form.errors.firstName}
              placeholder='Primeiro Nome'
              defaultValue={user.firstName}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            {form.errors.firstName && (
              <HelperText className='text-red-300'>
                {form.errors.firstName}
              </HelperText>
            )}
          </Label>

          <Label className='w-full'>
            <span>Último Nome</span>
            <Input
              //css='mt-1 border border-opacity-50 border-gray-200'
              type='text'
              id='lastName'
              valid={!form.errors.lastName}
              placeholder='Último Nome'
              defaultValue={user.lastName}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            {form.errors.lastName && (
              <HelperText className='text-red-300'>
                {form.errors.lastName}
              </HelperText>
            )}
          </Label>
        </div>

        <div className='flex justify-between gap-4 mt-4'>
          <Label className='w-full'>
            <span>Seu Site</span>
            <Input
              //css='mt-1 border border-opacity-50'
              type='text'
              id='site'
              disabled
            />
          </Label>
        </div>

        <div className='flex flex-col md:flex-row justify-between gap-4 mt-4'>
          <Label className='md:w-1/2'>
            <span>Twitter</span>
            <div className='relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400'>
              <Input
                //css='mt-1 border border-opacity-50'
                type='text'
                id='twitter'
                disabled
              />
              <div className='absolute inset-y-0 left-0 flex items-center ml-3 pointer-events-none'>
                http://www.twitter.com/
              </div>
            </div>
          </Label>
          <Label className='md:w-1/2'>
            <span>Facebook</span>
            <div className='relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400'>
              <Input
                // css='mt-1 border border-opacity-50'
                type='text'
                id='facebook'
                disabled
              />
              <div className='absolute inset-y-0 left-0 flex items-center ml-3 pointer-events-none'>
                http://www.facebook.com/
              </div>
            </div>
          </Label>
        </div>

        <div className='flex flex-col md:flex-row justify-between gap-4 mt-4'>
          <Label className='md:w-1/2'>
            <span>Linkedin</span>
            <div className='relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400'>
              <Input
                // css='mt-1 border border-opacity-50'
                type='text'
                id='linkedin'
                disabled
              />
              <div className='absolute inset-y-0 left-0 flex items-center ml-3 pointer-events-none'>
                http://www.linkedin.com/
              </div>
            </div>
          </Label>
          <Label className='md:w-1/2'>
            <span>Youtube</span>
            <div className='relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400'>
              <Input
                // css='mt-1 border border-opacity-50'
                type='text'
                id='youtube'
                disabled
              />
              <div className='absolute inset-y-0 left-0 flex items-center ml-3 pointer-events-none'>
                http://www.youtube.com/
              </div>
            </div>
          </Label>
        </div>
        <div className='text-right mt-6'>
          <Button
            className='w-full md:w-1/3'
            type='submit'
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? 'Aguarde...' : 'Atualizar'}
          </Button>
        </div>
      </form>
    </>
  )
}
export default FormProfile
