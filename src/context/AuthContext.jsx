import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [empleado, setEmpleado] = useState(() => {
    try {
      const saved = localStorage.getItem('banquito_session')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (data) => {
    // Guarda todo el objeto incluyendo el token JWT
    localStorage.setItem('banquito_session', JSON.stringify(data))
    setEmpleado(data)
  }

  const logout = () => {
    localStorage.removeItem('banquito_session')
    setEmpleado(null)
  }

  return (
    <AuthContext.Provider value={{ empleado, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
