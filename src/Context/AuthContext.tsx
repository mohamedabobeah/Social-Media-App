import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
  userLogin: string | null
  setuserLogin: Dispatch<SetStateAction<string | null>>
  userId: string
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [userLogin, setuserLogin] = useState<string | null>(() =>
    localStorage.getItem('userToken')
  )

  const userId = useMemo(() => {
    if (!userLogin) return ''
    try {
      const decoded = jwtDecode<{ user?: string }>(userLogin)
      return decoded.user ?? ''
    } catch {
      return ''
    }
  }, [userLogin])

  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin, userId }}>
      {children}
    </AuthContext.Provider>
  )
}
