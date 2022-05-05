import Title from '@/elements/Title'
import SuppCardOne from './CardOne'
import SuppCardTwo from './CardTwo'
// import SuppCardThree from './CardThree'

const Support = () => (
  <section className='py-4'>
    <Title text='Suporte' subText='Avance ainda mais rápido' />
    <div className='bg-gray-200 rounded-sm flex flex-col md:flex-row gap-4 py-2 px-2'>
      <SuppCardOne />
      <SuppCardTwo />
      {/* <div className='flex flex-col w-full justify-between gap-4'>
            <SuppCardTwo />
            <SuppCardThree />
          </div> */}
    </div>
  </section>
)

export default Support
