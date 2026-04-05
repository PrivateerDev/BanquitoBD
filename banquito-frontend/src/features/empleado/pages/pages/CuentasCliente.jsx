import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCuentasPorCliente, crearCuenta } from '../services/cuentaApi'
import { getClienteById } from '../services/clienteApi'
import { getTransaccionesPorCuenta } from '../services/transaccionApi'

const TIPOS = ['AHORRO', 'NOMINA', 'CHEQUES']

const colorTipo = {
  AHORRO: 'bg-blue-100 text-blue-700',
  NOMINA: 'bg-green-100 text-green-700',
  CHEQUES: 'bg-purple-100 text-purple-700'
}

const colorEstado = {
  ACTIVA: 'bg-green-100 text-green-700',
  BLOQUEADA: 'bg-red-100 text-red-700',
  CANCELADA: 'bg-gray-100 text-gray-500'
}

export default function CuentasCliente() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [cuentas, setCuentas] = useState([])
  const [transacciones, setTransacciones] = useState([])
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tipo, setTipo] = useState('AHORRO')
  const [creando, setCreando] = useState(false)
  const [exito, setExito] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getClienteById(id), getCuentasPorCliente(id)])
      .then(([c, cu]) => { setCliente(c.data); setCuentas(cu.data) })
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false))
  }, [id])

  const handleVerMovimientos = async (cuenta) => {
    if (cuentaSeleccionada?.idCuenta === cuenta.idCuenta) {
      setCuentaSeleccionada(null); setTransacciones([]); return
    }
    try {
      const res = await getTransaccionesPorCuenta(cuenta.idCuenta)
      setTransacciones(res.data); setCuentaSeleccionada(cuenta)
    } catch { setError('Error al cargar movimientos') }
  }

  const handleCrear = async () => {
    setCreando(true); setExito(null); setError(null)
    try {
      const res = await crearCuenta({ idCliente: Number(id), idSucursal: 1, tipoCuenta: tipo })
      setCuentas([...cuentas, res.data])
      setExito(`Cuenta ${res.data.tipoCuenta} creada — CLABE: ${res.data.clabe}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear cuenta')
    } finally { setCreando(false) }
  }

  const totalSaldo = cuentas.reduce((acc, c) => acc + Number(c.saldo), 0)

  if (loading) return <div className="flex items-center justify-center h-96"><p className="animate-pulse text-gray-500">Cargando...</p></div>

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-[#1a3a6b] hover:underline text-sm font-medium">← Volver</button>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3a6b]">
                {cliente?.nombre} {cliente?.apellidoPat} {cliente?.apellidoMat}
              </h1>
              <p className="text-gray-500 text-sm">{cliente?.email} · RFC: {cliente?.rfc}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/clientes/${id}/solicitud`)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
              📋 Solicitar Producto
            </button>
            <button onClick={() => navigate(`/clientes/${id}/transferencia`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
              💸 Transferencia SPEI
            </button>
            <button onClick={() => navigate(`/clientes/${id}/bloqueo`)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
              🔒 Bloquear Tarjeta
            </button>
          </div>
        </div>

        {/* KPI saldo consolidado */}
        <div className="bg-[#1a3a6b] text-white rounded-2xl p-6 mb-6 shadow-md">
          <p className="text-sm opacity-80">Saldo Consolidado</p>
          <p className="text-4xl font-bold mt-1">
            ${totalSaldo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm opacity-70 mt-1">{cuentas.length} cuenta{cuentas.length !== 1 ? 's' : ''} activa{cuentas.length !== 1 ? 's' : ''}</p>
        </div>

        {exito && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">✅ {exito}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">⚠ {error}</div>}

        {/* Abrir nueva cuenta */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
          <h2 className="text-base font-semibold text-[#1a3a6b] mb-4">Abrir Nueva Cuenta</h2>
          <div className="flex gap-3">
            {TIPOS.map(t => (
              <button key={t} onClick={() => setTipo(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-colors
                  ${tipo === t ? 'border-[#1a3a6b] bg-blue-50 text-[#1a3a6b]' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}>
                {t}
              </button>
            ))}
            <button onClick={handleCrear} disabled={creando}
              className="ml-auto bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              {creando ? 'Creando...' : '+ Abrir Cuenta'}
            </button>
          </div>
        </div>

        {/* Lista de cuentas */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-[#1a3a6b]">Mis Cuentas</h2>
          </div>
          {cuentas.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No hay cuentas registradas</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {cuentas.map(c => (
                <div key={c.idCuenta}>
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleVerMovimientos(c)}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorTipo[c.tipoCuenta]}`}>{c.tipoCuenta}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorEstado[c.estado]}`}>{c.estado}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">CLABE: {c.clabe}</p>
                      <p className="text-xs text-gray-400">No. Cuenta: {c.numeroCuenta}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1a3a6b]">
                        ${Number(c.saldo).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-400">Límite diario: ${Number(c.limiteDiario).toLocaleString('es-MX')}</p>
                      <p className="text-xs text-blue-500 mt-1">
                        {cuentaSeleccionada?.idCuenta === c.idCuenta ? '▲ Ocultar movimientos' : '▼ Ver movimientos'}
                      </p>
                    </div>
                  </div>

                  {cuentaSeleccionada?.idCuenta === c.idCuenta && (
                    <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                      <h3 className="text-sm font-semibold text-[#1a3a6b] py-3">Últimos movimientos</h3>
                      {transacciones.length === 0 ? (
                        <p className="text-xs text-gray-400 pb-3">Sin movimientos registrados</p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-gray-400 border-b">
                              <th className="text-left pb-2">Folio</th>
                              <th className="text-left pb-2">Tipo</th>
                              <th className="text-left pb-2">Concepto</th>
                              <th className="text-right pb-2">Monto</th>
                              <th className="text-right pb-2">Saldo después</th>
                              <th className="text-right pb-2">Fecha</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {transacciones.map(t => (
                              <tr key={t.idTransaccion} className="text-gray-700">
                                <td className="py-2 text-xs font-mono text-gray-400">TX-{t.idTransaccion}</td>
                                <td className="py-2"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{t.tipoOp}</span></td>
                                <td className="py-2 text-xs">{t.concepto || '—'}</td>
                                <td className={`py-2 text-right font-semibold ${t.tipoOp === 'SPEI_OUT' ? 'text-red-600' : 'text-green-600'}`}>
                                  -${Number(t.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2 text-right text-gray-600">
                                  ${Number(t.saldoDespues).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2 text-right text-xs text-gray-400">
                                  {new Date(t.createdAt).toLocaleDateString('es-MX')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
