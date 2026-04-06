// ClientesPage.jsx — Banquito
// Lista de clientes con acceso rápido al detalle (productos + movimientos).
// Actor: Ejecutivo de Sucursal (tblempleado) gestiona tblcliente
// Trazabilidad: RF-CLI-01, RF-CLI-02, RF-CLI-03

import { useState, useEffect } from 'react'
import { useNavigate }          from 'react-router-dom'
import { getClientes }          from '../../features/ejecutivo/services/clienteApi'
import { RfBadge }              from '../../components/RfBadge'

export default function ClientesPage() {
  const navigate = useNavigate()
  const [clientes,  setClientes]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [busqueda,  setBusqueda]  = useState('')

  useEffect(() => {
    getClientes()
      .then(res => setClientes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtrados = clientes.filter((c) => {
    const q = busqueda.toLowerCase()
    return (
      `${c.nombre} ${c.apellidoPat} ${c.apellidoMat}`.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.rfc   || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1a3a6b]">Clientes</h1>
          {/* Actor: Ejecutivo de Sucursal (tblempleado) · objeto: tblcliente */}
          <p className="text-xs text-gray-500 mt-0.5">
            {clientes.length} clientes · <RfBadge code="RF-CLI-01" />
          </p>
        </div>
        <button
          onClick={() => navigate('/clientes/nuevo')}
          className="px-4 py-2 bg-[#1a3a6b] hover:bg-blue-900 text-white text-sm font-medium rounded-lg transition-colors">
          + Registrar cliente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, email o RFC…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
      />

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400 gap-3">
          <span className="animate-pulse">Cargando clientes…</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Cliente', 'Email', 'Teléfono', 'Sucursal', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr
                  key={c.idCliente}
                  className="border-t border-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/clientes/${c.idCliente}`)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a3a6b] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {(c.nombre?.[0] || '') + (c.apellidoPat?.[0] || '')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {c.nombre} {c.apellidoPat} {c.apellidoMat}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono">idcliente: {c.idCliente}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{c.email}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{c.telefono}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{c.sucursalNombre || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      c.activo === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {c.activo === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/clientes/${c.idCliente}`)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1a3a6b] hover:bg-blue-100 text-xs font-medium transition-colors border border-blue-100">
                      📦 Expediente →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrados.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No se encontraron clientes.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
