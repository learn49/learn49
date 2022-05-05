import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react'
import jwtDecode from 'jwt-decode'
import { useRouter } from 'next/router'

export const AuthContext = createContext()

export const AuthProvider = ({ children, role }) => {
  const [data, setData] = useState({ token: '', user: {} })
  const { push } = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('learn49-token')
    const user = localStorage.getItem('learn49-user')
    if (!token) {
      window.location = '/'
    }
    const localTokenData = jwtDecode(token)
    if (localTokenData.role !== role) {
      signOut()
    }
    setData({
      token,
      user: JSON.parse(user)
    })
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem('learn49-token')
    localStorage.removeItem('learn49-user')
    push('/')
  }, [])

  const updateAuthUser = (user) => {
    localStorage.setItem(
      'learn49-user',
      JSON.stringify({ ...user, role: data.user.role })
    )
    setData({
      user: {
        ...user,
        role: data.user.role
      }
    })
  }

  return (
    <AuthContext.Provider value={{ user: data.user, updateAuthUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
