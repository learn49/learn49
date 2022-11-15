import React, { useContext } from 'react'
import { Label, Input, Button, HelperText } from '@learn49/aura-ui'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from 'urql'

import { AccountContext } from '@/context/AccountContext'
import Head from '@/elements/Head'
import Logo from '@/elements/Logo'

interface FormValues {
  passwd: string
  confirmPasswd: string
}

const RESET_PASSWORD = `
  mutation($accountId: String!, $ResetPasswordInput: ResetPasswordInput!) {
    resetPassword(accountId: $accountId, input: $ResetPasswordInput) {
      id
    }
  }
`

const validationSchema = Yup.object().shape({
  passwd: Yup.string().required('Campo obrigatório'),
  confirmPasswd: Yup.string()
    .required('Campo obrigatório')
    .oneOf([Yup.ref('passwd'), null], 'Confirmação de senha incorreta')
})

const errorMessages = {
  '[GraphQL] Invalid token': 'Token Inválido',
  '[GraphQL] Token has already been used': 'Token já utilizado',
  '[GraphQL] Token has already expired': 'Token expirado'
}

const Forgot = () => {
  const { query } = useRouter()
  const { id, friendlyName } = useContext(AccountContext)
  const [, resetPassword] = useMutation(RESET_PASSWORD)

  const onSubmit = async (values: FormValues) => {
    const input = {
      accountId: id,
      ResetPasswordInput: {
        tokenId: query.ids[0],
        plainToken: query.ids[1],
        ...values
      }
    }
    try {
      const { data, error } = await resetPassword(input)
      if (data) {
        toast.success('Senha alterada com sucesso')
        return
      }
      toast.error(errorMessages[error.message])
    } catch (e) {
      toast.error('Erro ao tentar operação')
    }
  }

  const form = useFormik({
    initialValues: {
      passwd: '',
      confirmPasswd: ''
    },
    validationSchema,
    onSubmit
  })

  return (
    <>
      <Head title='Recuperação de Senha' />
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <Logo />
        <div className='flex flex-col h-screen overflow-y-auto md:flex-row'>
          <div className='bg-initial flex bg-cover bg-center w-full md:w-1/2 h-64 md:h-auto'></div>
          <main className='flex justify-center items-center p-6 sm:px-8 md:w-1/2'>
            <div className='w-full max-w-lg'>
              <h1 className='mb-4 text-xl font-semibold text-gray-600 dark:text-gray-200 capitalize'>
                {friendlyName}
              </h1>
              <p className='text-gray-500 -mt-5 mb-6'>Alteração de Senha</p>
              <form onSubmit={form.handleSubmit}>
                <Label className='mt-2'>
                  <span>Nova Senha</span>
                  <Input
                    css='mt-1 border border-opacity-50 border-gray-200'
                    type='password'
                    id='passwd'
                    valid={form.submitCount == 0 || !form.errors.passwd}
                    placeholder='Nova Senha'
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  {form.errors.passwd && (
                    <HelperText className='text-red-300'>
                      {form.errors.passwd}
                    </HelperText>
                  )}
                </Label>
                <Label className='mt-2'>
                  <span>Confirme a Senha</span>
                  <Input
                    css='mt-1 border border-opacity-50 border-gray-200'
                    type='password'
                    id='confirmPasswd'
                    valid={form.submitCount == 0 || !form.errors.confirmPasswd}
                    placeholder='Confirme a Senha'
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  {form.errors.confirmPasswd && (
                    <HelperText className='text-red-300'>
                      {form.errors.confirmPasswd}
                    </HelperText>
                  )}
                </Label>
                <Button
                  className='mt-4 mb-14'
                  size='large'
                  block
                  type={'submit'}
                  disabled={form.isSubmitting}
                >
                  {form.isSubmitting ? 'Aguarde...' : 'Redefinir Senha'}
                </Button>
              </form>
              <hr className='my-3' />
              <div className='flex justify-between'>
                <Link href='/'>
                  <a className='text-sm text-gray-500 hover:text-gray-600 hover:underline cursor-pointer font-semibold'>
                    Voltar ao Login
                  </a>
                </Link>
                <div className='text-right'>
                  <Image
                    src='/devpleno.svg'
                    alt='Logo'
                    height={25}
                    width={81}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Forgot
