import React from 'react'
import { Label, Input, Button, HelperText } from '@learn49/aura-ui'
import { toast } from 'react-toastify'
import { useMutation } from 'urql'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Title from '../../elements/Title'
import { useAccount } from '../../context/AccountContext'

const UPDATE_PASSWORD = `
  mutation($accountId: String!, $input: UpdateUserPasswdInput!) {
    updatePassword(accountId: $accountId, input: $input) {
      id
    }
  }
`

interface FormValues {
  currentPasswd: string
  newPasswd: string
  confirm: string
}

const validationSchema = Yup.object().shape({
  currentPasswd: Yup.string().required('Campo obrigatório'),
  newPasswd: Yup.string().required('Campo obrigatório'),
  confirm: Yup.mixed().test('match', 'Senhas não idênticas', function () {
    return this.parent.newPasswd === this.parent.confirm
  })
})

const FormSecurity = () => {
  const { id: accountId } = useAccount()
  const [, updatePassword] = useMutation(UPDATE_PASSWORD)

  const onSubmit = async (values: FormValues) => {
    const { data } = await updatePassword({
      accountId,
      input: {
        ...values
      }
    })
    if (!data) {
      toast.error('Ocorreu um erro ao atualizar.')
      return
    }
    toast.success('Senha alterada com sucesso.')
  }

  const form = useFormik({
    initialValues: {
      currentPasswd: '',
      newPasswd: '',
      confirm: ''
    },
    validationSchema,
    onSubmit
  })

  return (
    <>
      <Title text='Segurança' />
      <form onSubmit={form.handleSubmit}>
        <div className='flex flex-col md:flex-row justify-between gap-4 mt-4'>
          <Label className='w-full'>
            <span>Senha Atual</span>
            <Input
              // css='mt-1 border border-opacity-50'
              type='password'
              id='currentPasswd'
              valid={!form.errors.currentPasswd}
              placeholder='Senha Atual'
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            {form.errors.currentPasswd && (
              <HelperText className='text-red-300'>
                {form.errors.currentPasswd}
              </HelperText>
            )}
          </Label>

          <Label className='w-full'>
            <span>Nova Senha</span>
            <Input
              css='mt-1 border border-opacity-50 border-gray-200'
              type='password'
              id='newPasswd'
              valid={!form.errors.newPasswd}
              placeholder='Nova Senha'
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            {form.errors.newPasswd && (
              <HelperText className='text-red-300'>
                {form.errors.newPasswd}
              </HelperText>
            )}
          </Label>
          <Label className='w-full'>
            <span>Confirme a Nova Senha</span>
            <Input
              css='mt-1 border border-opacity-50'
              type='password'
              id='confirm'
              valid={!form.errors.confirm}
              placeholder='Confirme a Nova Senha'
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            {form.errors.confirm && (
              <HelperText className='text-red-300'>
                {form.errors.confirm}
              </HelperText>
            )}
          </Label>
        </div>

        <div className='text-right mt-6'>
          <Button
            className='w-full md:w-1/3'
            type='submit'
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? 'Aguarde...' : 'Alterar Senha'}
          </Button>
        </div>
      </form>
    </>
  )
}
export default FormSecurity
