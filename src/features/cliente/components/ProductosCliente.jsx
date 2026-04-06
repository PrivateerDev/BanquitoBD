// ProductosCliente.jsx — Banquito
// Trazabilidad: RF-CLI-01, RF-CLI-03 · CU-CLI-01
// Paleta: #1a3a6b (azul marino), blanco, grises claros — consistente con el proyecto

import { useState, useEffect } from 'react'
import { getProductosCliente as productosCliente } from '../../../features/ejecutivo/services/clienteApi'
import { TrazabilidadBar, RfBadge } from '../../../components/RfBadge'

// ── Helpers ───────────────────────────────────────────────────────────────────

const TIPO_CUENTA = {
  AHORRO:    { label: 'Ahorro',    icon: '🏦', badge: 'bg-blue-100 text-blue-700' },
  NOMINA:    { label: 'Nómina',    icon: '💼', badge: 'bg-green-100 text-green-700' },
  CHEQUES:   { label: 'Cheques',   icon: '📄', badge: 'bg-purple-100 text-purple-700' },
  INVERSION: { label: 'Inversión', icon: '📈', badge: 'bg-amber-100 text-amber-700' },
}

const ESTADO_CUENTA = {
  ACTIVA:    { label: 'Activa',    dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
  BLOQUEADA: { label: 'Bloqueada', dot: 'bg-amber-500',  badge: 'bg-amber-100 text-amber-700' },
  CANCELADA: { label: 'Cancelada', dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-500' },
}

const ESTADO_SOLICITUD = {
  PENDIENTE:     { label: 'Pendiente',     badge: 'bg-amber-100 text-amber-700' },
  EN_EVALUACION: { label: 'En evaluación', badge: 'bg-blue-100 text-blue-700' },
  APROBADA:      { label: 'Aprobada',      badge: 'bg-green-100 text-green-700' },
  RECHAZADA:     { label: 'Rechazada',     badge: 'bg-red-100 text-red-700' },
  CANCELADA:     { label: 'Cancelada',     badge: 'bg-gray-100 text-gray-500' },
}

const TIPO_PRODUCTO = {
  CREDITO_PERSONAL:   'Crédito Personal',
  CREDITO_AUTOMOTRIZ: 'Crédito Automotriz',
  HIPOTECARIO:        'Hipotecario',
  TARJETA:            'Tarjeta de Crédito',
  CUENTA:             'Apertura de Cuenta',
}

function moneda(v) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v ?? 0)
}
function fechaCorta(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Tarjeta de cuenta ─────────────────────────────────────────────────────────

function TarjetaCuenta({ cuenta }) {
  const tipo   = TIPO_CUENTA[cuenta.tipoCuenta]  || { label: cuenta.tipoCuenta,  icon: '💳', badge: 'bg-gray-100 text-gray-600' }
  const estado = ESTADO_CUENTA[cuenta.estado]    || { label: cuenta.estado, dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500' }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md ${
      cuenta.activo ? 'border-gray-200' : 'border-gray-100 opacity-60'
    }`}>
      {/* Encabezado */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{tipo.icon}</span>
          <div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${tipo.badge}`}>
              {tipo.label}
            </span>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{cuenta.numeroCuenta}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${estado.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${estado.dot}`} />
            {estado.label}
          </span>
          <RfBadge code="RF-CLI-01" />
        </div>
      </div>

      {/* Saldo */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Saldo disponible</p>
        <p className="text-3xl font-bold text-[#1a3a6b]">{moneda(cuenta.saldo)}</p>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-[10px] text-gray-400 mb-0.5">CLABE</p>
          <p className="text-xs text-gray-600 font-mono">{cuenta.clabe}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 mb-0.5">Apertura</p>
          <p className="text-xs text-gray-500">{fechaCorta(cuenta.creadoEn)}</p>
        </div>
      </div>
    </div>
  )
}

// ── Fila de solicitud ─────────────────────────────────────────────────────────

function FilaSolicitud({ sol }) {
  const estado = ESTADO_SOLICITUD[sol.estado] || { label: sol.estado, badge: 'bg-gray-100 text-gray-500' }
  const tipo   = TIPO_PRODUCTO[sol.tipoProducto] || sol.tipoProducto

  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
      <td className="py-3 px-4">
        <p className="text-sm font-medium text-gray-800">{tipo}</p>
        <p className="text-xs text-gray-400 font-mono">{sol.folioSeguimiento || '—'}</p>
      </td>
      <td className="py-3 px-4 text-sm text-gray-700 font-semibold tabular-nums">{moneda(sol.monto)}</td>
      <td className="py-3 px-4 text-sm text-gray-500 text-center">{sol.plazo ? `${sol.plazo} meses` : '—'}</td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${estado.badge}`}>
          {estado.label}
        </span>
      </td>
      <td className="py-3 px-4 text-xs text-gray-400">{fechaCorta(sol.creadoEn)}</td>
      <td className="py-3 px-4"><RfBadge code="RF-CLI-03" /></td>
    </tr>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ProductosCliente({ idCliente }) {
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [tabCuenta, setTabCuenta] = useState('activas')
  const [tabSol,    setTabSol]    = useState('activas')

  useEffect(() => {
    if (!idCliente) return
    setLoading(true)
    productosCliente(idCliente)
      .then(res => setData(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [idCliente])

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-gray-400 gap-2 text-sm">
      <span className="animate-spin">⏳</span> Cargando productos…
    </div>
  )
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">⚠ {error}</div>
  )
  if (!data) return null

  const cuentasActivas     = (data.cuentas || []).filter(c => c.activo)
  const cuentasFinalizadas = (data.cuentas || []).filter(c => !c.activo)
  const cuentasMostradas   = tabCuenta === 'activas' ? cuentasActivas : (data.cuentas || [])
  const solicActivas       = (data.solicitudes || []).filter(s => s.activo)
  const solicFinalizadas   = (data.solicitudes || []).filter(s => !s.activo)
  const solicMostradas     = tabSol === 'activas' ? solicActivas : solicFinalizadas

  return (
    <div className="space-y-6">

      {/* Barra de trazabilidad */}
      <TrazabilidadBar codes={['RF-CLI-01', 'RF-CLI-03', 'CU-CLI-01']} label="Productos del cliente" />

      {/* ── Cuentas bancarias ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-[#1a3a6b]">Cuentas bancarias</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Activas: {cuentasActivas.length} · Finalizadas: {cuentasFinalizadas.length}
            </p>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
            {[['activas', `Activas (${cuentasActivas.length})`], ['todas', `Todas (${(data.cuentas||[]).length})`]].map(([val, label]) => (
              <button key={val} onClick={() => setTabCuenta(val)}
                className={`px-3 py-1.5 transition-colors font-medium ${
                  tabCuenta === val ? 'bg-[#1a3a6b] text-white' : 'bg-white text-gray-500 hover:text-[#1a3a6b]'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {cuentasMostradas.length === 0
          ? <p className="text-sm text-gray-400 italic py-6 text-center">No hay cuentas {tabCuenta === 'activas' ? 'activas' : 'registradas'}</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {cuentasMostradas.map(c => <TarjetaCuenta key={c.idCuenta} cuenta={c} />)}
            </div>
        }
      </section>

      {/* ── Solicitudes ───────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-[#1a3a6b]">Solicitudes de productos</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Activas: {solicActivas.length} · Finalizadas: {solicFinalizadas.length}
            </p>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
            {[['activas', `Activas (${solicActivas.length})`], ['finalizadas', `Finalizadas (${solicFinalizadas.length})`]].map(([val, label]) => (
              <button key={val} onClick={() => setTabSol(val)}
                className={`px-3 py-1.5 transition-colors font-medium ${
                  tabSol === val ? 'bg-[#1a3a6b] text-white' : 'bg-white text-gray-500 hover:text-[#1a3a6b]'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {solicMostradas.length === 0
          ? <p className="text-sm text-gray-400 italic py-6 text-center">No hay solicitudes {tabSol === 'activas' ? 'activas' : 'finalizadas'}</p>
          : <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Producto / Folio', 'Monto', 'Plazo', 'Estado', 'Fecha', 'RF'].map(h => (
                      <th key={h} className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {solicMostradas.map(s => <FilaSolicitud key={s.idSolicitud} sol={s} />)}
                </tbody>
              </table>
            </div>
        }
      </section>
    </div>
  )
}
