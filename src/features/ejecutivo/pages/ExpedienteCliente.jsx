import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { subirDocumento, getDocumentosPorCliente } from '../services/documentoApi'
import { TrazabilidadBar } from '../../../components/RfBadge'
import { getSolicitudesPorCliente } from '../services/solicitudApi'
import { getClienteById } from '../services/clienteApi'

const TIPOS = [
  { key: 'INE_FRENTE',            label: 'INE — Frente',             icon: '🪪' },
  { key: 'INE_REVERSO',           label: 'INE — Reverso',            icon: '🪪' },
  { key: 'COMPROBANTE_DOMICILIO', label: 'Comprobante de Domicilio', icon: '🏠' },
  { key: 'RFC_CURP',              label: 'RFC / CURP',               icon: '📋' },
  { key: 'COMPROBANTE_INGRESOS',  label: 'Comprobante de Ingresos',  icon: '💰' },
]

// Claves según chk_solicitud_tipoproducto (V7__empleado_constraints_semilla.sql)
const PRODUCTO_LABEL = {
  CUENTA:             '🏦 Cuenta de Ahorro',
  TARJETA:            '💳 Tarjeta de Débito',
  CREDITO_PERSONAL:   '💰 Crédito Personal',
  HIPOTECARIO:        '🏠 Hipotecario',
  CREDITO_AUTOMOTRIZ: '🚗 Automotriz',
}

const COLOR_ESTADO = {
  PENDIENTE:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  VALIDADO:   'bg-green-100  text-green-700  border-green-200',
  RECHAZADO:  'bg-red-100    text-red-700    border-red-200',
}

const ICON_ESTADO = { PENDIENTE: '⏳', VALIDADO: '✅', RECHAZADO: '❌' }

export default function ExpedienteCliente() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empleado } = useAuth()

  const [cliente,      setCliente]      = useState(null)
  const [documentos,   setDocumentos]   = useState([])
  const [solicitudes,  setSolicitudes]  = useState([])
  const [idSolicitud,  setIdSolicitud]  = useState('')
  const [tipo,         setTipo]         = useState(TIPOS[0].key)
  const [archivo,      setArchivo]      = useState(null)
  const [dragging,     setDragging]     = useState(false)
  const [subiendo,     setSubiendo]     = useState(false)
  const [exito,        setExito]        = useState(null)
  const [error,        setError]        = useState(null)
  const [loading,      setLoading]      = useState(true)
  const inputRef = useRef()

  const cargar = async () => {
    try {
      const [c, d, s] = await Promise.all([
        getClienteById(id),
        getDocumentosPorCliente(id),
        getSolicitudesPorCliente(id),
      ])
      setCliente(c.data)
      setDocumentos(d.data)
      setSolicitudes(s.data)
      if (s.data.length > 0 && !idSolicitud)
        setIdSolicitud(s.data[0].idSolicitud)
    } catch { setError('Error al cargar datos') }
    finally  { setLoading(false) }
  }

  useEffect(() => { cargar() }, [id])

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setArchivo(f)
  }

  const handleSubir = async () => {
    if (!archivo) { setError('Selecciona un archivo'); return }
    if (!idSolicitud) { setError('Selecciona una solicitud de producto'); return }
    setSubiendo(true); setExito(null); setError(null)
    try {
      await subirDocumento(Number(id), empleado.idEmpleado, tipo, Number(idSolicitud), archivo)
      setExito(`✅ ${TIPOS.find(t => t.key === tipo)?.label} subido correctamente`)
      setArchivo(null)
      await cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al subir documento')
    } finally { setSubiendo(false) }
  }

  const solicitudSeleccionada = solicitudes.find(s => s.idSolicitud === Number(idSolicitud))
  const tiposUnicos = [...new Set(documentos.map(d => d.tipoDocumento))].length
  const completitud = Math.round((tiposUnicos / TIPOS.length) * 100)
  const colorBarra  = completitud === 100 ? 'bg-green-500' : completitud >= 60 ? 'bg-yellow-400' : 'bg-red-400'

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <p className="text-gray-400 animate-pulse">Cargando expediente...</p>
    </div>
  )

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/clientes/${id}/cuentas`)}
            className="text-[#1a3a6b] hover:underline text-sm font-medium">← Volver</button>
          <div>
            <h1 className="text-2xl font-bold text-[#1a3a6b]">
              Expediente Digital — {cliente?.nombre} {cliente?.apellidoPat}
            </h1>
            <p className="text-gray-400 text-sm">
              KYC · RFC: {cliente?.rfc} · Los documentos serán revisados por el Evaluador Bancario
            </p>
          </div>
        </div>

        {/* Actor: Ejecutivo (tblempleado) sube · Evaluador (Rol 43) revisa */}
        <TrazabilidadBar
          codes={['RF-EVAL-01', 'RF-CLI-03']}
          label="tbldocumentocliente ← tblsolicitudcredito ← tblcliente · KYC"
        />

        {/* Selector de solicitud */}
        {solicitudes.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
            <span className="text-yellow-500 text-xl">⚠</span>
            <div>
              <p className="font-semibold text-yellow-800">Sin solicitudes activas</p>
              <p className="text-sm text-yellow-700 mt-1">
                El cliente debe tener una solicitud de producto antes de subir documentos.{' '}
                <button onClick={() => navigate(`/clientes/${id}/solicitud`)}
                  className="underline font-semibold">Crear solicitud →</button>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <p className="text-sm font-semibold text-[#1a3a6b] mb-3">
              📋 Producto al que pertenece este expediente
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {solicitudes.map(s => (
                <button key={s.idSolicitud}
                  onClick={() => setIdSolicitud(s.idSolicitud)}
                  className={`text-left p-3 rounded-xl border-2 transition-all
                    ${Number(idSolicitud) === s.idSolicitud
                      ? 'border-[#1a3a6b] bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'}`}>
                  <p className="font-semibold text-sm text-gray-800">
                    {PRODUCTO_LABEL[s.tipoProducto] || s.tipoProducto}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{s.folioSeguimiento}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-2 inline-block
                    ${s.estado === 'EN_EVALUACION' ? 'bg-yellow-100 text-yellow-700' :
                      s.estado === 'APROBADO' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'}`}>
                    {s.estado?.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Barra de completitud */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-[#1a3a6b]">Completitud del expediente</p>
            <span className={`text-sm font-bold ${completitud === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
              {completitud}% — {tiposUnicos} de {TIPOS.length} documentos
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className={`h-3 rounded-full transition-all ${colorBarra}`}
              style={{ width: `${completitud}%` }} />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {TIPOS.map(t => {
              const doc = documentos.find(d => d.tipoDocumento === t.key)
              return (
                <span key={t.key}
                  className={`text-xs px-2 py-1 rounded-full border font-medium
                    ${doc ? COLOR_ESTADO[doc.estado] : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  {doc ? ICON_ESTADO[doc.estado] : '○'} {t.label}
                </span>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Panel de carga */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-[#1a3a6b] mb-1">📤 Subir Documento</h2>
            {solicitudSeleccionada && (
              <p className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg mb-4">
                Para: <strong>{PRODUCTO_LABEL[solicitudSeleccionada.tipoProducto]}</strong>
                {' · '}{solicitudSeleccionada.folioSeguimiento}
              </p>
            )}

            {exito && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg mb-3 text-sm">{exito}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm">⚠ {error}</div>}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de documento</label>
              <div className="grid grid-cols-1 gap-2">
                {TIPOS.map(t => (
                  <button key={t.key} onClick={() => setTipo(t.key)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-sm
                      font-medium text-left transition-all
                      ${tipo === t.key
                        ? 'border-[#1a3a6b] bg-blue-50 text-[#1a3a6b]'
                        : 'border-gray-100 text-gray-500 hover:border-blue-200'}`}>
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                    {documentos.find(d => d.tipoDocumento === t.key) && (
                      <span className="ml-auto text-xs">
                        {ICON_ESTADO[documentos.find(d => d.tipoDocumento === t.key).estado]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                transition-all mb-4
                ${dragging ? 'border-[#1a3a6b] bg-blue-50'
                  : archivo ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}>
              <input ref={inputRef} type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={e => setArchivo(e.target.files[0])} />
              {archivo ? (
                <div>
                  <p className="text-2xl mb-1">📄</p>
                  <p className="text-sm font-semibold text-green-700">{archivo.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(archivo.size / 1024).toFixed(0)} KB
                  </p>
                  <button onClick={e => { e.stopPropagation(); setArchivo(null) }}
                    className="text-xs text-red-500 hover:underline mt-1">Quitar</button>
                </div>
              ) : (
                <div>
                  <p className="text-3xl mb-2">☁</p>
                  <p className="text-sm font-medium text-gray-600">Arrastra el archivo aquí</p>
                  <p className="text-xs text-gray-400 mt-1">o haz clic para seleccionar</p>
                  <p className="text-xs text-gray-300 mt-2">PDF, JPG, PNG · máx. 10 MB</p>
                </div>
              )}
            </div>

            <button onClick={handleSubir}
              disabled={subiendo || !archivo || !idSolicitud}
              className="w-full bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-200
                text-white font-semibold py-2.5 rounded-xl transition-all">
              {subiendo ? 'Subiendo...' : '📤 Subir documento'}
            </button>
          </div>

          {/* Lista de documentos — solo lectura para el ejecutivo */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-[#1a3a6b] mb-1">📁 Documentos del Expediente</h2>
            <p className="text-xs text-gray-400 mb-4">
              La validación es realizada por el Evaluador Bancario (Rol 43)
            </p>
            {documentos.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-2">📂</p>
                <p className="text-gray-400 text-sm">Sin documentos cargados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documentos.map(d => (
                  <div key={d.idDocumento}
                    className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                    <span className="text-2xl mt-0.5">
                      {TIPOS.find(t => t.key === d.tipoDocumento)?.icon || '📄'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {TIPOS.find(t => t.key === d.tipoDocumento)?.label || d.tipoDocumento}
                      </p>
                      {d.tipoProducto && (
                        <p className="text-xs text-blue-600 font-medium">
                          {PRODUCTO_LABEL[d.tipoProducto] || d.tipoProducto}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 truncate">{d.nombreArchivo}</p>
                      <p className="text-xs text-gray-400">
                        {(d.tamanioBytes / 1024).toFixed(0)} KB ·{' '}
                        {new Date(d.createdAt).toLocaleDateString('es-MX')}
                      </p>
                      {d.observaciones && (
                        <p className="text-xs text-red-600 mt-1">💬 {d.observaciones}</p>
                      )}
                      {d.nombreRevisor && (
                        <p className="text-xs text-gray-400 mt-1">
                          Revisado por: {d.nombreRevisor}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-semibold flex-shrink-0 ${COLOR_ESTADO[d.estado]}`}>
                      {ICON_ESTADO[d.estado]} {d.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
