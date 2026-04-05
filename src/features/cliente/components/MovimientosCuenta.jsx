// MovimientosCuenta.jsx — Banquito
// Trazabilidad: RF-CLI-02, RF-CLI-08, RNF-CLI-02, RNF-CLI-08 · CU-CLI-01
// Paleta: #1a3a6b (azul marino), blanco, grises claros

import { useState, useEffect } from 'react'
import { getCuentasPorCliente as cuentasPorCliente, getMovimientosCuenta as movimientosCuenta } from '../../../features/empleado/services/clienteApi'
import { TrazabilidadBar, RfBadge } from '../../../components/RfBadge'

// ── Helpers ───────────────────────────────────────────────────────────────────

const TIPO_OP = {
  DEPOSITO:      { label: 'Depósito',      icon: '⬆',  badge: 'bg-green-100 text-green-700',  monto: 'text-green-600',  signo: '+' },
  RETIRO:        { label: 'Retiro',        icon: '⬇',  badge: 'bg-red-100 text-red-700',      monto: 'text-red-600',    signo: '-' },
  TRANSFERENCIA: { label: 'Transferencia', icon: '↔',  badge: 'bg-blue-100 text-blue-700',    monto: 'text-red-600',    signo: '-' },
  SPEI:          { label: 'SPEI',          icon: '↗',  badge: 'bg-blue-100 text-blue-700',    monto: 'text-red-600',    signo: '-' },
  PAGO:          { label: 'Pago',          icon: '💳', badge: 'bg-purple-100 text-purple-700', monto: 'text-red-600',   signo: '-' },
}

const ESTADO_TX = {
  COMPLETADA: 'bg-green-100 text-green-700',
  PENDIENTE:  'bg-amber-100 text-amber-700',
  CANCELADA:  'bg-gray-100 text-gray-500',
  REVERTIDA:  'bg-orange-100 text-orange-700',
}

const CANAL_ICON = { WEB: '🌐', CAJERO_ATM: '🏧', SUCURSAL: '🏦' }

function moneda(v) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v ?? 0)
}
function fechaHora(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── Fila de movimiento ────────────────────────────────────────────────────────

function FilaMovimiento({ mov }) {
  const op     = TIPO_OP[mov.tipoOperacion] || { label: mov.tipoOperacion, icon: '•', badge: 'bg-gray-100 text-gray-600', monto: 'text-gray-700', signo: '' }
  const estado = ESTADO_TX[mov.estado]      || 'bg-gray-100 text-gray-500'

  return (
    <tr className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${mov.sospechosa ? 'bg-red-50' : ''}`}>
      {/* Tipo */}
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${op.badge}`}>
          {op.icon} {op.label}
        </span>
      </td>
      {/* Concepto */}
      <td className="py-3 px-4 max-w-[160px]">
        <p className="text-sm text-gray-700 truncate">{mov.concepto || '—'}</p>
      </td>
      {/* Monto */}
      <td className="py-3 px-4 text-right">
        <span className={`text-base font-bold ${op.monto}`}>
          {op.signo}{moneda(mov.monto)}
        </span>
      </td>
      {/* Canal */}
      <td className="py-3 px-4 text-center text-lg" title={mov.canal}>
        {CANAL_ICON[mov.canal] || '•'}
      </td>
      {/* Estado */}
      <td className="py-3 px-4">
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${estado}`}>
          {mov.estado}
        </span>
      </td>
      {/* Fecha */}
      <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">{fechaHora(mov.timestamp)}</td>
      {/* Flags */}
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1 justify-end">
          {mov.sospechosa && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse">
              ⚠ Fraude
            </span>
          )}
          {mov.comprobanteGenerado && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 border border-gray-200">
              📄 PDF
            </span>
          )}
          <RfBadge code="RF-CLI-02" />
        </div>
      </td>
    </tr>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function MovimientosCuenta({ idCliente }) {
  const [cuentas,    setCuentas]    = useState([])
  const [cuentaSel,  setCuentaSel]  = useState(null)
  const [movData,    setMovData]    = useState(null)
  const [loadCtas,   setLoadCtas]   = useState(true)
  const [loadMovs,   setLoadMovs]   = useState(false)
  const [error,      setError]      = useState(null)
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [busqueda,   setBusqueda]   = useState('')

  useEffect(() => {
    if (!idCliente) return
    setLoadCtas(true)
    cuentasPorCliente(idCliente)
      .then(res => {
        const lista = res.data
        setCuentas(lista)
        if (lista.length > 0) setCuentaSel(lista[0].idCuenta)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoadCtas(false))
  }, [idCliente])

  useEffect(() => {
    if (!cuentaSel) return
    setLoadMovs(true)
    setMovData(null)
    movimientosCuenta(cuentaSel)
      .then(res => setMovData(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoadMovs(false))
  }, [cuentaSel])

  const movsFiltrados = (movData?.movimientos || []).filter(m => {
    const tipoOk  = filtroTipo === 'TODOS' || m.tipoOperacion === filtroTipo
    const textoOk = !busqueda || (m.concepto || '').toLowerCase().includes(busqueda.toLowerCase())
    return tipoOk && textoOk
  })
  const hayFraude = movData?.movimientos?.some(m => m.sospechosa)

  if (loadCtas) return (
    <div className="flex items-center justify-center h-40 text-gray-400 gap-2 text-sm">
      <span className="animate-spin">⏳</span> Cargando cuentas…
    </div>
  )
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">⚠ {error}</div>
  )

  return (
    <div className="space-y-4">

      {/* Trazabilidad */}
      <TrazabilidadBar codes={['RF-CLI-02', 'RF-CLI-08', 'RNF-CLI-02', 'RNF-CLI-08']} label="Movimientos de cuenta" />

      {/* Alerta fraude — RNF-CLI-08 */}
      {hayFraude && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-sm">
          <span className="text-xl animate-pulse">⚠</span>
          <div>
            <span className="font-bold">Operación sospechosa detectada</span>
            <span className="ml-2"><RfBadge code="RNF-CLI-08" /></span>
            <p className="text-xs text-red-500 mt-0.5">Revisar con el área de seguridad.</p>
          </div>
        </div>
      )}

      {/* Selector de cuenta */}
      {cuentas.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {cuentas.map(c => (
            <button key={c.idCuenta} onClick={() => setCuentaSel(c.idCuenta)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                cuentaSel === c.idCuenta
                  ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#1a3a6b] hover:text-[#1a3a6b]'
              }`}>
              {c.tipoCuenta} · {c.numeroCuenta?.slice(-6)}
            </button>
          ))}
        </div>
      )}

      {/* Resumen de cuenta */}
      {movData && (
        <div className="flex flex-wrap gap-6 p-4 bg-[#1a3a6b] text-white rounded-2xl shadow-md">
          <div>
            <p className="text-blue-300 text-xs uppercase tracking-wider mb-0.5">Cuenta</p>
            <p className="text-sm font-mono">{movData.numeroCuenta}</p>
          </div>
          <div>
            <p className="text-blue-300 text-xs uppercase tracking-wider mb-0.5">Tipo</p>
            <p className="text-sm">{movData.tipoCuenta}</p>
          </div>
          <div>
            <p className="text-blue-300 text-xs uppercase tracking-wider mb-0.5">Saldo actual</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(movData.saldoActual || 0)}
            </p>
          </div>
          <div>
            <p className="text-blue-300 text-xs uppercase tracking-wider mb-0.5">Movimientos</p>
            <p className="text-sm">{movData.movimientos?.length ?? 0} registros</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
          {['TODOS', 'DEPOSITO', 'RETIRO', 'SPEI', 'PAGO'].map(t => (
            <button key={t} onClick={() => setFiltroTipo(t)}
              className={`px-3 py-1.5 font-medium transition-colors ${
                filtroTipo === t ? 'bg-[#1a3a6b] text-white' : 'bg-white text-gray-500 hover:text-[#1a3a6b]'
              }`}>
              {t === 'TODOS' ? 'Todos' : (TIPO_OP[t]?.label || t)}
            </button>
          ))}
        </div>
        <input
          type="text" placeholder="Buscar por concepto…"
          value={busqueda} onChange={e => setBusqueda(e.target.value)}
          className="flex-1 min-w-[160px] max-w-xs px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#1a3a6b]"
        />
        <span className="text-xs text-gray-400 ml-auto">
          {movsFiltrados.length} de {movData?.movimientos?.length ?? 0} movimientos
        </span>
      </div>

      {/* Tabla */}
      {loadMovs ? (
        <div className="flex items-center justify-center h-32 text-gray-400 gap-2 text-sm">
          <span className="animate-spin">⏳</span> Cargando movimientos…
        </div>
      ) : movsFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center text-gray-400 text-sm shadow-sm">
          No hay movimientos que coincidan con el filtro.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Operación', 'Concepto', 'Monto', 'Canal', 'Estado', 'Fecha/Hora', 'Flags'].map(h => (
                  <th key={h} className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movsFiltrados.map(m => <FilaMovimiento key={m.idTransaccion} mov={m} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
