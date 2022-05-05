import { useAuth } from '../../context/AuthContext'

const CardProfile = () => {
  const { user } = useAuth()

  return (
    <div className='mt-2 mb-6 py-4 px-2 bg-gray-200 rounded-lg'>
      <p className='font-semibold text-gray-600 dark:text-gray-300'>
        {[user.firstName, user.lastName].filter((x) => x).join(' ')}
      </p>
      <p className='text-gray-600 dark:text-gray-400'>{user.email}</p>
    </div>
  )
}

export default CardProfile
