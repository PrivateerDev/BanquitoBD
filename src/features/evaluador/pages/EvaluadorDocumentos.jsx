import { useState, useEffect } from 'react'
import { getDocumentosPendientes, revisarDocumento } from '../../ejecutivo/services/documentoApi'
import { useAuth } from '../../../context/AuthContext'

// Claves según chk_solicitud_tipoproducto (V7__empleado_constraints_semilla.sql)
const PRODUCTO_LABEL = {
  CUENTA:             '🏦 Cuenta de Ahorro',
  TARJETA:            '💳 Tarjeta de Débito',
  CREDITO_PERSONAL:   '💰 Crédito Personal',
  HIPOTECARIO:        '🏠 Hipotecario',
  CREDITO_AUTOMOTRIZ: '🚗 Automotriz',
}

const TIPO_LABEL = {
  INE_FRENTE:            '🪪 INE — Frente',
  INE_REVERSO:           '🪪 INE — Reverso',
  COMPROBANTE_DOMICILIO: '🏠 Comprobante de Domicilio',
  RFC_CURP:              '📋 RFC / CURP',
  COMPROBANTE_INGRESOS:  '💰 Comprobante de Ingresos',
}

export default function EvaluadorDocumentos() {
  const { empleado } = useAuth()
  const [documentos,    setDocumentos]    = useState([])
  const [loading,       setLoading]       = useState(true)
  const [procesando,    setProcesando]    = useState(null)
  const [observaciones, setObservaciones] = useState({})
  const [error,         setError]         = useState(null)
  const [filtroCliente, setFiltroCliente] = useState('TODOS')

  const cargar = async () => {
    try {
      const res = await getDocumentosPendientes()
      setDocumentos(res.data)
    } catch { setError('Error al cargar documentos') }
    finally  { setLoading(false) }
  }

  useEffect(() => { cargar() }, [])

  const handleRevision = async (idDocumento, estado) => {
    if (estado === 'RECHAZADO' && !observaciones[idDocumento]) {
      alert('Escribe una observación antes de rechazar')
      return
    }
    setProcesando(idDocumento)
    try {
      await revisarDocumento(idDocumento, {
        estado,
        observaciones: observaciones[idDocumento] || null,
        idEmpleadoRevisor: empleado.idEmpleado
      })
      await cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar revisión')
    } finally { setProcesando(null) }
  }

  // Agrupar por cliente
  const clientesUnicos = [...new Set(documentos.map(d => d.idCliente))]
  const docsFiltrados  = filtroCliente === 'TODOS'
    ? documentos
    : documentos.filter(d => d.idCliente === Number(filtroCliente))

  // Agrupar docs filtrados por cliente para mostrarlos en secciones
  const grupos = docsFiltrados.reduce((acc, d) => {
    const key = d.idCliente
    if (!acc[key]) acc[key] = { nombre: d.nombreCliente, docs: [] }
    acc[key].docs.push(d)
    return acc
  }, {})

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <p className="text-gray-400 animate-pulse">Cargando documentos pendientes...</p>
    </div>
  )

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1a3a6b] text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 mb-3">
            Evaluación Bancaria · Rol 43 · RF-EVAL-01
          </div>
          <h1 className="text-2xl font-bold text-[#1a3a6b]">Panel de Revisión de Expedientes</h1>
          <p className="text-gray-400 text-sm mt-1">
            Valida o rechaza los documentos KYC vinculados a solicitudes de producto
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{documentos.length}</p>
            <p className="text-xs text-yellow-600 mt-1">Pendientes de revisión</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-[#1a3a6b]">{clientesUnicos.length}</p>
            <p className="text-xs text-[#1a3a6b] mt-1">Clientes con docs pendientes</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">48h</p>
            <p className="text-xs text-green-600 mt-1">Plazo máximo CNBV</p>
          </div>
        </div>

        {/* Filtro por cliente */}
        {clientesUnicos.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <p className="text-sm font-semibold text-[#1a3a6b] mb-3">Filtrar por cliente</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFiltroCliente('TODOS')}
                className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all
                  ${filtroCliente === 'TODOS'
                    ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                Todos ({documentos.length})
              </button>
              {Object.entries(grupos).map(([idCliente, g]) => (
                <button key={idCliente}
                  onClick={() => setFiltroCliente(idCliente)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all
                    ${filtroCliente === idCliente
                      ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                  {g.nombre} ({g.docs.length})
                </button>
              ))}
            </div>
          </div>
        )}

        {documentos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-xl font-bold text-gray-700">Sin documentos pendientes</p>
            <p className="text-gray-400 text-sm mt-2">Todos los expedientes han sido revisados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grupos).map(([idCliente, grupo]) => (
              <div key={idCliente}>
                {/* Encabezado de cliente */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a3a6b] text-white flex items-center justify-center text-sm font-bold">
                    {grupo.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{grupo.nombre}</p>
                    <p className="text-xs text-gray-400">{grupo.docs.length} documento(s) pendiente(s)</p>
                  </div>
                </div>

                {/* Documentos del cliente */}
                <div className="space-y-3 pl-11">
                  {grupo.docs.map(d => (
                    <div key={d.idDocumento}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                      {/* Producto vinculado */}
                      {d.tipoProducto && (
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                          <span className="text-xs bg-blue-50 text-[#1a3a6b] border border-blue-100
                            px-3 py-1 rounded-full font-semibold">
                            {PRODUCTO_LABEL[d.tipoProducto] || d.tipoProducto}
                          </span>
                          {d.folioSolicitud && (
                            <span className="text-xs text-gray-400 font-mono">
                              {d.folioSolicitud}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                              ⏳ PENDIENTE
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              {TIPO_LABEL[d.tipoDocumento] || d.tipoDocumento.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            📄 {d.nombreArchivo} · {(d.tamanioBytes / 1024).toFixed(0)} KB
                          </p>
                          <p className="text-xs text-gray-400">
                            Subido por: <span className="font-medium">{d.nombreEmpleado}</span>
                            {' · '}{new Date(d.createdAt).toLocaleDateString('es-MX')}
                          </p>
                        </div>

                        {/* Acciones del evaluador */}
                        <div className="flex flex-col gap-2 min-w-[220px]">
                          <textarea
                            rows={2}
                            placeholder="Observaciones (requeridas para rechazar)"
                            value={observaciones[d.idDocumento] || ''}
                            onChange={e => setObservaciones({
                              ...observaciones, [d.idDocumento]: e.target.value
                            })}
                            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5
                              resize-none focus:outline-none focus:ring-1 focus:ring-blue-300"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRevision(d.idDocumento, 'VALIDADO')}
                              disabled={procesando === d.idDocumento}
                              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-200
                                text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                              {procesando === d.idDocumento ? '...' : '✅ Validar'}
                            </button>
                            <button
                              onClick={() => handleRevision(d.idDocumento, 'RECHAZADO')}
                              disabled={procesando === d.idDocumento}
                              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-200
                                text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                              {procesando === d.idDocumento ? '...' : '❌ Rechazar'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
