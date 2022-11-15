import React, { useContext, useEffect, useState, useRef } from 'react'
import { Label, Input, Button, HelperText } from '@learn49/aura-ui'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from 'urql'
import ReCaptcha from 'react-google-recaptcha'

import { AccountContext } from '@/context/AccountContext'
import Head from '@/elements/Head'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  passwd: string
  acceptTerms: boolean
}

const CREATE_USER = `
  mutation ($accountId: String!, $SignUpUserInput: SignUpUserInput!) {
    signUpUser(accountId: $accountId, input: $SignUpUserInput) {
      id
      emails {
        email
        verified
      }
    }
  }
`

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Campo obrigatório'),
  lastName: Yup.string().required('Campo obrigatório'),
  email: Yup.string().email('Email inválido').required('Campo obrigatório'),
  passwd: Yup.string()
    .min(6, 'Mínimo de 6 caracteres')
    .required('Campo obrigatório'),
  acceptTerms: Yup.bool().oneOf([true], 'Deve-se aceitar os Termos & Condições')
})

const SignUp = () => {
  const [confirmEmail, setConfirmEmail] = useState(false)
  const { id, friendlyName, recaptchaSiteKey } = useContext(AccountContext)
  const [, create] = useMutation(CREATE_USER)
  const captchaRef = useRef(null)
  const [siteKey, setSiteKey] = useState('')

  const production = process.env.NEXT_PUBLIC_RECAPTCHA !== '--bypass--'

  useEffect(() => {
    if (recaptchaSiteKey) {
      setSiteKey(recaptchaSiteKey)
    } else {
      if (production) {
        setSiteKey(process.env.NEXT_PUBLIC_RECAPTCHA)
      }
    }
  }, [recaptchaSiteKey, production])

  const onSubmit = async (values: FormValues) => {
    const input = {
      SignUpUserInput: {
        ...values,
        recaptcha: production ? captchaRef.current.getValue() : ''
      },
      accountId: id
    }
    try {
      production && (await captchaRef.current.execute())
      const { data } = await create(input)
      if (!data) {
        toast.error('Erro ao criar conta.')
        return
      }
      setConfirmEmail(true)
    } catch (e) {
      toast.error('Erro ao tentar operação')
    }
  }

  const form = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      passwd: '',
      acceptTerms: false
    },
    validationSchema,
    onSubmit
  })

  return (
    <>
      <Head title={`${friendlyName} - Login`} />
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <div className='flex flex-col h-screen overflow-y-auto md:flex-row'>
          <div className='bg-initial flex bg-cover bg-center w-full md:w-1/2 h-64 md:h-auto'></div>
          <main className='flex justify-center items-center p-6 sm:px-8 md:w-1/2'>
            <div className='w-full max-w-lg'>
              <h1 className='mb-4 text-xl font-semibold text-gray-600 dark:text-gray-200 capitalize'>
                {friendlyName}
              </h1>
              {confirmEmail && (
                <div className='py-20 lg:py-44'>
                  <p className='text-lg font-extrabold text-gray-500'>
                    Confirme sua conta
                  </p>
                  <p className='text-md font-light text-gray-500'>
                    Verifique seu email para confirmar sua conta.
                  </p>
                </div>
              )}
              {!confirmEmail && (
                <>
                  <p className='text-gray-500 -mt-5 mb-3'>
                    É bom ter você aqui! Crie uma conta!
                  </p>
                  <form onSubmit={form.handleSubmit}>
                    <Label>
                      <span>Nome</span>
                      <Input
                        css='mt-1 border border-opacity-50'
                        type='text'
                        id='firstName'
                        valid={!form.errors.firstName}
                        placeholder='Nome'
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                      {form.errors.firstName && (
                        <HelperText className='text-red-300'>
                          {form.errors.firstName}
                        </HelperText>
                      )}
                    </Label>
                    <Label className='mt-2'>
                      <span>Último Nome</span>
                      <Input
                        css='mt-1 border border-opacity-50 border-gray-200'
                        type='text'
                        id='lastName'
                        valid={!form.errors.lastName}
                        placeholder='Nome'
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                      {form.errors.lastName && (
                        <HelperText className='text-red-300'>
                          {form.errors.lastName}
                        </HelperText>
                      )}
                    </Label>
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
                    <Label className='mt-2'>
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
                    <Label check className='mt-2'>
                      <Input
                        css=''
                        type='checkbox'
                        name='acceptTerms'
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                      <span className='ml-2'>
                        Criar uma conta significa que você concorda com nossos{' '}
                        <Link href='/accept-terms' passHref>
                          <a className='text-gray-800 font-medium hover:underline hover:text-gray-600'>
                            Termos de Serviço,
                          </a>
                        </Link>{' '}
                        <Link href='/policies' passHref>
                          <a className='text-gray-800 font-medium hover:underline hover:text-gray-600'>
                            Política de Privacidade
                          </a>
                        </Link>{' '}
                        e nossas{' '}
                        <Link href='/policies' passHref>
                          <a className='text-gray-800 font-medium hover:underline hover:text-gray-600'>
                            Configurações de Notificações.
                          </a>
                        </Link>
                      </span>
                    </Label>
                    {form.errors.acceptTerms && (
                      <HelperText className='text-red-300'>
                        {form.errors.acceptTerms}
                      </HelperText>
                    )}

                    <Button
                      className='mt-4'
                      block
                      size='large'
                      type={'submit'}
                      disabled={form.isSubmitting}
                    >
                      {form.isSubmitting ? 'Aguarde...' : 'Cadastrar'}
                    </Button>
                  </form>
                </>
              )}
              <hr className='my-3' />
              <div className='flex justify-between'>
                <Link href='/'>
                  <a className='text-sm text-gray-500 hover:text-gray-600 hover:underline cursor-pointer font-semibold'>
                    Fazer Login
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
              {siteKey && (
                <ReCaptcha
                  ref={captchaRef}
                  size='invisible'
                  sitekey={siteKey}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default SignUp
