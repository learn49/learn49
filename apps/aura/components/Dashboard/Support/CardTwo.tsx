import { Card, CardBody } from '@learn49/aura-ui'
import Image from 'next/image'

const SuppCardTwo = () => (
  <Card className='flex flex-col lg:flex-row md:w-1/2'>
    <div
      className='flex items-center justify-center p-8'
      style={{
        backgroundColor: '#000024'
      }}
    >
      <Image
        alt='Suporte'
        src='/dashboard/officehours.png'
        objectFit='contain'
        layout='fixed'
        height={80}
        width={80}
      />
    </div>
    <CardBody>
      <p className='mb-4 text-2xl font-bold text-gray-600 dark:text-gray-300'>
        Office Hours
      </p>
      <p className='text-gray-600 dark:text-gray-400'>
        Surgiu alguma dúvida durante as aulas? Vamos conversar sobre isso e
        outros assuntos ao vivo?
      </p>
      <p className='text-gray-600 dark:text-gray-400 mt-2'>
        Este é um momento reservado para interações entre os alunos, troca de
        experiências, desafios, metas, melhorias no currículo e a consolidada{' '}
        <strong>estratégia 2TF</strong>.
      </p>
      <p className='text-gray-600 dark:text-gray-400 mt-2'>
        Vem participar conosco!
      </p>
    </CardBody>
  </Card>
)

export default SuppCardTwo
