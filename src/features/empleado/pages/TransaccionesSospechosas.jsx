import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSospechosas, marcarRevisada } from '../services/transaccionApi'

const TIPO_COLOR = {
  SPEI:     'bg-purple-100 text-purple-700',
  DEPOSITO: 'bg-green-100  text-green-700',
  RETIRO:   'bg-orange-100 text-orange-700',
  PAGO:     'bg-blue-100   text-blue-700',
}

export default function TransaccionesSospechosas() {
  const navigate = useNavigate()
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [procesando, setProcesando] = useState(null)
  const [revisadas, setRevisadas] = useState([])

  const cargar = async () => {
    setLoading(true); setError(null)
    try {
      const res = await getSospechosas()
      setTxs(res.data)
    } catch {
      setError('Error al cargar transacciones sospechosas')
    } finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [])

  const handleRevisar = async (id) => {
    setProcesando(id)
    try {
      await marcarRevisada(id)
      setRevisadas(prev => [...prev, id])
    } catch (err) {
      setError(err.response?.data?.error || 'Error al marcar como revisada')
    } finally { setProcesando(null) }
  }

  const pendientes = txs.filter(t => !revisadas.includes(t.idTransaccion))
  const hechas     = txs.filter(t =>  revisadas.includes(t.idTransaccion))

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <p className="text-gray-400 animate-pulse text-sm">Cargando transacciones sospechosas...</p>
    </div>
  )

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs
              font-semibold px-3 py-1.5 rounded-full border border-red-200 mb-3">
              RNF-CLI-08 · Detección automática de operaciones sospechosas
            </div>
            <h1 className="text-2xl font-bold text-[#1a3a6b]">Transacciones Sospechosas</h1>
            <p className="text-gray-400 text-sm mt-1">
              Operaciones marcadas por el sistema de detección de fraude
            </p>
          </div>
          <button onClick={() => navigate('/')}
            className="text-[#1a3a6b] hover:underline text-sm font-medium">
            Volver
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-red-600">{pendientes.length}</p>
            <p className="text-xs text-red-600 mt-1 font-medium">Pendientes</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-green-600">{hechas.length}</p>
            <p className="text-xs text-green-600 mt-1 font-medium">Revisadas esta sesión</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-[#1a3a6b]">
              ${txs.reduce((a, t) => a + Number(t.monto), 0)
                  .toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-[#1a3a6b] mt-1 font-medium">Monto total</p>
          </div>
        </div>

        {txs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-xl font-bold text-gray-700">Sin transacciones sospechosas</p>
          </div>
        ) : (
          <div className="space-y-4">

            {pendientes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">
                  Pendientes — {pendientes.length}
                </p>
                <div className="space-y-3">
                  {pendientes.map(tx => (
                    <div key={tx.idTransaccion}
                      className="bg-white rounded-2xl border border-red-100 shadow-sm p-5
                        hover:border-red-300 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-mono text-xs text-gray-400">TX-{tx.idTransaccion}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded
                              ${TIPO_COLOR[tx.tipoOp] || TIPO_COLOR[tx.tipoOperacion] || 'bg-gray-100 text-gray-600'}`}>
                              {tx.tipoOp || tx.tipoOperacion}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5
                              rounded-full font-semibold border border-red-200">
                              SOSPECHOSA
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm mb-2">
                            <div>
                              <p className="text-gray-400 text-xs">Cliente</p>
                              <p className="font-semibold text-gray-800">{tx.clienteNombre}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Cuenta origen</p>
                              <p className="font-mono text-xs text-gray-600">{tx.numeroCuentaOrigen}</p>
                            </div>
                            {tx.cuentaDestino && (
                              <div>
                                <p className="text-gray-400 text-xs">CLABE destino</p>
                                <p className="font-mono text-xs text-gray-600">{tx.cuentaDestino}</p>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-mono">
                            {new Date(tx.createdAt).toLocaleString('es-MX')}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-red-600 mb-3">
                            ${Number(tx.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </p>
                          <button
                            onClick={() => handleRevisar(tx.idTransaccion)}
                            disabled={procesando === tx.idTransaccion}
                            className="bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-200
                              text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                            {procesando === tx.idTransaccion ? 'Procesando...' : '✓ Marcar revisada'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hechas.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3">
                  Revisadas esta sesión — {hechas.length}
                </p>
                <div className="space-y-2">
                  {hechas.map(tx => (
                    <div key={tx.idTransaccion}
                      className="bg-green-50 rounded-xl border border-green-100 px-5 py-3
                        flex items-center justify-between opacity-75">
                      <div className="flex items-center gap-3">
                        <span className="text-green-500">✓</span>
                        <span className="font-mono text-xs text-gray-400">TX-{tx.idTransaccion}</span>
                        <span className="text-sm font-medium text-gray-700">{tx.clienteNombre}</span>
                      </div>
                      <p className="font-semibold text-gray-600">
                        ${Number(tx.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">idx_tx_sospechosa — V6__indices_rendimiento.sql</p>
          <p className="font-mono">CREATE INDEX idx_tx_sospechosa ON tbltransaccion(sospechosa, createdat DESC) WHERE sospechosa = TRUE;</p>
        </div>

      </div>
    </div>
  )
}
