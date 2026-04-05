import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientes } from '../services/clienteApi'

export default function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getClientes()
      .then(res => setClientes(res.data))
      .catch(() => setError('Error al cargar clientes'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-96"><p className="text-gray-500 animate-pulse">Cargando...</p></div>
  if (error) return <div className="flex items-center justify-center h-96"><p className="text-red-500">{error}</p></div>

  const totalActivos = clientes.filter(c => c.activo === 1).length
  const totalSucursales = [...new Set(clientes.map(c => c.sucursalNombre))].length

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a6b]">Panel de Clientes</h1>
          <p className="text-gray-500 text-sm mt-0.5">Módulo Cliente · Rol 51 · Canal Web + Sucursal</p>
        </div>
        <button onClick={() => navigate('/clientes/nuevo')}
          className="bg-[#1a3a6b] hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md text-sm">
          + Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a3a6b] text-white rounded-2xl p-6 shadow-md">
          <p className="text-blue-300 text-sm mb-1">Total Clientes</p>
          <p className="text-4xl font-bold">{clientes.length}</p>
          <p className="text-blue-300 text-xs mt-2">registrados en el sistema</p>
        </div>
        <div className="bg-green-600 text-white rounded-2xl p-6 shadow-md">
          <p className="text-green-200 text-sm mb-1">Clientes Activos</p>
          <p className="text-4xl font-bold">{totalActivos}</p>
          <p className="text-green-200 text-xs mt-2">con acceso habilitado</p>
        </div>
        <div className="bg-purple-700 text-white rounded-2xl p-6 shadow-md">
          <p className="text-purple-200 text-sm mb-1">Sucursales</p>
          <p className="text-4xl font-bold">{totalSucursales}</p>
          <p className="text-purple-200 text-xs mt-2">CDMX activas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1a3a6b]">Lista de Clientes</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{clientes.length} registros</span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3">Sucursal</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clientes.map(c => (
              <tr key={c.idCliente} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{c.idCliente}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{c.nombre} {c.apellidoPat} {c.apellidoMat}</td>
                <td className="px-6 py-4 text-gray-500">{c.email}</td>
                <td className="px-6 py-4 text-gray-500">{c.telefono}</td>
                <td className="px-6 py-4 text-gray-500">{c.sucursalNombre}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                    ${c.activo === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.activo === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => navigate(`/clientes/${c.idCliente}/cuentas`)}
                    className="text-[#1a3a6b] hover:underline text-xs font-semibold">
                    Ver cuentas →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientes.length === 0 && <p className="text-center text-gray-400 py-8">No hay clientes registrados</p>}
      </div>
    </div>
  )
}
