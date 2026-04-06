// DetalleClientePage.jsx — Banquito
// Trazabilidad: RF-CLI-01, RF-CLI-02, RF-CLI-03, RF-CLI-08 · CU-CLI-01
// Paleta: #1a3a6b, blanco, grises claros — consistente con el proyecto

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getClienteById as buscarClientePorId } from '../../features/ejecutivo/services/clienteApi'
import ProductosCliente  from './components/ProductosCliente'
import MovimientosCuenta from './components/MovimientosCuenta'
import { RfBadge, TrazabilidadBar } from '../../components/RfBadge'

const TABS = [
  { id: 'productos',    label: 'Productos',    icon: '📦', desc: 'Cuentas activas, finalizadas y solicitudes', rfs: ['RF-CLI-01', 'RF-CLI-03'] },
  { id: 'movimientos',  label: 'Movimientos',  icon: '📊', desc: 'Historial de operaciones financieras',       rfs: ['RF-CLI-02', 'RF-CLI-08'] },
]

function HeaderCliente({ cliente }) {
  if (!cliente) return null
  const iniciales = `${cliente.nombre?.[0] || ''}${cliente.apellidoPat?.[0] || ''}`.toUpperCase()
  return (
    <div className="flex flex-wrap items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-[#1a3a6b] flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
        {iniciales}
      </div>
      {/* Datos */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-[#1a3a6b] truncate">
            {cliente.nombre} {cliente.apellidoPat} {cliente.apellidoMat}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            cliente.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {cliente.activo ? '● Activo' : '● Inactivo'}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>✉ {cliente.email}</span>
          <span>📱 {cliente.telefono}</span>
          {cliente.sucursalNombre && <span>🏦 {cliente.sucursalNombre}</span>}
        </div>
      </div>
      {/* IDs */}
      <div className="text-right text-xs text-gray-400 space-y-0.5 flex-shrink-0">
        <p>ID: <span className="font-mono text-gray-700">{cliente.idCliente}</span></p>
        <p>RFC: <span className="font-mono text-gray-700">{cliente.rfc || '—'}</span></p>
        <p>CURP: <span className="font-mono text-gray-700">{cliente.curp || '—'}</span></p>
      </div>
    </div>
  )
}

export default function DetalleClientePage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [cliente,    setCliente]   = useState(null)
  const [loading,    setLoading]   = useState(true)
  const [error,      setError]     = useState(null)
  const [tabActivo,  setTabActivo] = useState('productos')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    buscarClientePorId(id)
      .then(res => setCliente(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 gap-3 text-sm">
      <span className="animate-spin text-2xl">⏳</span> Cargando expediente…
    </div>
  )
  if (error) return (
    <div className="m-8 rounded-xl bg-red-50 border border-red-200 p-5 text-red-600">
      <p className="font-semibold mb-1">Error al cargar el cliente</p>
      <p className="text-sm">{error}</p>
      <button onClick={() => navigate(-1)} className="mt-3 text-xs underline text-red-500">← Volver</button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <button onClick={() => navigate('/')} className="hover:text-[#1a3a6b] transition-colors">Dashboard</button>
        <span>/</span>
        <button onClick={() => navigate(-1)} className="hover:text-[#1a3a6b] transition-colors">Clientes</button>
        <span>/</span>
        <span className="text-gray-700 font-medium">{cliente?.nombre} {cliente?.apellidoPat}</span>
      </nav>

      {/* Header */}
      <HeaderCliente cliente={cliente} />

      {/* Actor: Ejecutivo (tblempleado) opera sobre tblcliente y sus relaciones */}
      <TrazabilidadBar
        codes={['RF-CLI-01', 'RF-CLI-02', 'RF-CLI-03', 'CU-CLI-01']}
        label={`tblcliente #${id} · tblcuenta · tbltransaccion · tblsolicitudcredito`}
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200 mb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTabActivo(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tabActivo === tab.id
                ? 'bg-[#1a3a6b] text-white shadow-md'
                : 'text-gray-500 hover:text-[#1a3a6b] hover:bg-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <div className="hidden sm:flex gap-1">
              {tab.rfs.map(rf => <RfBadge key={rf} code={rf} />)}
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-4 ml-1">
        {TABS.find(t => t.id === tabActivo)?.desc}
      </p>

      {/* Contenido */}
      {tabActivo === 'productos'   && <ProductosCliente  idCliente={Number(id)} />}
      {tabActivo === 'movimientos' && <MovimientosCuenta idCliente={Number(id)} />}
    </div>
  )
}
