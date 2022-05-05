import React, { useContext, useEffect } from 'react'
import { Label, Input, Button, HelperText } from '@learn49/aura-ui'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from 'urql'
import { useRouter } from 'next/router'

import { AccountContext } from '@/context/AccountContext'
import Head from '@/elements/Head'

interface FormValues {
  email: string
  passwd: string
}

const AUTH_USER = `
  mutation($accountId: String!, $UserInput: UserInput!) {
    auth(accountId: $accountId, input: $UserInput) {
      user {
        id
        firstName
        lastName
        email
        profilePicture
        role
      }
      token
    }
  }
`

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Campo obrigatório'),
  passwd: Yup.string().required('Campo obrigatório')
})

const Login = () => {
  const { push } = useRouter()
  const { id, friendlyName } = useContext(AccountContext)
  const [, auth] = useMutation(AUTH_USER)

  useEffect(() => {
    const token = localStorage.getItem('learn49-token')
    if (token) {
      push('/app')
    }
  }, [])

  const onSubmit = async (values: FormValues) => {
    const input = { UserInput: { ...values }, accountId: id }
    try {
      const { data } = await auth(input)
      if (!data) {
        toast.error('Usuário e/ou senha inválidos.')
        return
      }
      localStorage.setItem('learn49-token', data.auth.token)
      localStorage.setItem('learn49-user', JSON.stringify(data.auth.user))
      push('/app')
    } catch (e) {
      toast.error('Erro ao tentar operação')
    }
  }

  const form = useFormik({
    initialValues: {
      email: '',
      passwd: ''
    },
    validationSchema,
    onSubmit
  })

  const handleCreateAccount = () => {
    push('/signup')
  }

  return (
    <>
      <Head title={[friendlyName, 'Login'].filter((x) => x).join(' - ')} />
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <div className='flex flex-col h-screen overflow-y-auto md:flex-row'>
          <div className='bg-initial flex bg-cover bg-center w-full md:w-1/2 h-64 md:h-auto'></div>
          <main className='flex justify-center items-center p-6 sm:px-8 md:w-1/2'>
            <div className='w-full max-w-lg'>
              <h1 className='mb-4 text-xl font-semibold text-gray-600 dark:text-gray-200 capitalize'>
                {friendlyName}
              </h1>
              <p className='text-gray-500 -mt-5 mb-3'>
                Faça seu login ou cadastre-se
              </p>
              <form onSubmit={form.handleSubmit}>
                <Label>
                  <span>Email</span>
                  <Input
                    css='mt-1 border border-opacity-50'
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

                <Label className='mt-4'>
                  <span>Senha</span>
                  <Input
                    css='mt-1 border border-opacity-50 border-gray-200'
                    type='password'
                    id='passwd'
                    valid={!form.errors.passwd}
                    placeholder='Digite sua senha'
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  {form.errors.passwd && (
                    <HelperText className='text-red-300'>
                      {form.errors.passwd}
                    </HelperText>
                  )}
                </Label>
                <Button
                  className='mt-4'
                  size='large'
                  block
                  type={'submit'}
                  disabled={form.isSubmitting}
                >
                  {form.isSubmitting ? 'Aguarde...' : 'Entrar'}
                </Button>
              </form>
              <Button
                className='mt-4'
                size='large'
                block
                layout='outline'
                onClick={handleCreateAccount}
              >
                Criar Conta
              </Button>
              <hr className='my-3' />
              <div className='flex justify-between'>
                <Link href='/forgot'>
                  <a className='text-sm text-gray-500 hover:text-gray-600 hover:underline cursor-pointer font-semibold'>
                    Esqueceu sua Senha?
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

export default Login
