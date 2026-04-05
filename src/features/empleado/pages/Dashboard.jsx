import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientes } from '../services/clienteApi'
import { useAuth } from '../../../context/AuthContext'
import { TrazabilidadBar } from '../../../components/RfBadge'

export default function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const navigate  = useNavigate()
  const { empleado } = useAuth()

  useEffect(() => {
    getClientes()
      .then(res => setClientes(res.data))
      .catch(() => setError('Error al cargar clientes'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <p className="text-gray-500 animate-pulse">Cargando...</p>
    </div>
  )
  if (error) return (
    <div className="flex items-center justify-center h-96">
      <p className="text-red-500">{error}</p>
    </div>
  )

  const totalActivos   = clientes.filter(c => c.activo === 1).length
  const totalSucursales = [...new Set(clientes.map(c => c.sucursalNombre))].length

  return (
    <div className="p-8">

      {/* ── Encabezado ── */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a6b]">Panel de Gestión de Clientes</h1>
          {/*
            Corregido: el actor es el Ejecutivo de Sucursal (tblempleado),

            Ref: Sección 7 — Operaciones · tblempleado.rol = EJECUTIVO_SUCURSAL
          */}
          <p className="text-gray-500 text-sm mt-0.5">
            {empleado?.nombre} {empleado?.apellidoPat}
            {' · '}
            <span className="font-mono text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
              tblempleado
            </span>
            {' · '}
            {(empleado?.rol || '').replace(/_/g, ' ')}
            {' · '}
            {empleado?.sucursalNombre || 'Sucursal'}
          </p>
        </div>
        <button
          onClick={() => navigate('/clientes/nuevo')}
          className="bg-[#1a3a6b] hover:bg-blue-900 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md text-sm">
          + Registrar Cliente
        </button>
      </div>

      {/* Barra de trazabilidad — tabla tblcliente es el objeto gestionado */}
      <TrazabilidadBar
        codes={['RF-CLI-01', 'RF-CLI-02', 'RF-CLI-03']}
        label="tblcliente — gestionado por Ejecutivo de Sucursal"
      />

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a3a6b] text-white rounded-2xl p-6 shadow-md">
          <p className="text-blue-300 text-sm mb-1">Total Clientes</p>
          <p className="text-4xl font-bold">{clientes.length}</p>
          <p className="text-blue-300 text-xs mt-2 font-mono">tblcliente</p>
        </div>
        <div className="bg-green-600 text-white rounded-2xl p-6 shadow-md">
          <p className="text-green-200 text-sm mb-1">Clientes Activos</p>
          <p className="text-4xl font-bold">{totalActivos}</p>
          <p className="text-green-200 text-xs mt-2 font-mono">activo = 1</p>
        </div>
        <div className="bg-purple-700 text-white rounded-2xl p-6 shadow-md">
          <p className="text-purple-200 text-sm mb-1">Sucursales</p>
          <p className="text-4xl font-bold">{totalSucursales}</p>
          <p className="text-purple-200 text-xs mt-2 font-mono">tblsucursal</p>
        </div>
      </div>


      {/* ── Panel de esquema BD — relevante para curso de Base de Datos ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#1a3a6b]">🗄️ Esquema de Base de Datos</h2>
          <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
            banquito_db · PostgreSQL 16 · Flyway v7
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { tabla: 'tblcliente',         rel: '→ tblsucursal',               constraint: 'UNIQUE: rfc, curp, email',         migr: 'V1' },
            { tabla: 'tblcuenta',          rel: '→ tblcliente, tblsucursal',   constraint: 'chk_cuenta_saldo_positivo',        migr: 'V1 V7' },
            { tabla: 'tbltransaccion',     rel: '→ tblcuenta, tblcliente',     constraint: 'chk_tx_tipoop, chk_tx_canal',      migr: 'V4 V5' },
            { tabla: 'tblempleado',        rel: '→ tblsucursal',               constraint: 'chk_empleado_rol, UNIQUE: email',  migr: 'V2 V7' },
            { tabla: 'tblsolicitudcredito',rel: '→ tblcliente',                constraint: 'chk_solicitud_tipoproducto',       migr: 'V1 V7' },
            { tabla: 'tblbloqueotarjeta',  rel: '→ tbltarjeta, tblcliente',    constraint: 'UNIQUE: folio BLQ-YYYY-NNNN',      migr: 'V1' },
            { tabla: 'tblaclaracion',      rel: '→ tbltransaccion, tblcliente',constraint: 'plazo = apertura + 45 días',       migr: 'V1' },
            { tabla: 'tbldocumentocliente',rel: '→ tblcliente, tblempleado',   constraint: 'idx_doc_cliente, idx_doc_estado',  migr: 'V3' },
            { tabla: 'tblsucursal',         rel: '← tblcliente, tblcuenta, tblempleado', constraint: 'UNIQUE: nombre · activa SMALLINT',  migr: 'V1' },
          ].map(row => (
            <div key={row.tabla} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <p className="font-mono font-semibold text-[#1a3a6b] text-[10px] truncate">{row.tabla}</p>
              <p className="text-gray-400 text-[10px] mt-0.5 truncate">{row.rel}</p>
              <p className="text-gray-500 text-[10px] mt-1 truncate" title={row.constraint}>⚙ {row.constraint}</p>
              <span className="text-[9px] font-mono bg-blue-50 text-blue-400 px-1 rounded mt-1 inline-block">{row.migr}</span>
            </div>
          ))}
        </div>
      </div>
      {/* ── Tabla de clientes ── */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#1a3a6b]">Clientes registrados</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">tblcliente ← tblsucursal</p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {clientes.length} registros
          </span>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
            <tr>
              <th className="px-6 py-3">
                <span className="font-mono text-[10px] normal-case text-gray-400">idcliente</span>
              </th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3">
                <span className="font-mono text-[10px] normal-case text-gray-400">tblsucursal</span>
              </th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clientes.map(c => (
              <tr key={c.idCliente} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{c.idCliente}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {c.nombre} {c.apellidoPat} {c.apellidoMat}
                </td>
                <td className="px-6 py-4 text-gray-500">{c.email}</td>
                <td className="px-6 py-4 text-gray-500">{c.telefono}</td>
                <td className="px-6 py-4 text-gray-500">{c.sucursalNombre}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                    ${c.activo === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.activo === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/clientes/${c.idCliente}`)}
                    className="text-indigo-600 hover:underline text-xs font-semibold">
                    📦 Expediente →
                  </button>
                  <button
                    onClick={() => navigate(`/clientes/${c.idCliente}/cuentas`)}
                    className="text-[#1a3a6b] hover:underline text-xs font-semibold">
                    💳 Cuentas →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientes.length === 0 && (
          <p className="text-center text-gray-400 py-8">No hay clientes registrados</p>
        )}
      </div>
    </div>
  )
}
