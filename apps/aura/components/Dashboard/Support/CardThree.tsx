import { Card, CardBody } from '@learn49/aura-ui'
import Image from 'next/image'

const SuppCardThree = () => (
  <Card className='flex flex-col'>
    <Image
      className='object-cover'
      alt='Suporte'
      src='/login.png'
      height={200}
      width={600}
    />
    <CardBody>
      <p className='mb-4 text-2xl font-bold text-gray-600 dark:text-gray-300'>
        Inglês pra Dev
      </p>
      <p className='text-gray-600 dark:text-gray-400'>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga, cum
        commodi a omnis numquam quod? Totam exercitationem quos hic ipsam at qui
        cum numquam, sed amet ratione! Ratione, nihil dolorum.
      </p>
    </CardBody>
  </Card>
)

export default SuppCardThree
