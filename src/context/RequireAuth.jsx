import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RequireAuth({ children, roles }) {
  const { empleado } = useAuth()
  const location = useLocation()

  if (!empleado) return <Navigate to="/login" state={{ from: location }} replace />

  if (roles && !roles.includes(empleado.rol)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-sm">
          <p className="text-5xl mb-4">🚫</p>
          <p className="text-xl font-bold text-gray-800">Acceso denegado</p>
          <p className="text-gray-400 text-sm mt-2">
            No tienes permisos para ver esta sección.
          </p>
        </div>
      </div>
    )
  }

  return children
}
