import React, { useContext } from 'react'
import { Label, Input, Button, HelperText } from '@learn49/aura-ui'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from 'urql'

import { AccountContext } from '@/context/AccountContext'
import Head from '@/elements/Head'

interface FormValues {
  email: string
}

const FORGOT_PASSWORD = `
  mutation($accountId: String!, $ForgotPasswordInput: ForgotPasswordInput!) {
    forgotPassword(accountId: $accountId, input: $ForgotPasswordInput)
  }
`

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Campo obrigatório')
})

const Forgot = () => {
  const { id, friendlyName } = useContext(AccountContext)
  const [, forgotPassword] = useMutation(FORGOT_PASSWORD)

  const onSubmit = async ({ email }: FormValues) => {
    const input = {
      ForgotPasswordInput: { email },
      accountId: id
    }
    try {
      await forgotPassword(input)
      toast.success('Verifique seu Email')
    } catch (e) {
      toast.error('Erro ao tentar operação')
    }
  }

  const form = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit
  })

  return (
    <>
      <Head title='Esqueceu Sua Senha?' />
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <div className='flex flex-col h-screen overflow-y-auto md:flex-row'>
          <div className='bg-initial flex bg-cover bg-center w-full md:w-1/2 h-64 md:h-auto'></div>
          <main className='flex justify-center items-center p-6 sm:px-8 md:w-1/2'>
            <div className='w-full max-w-lg'>
              <h1 className='mb-4 text-xl font-semibold text-gray-600 dark:text-gray-200 capitalize'>
                {friendlyName}
              </h1>
              <p className='text-gray-500 -mt-5 mb-6'>Esqueci minha Senha</p>
              <form onSubmit={form.handleSubmit}>
                <Label className='mt-2'>
                  <span>Email</span>
                  <Input
                    css='mt-1 border border-opacity-50 border-gray-200'
                    type='email'
                    id='email'
                    valid={form.submitCount == 0 || !form.errors.email}
                    placeholder='Digite seu email'
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  {form.errors.email && (
                    <HelperText className='text-red-300'>
                      {form.errors.email}
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
                  {form.isSubmitting ? 'Aguarde...' : 'Recuperar Senha'}
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
