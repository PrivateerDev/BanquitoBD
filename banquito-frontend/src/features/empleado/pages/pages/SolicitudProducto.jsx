import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { crearSolicitud } from '../services/solicitudApi'

const PRODUCTOS = [
  { tipo: 'CUENTA_AHORRO', label: '🏦 Cuenta de Ahorro', desc: 'Sin comisiones, CLABE incluida' },
  { tipo: 'TARJETA_DEBITO', label: '💳 Tarjeta de Débito', desc: 'Acceso a cajeros y compras' },
  { tipo: 'CREDITO_PERSONAL', label: '💰 Crédito Personal', desc: 'Hasta $200,000 a 36 meses' },
  { tipo: 'CREDITO_HIPOTECARIO', label: '🏠 Hipotecario', desc: 'Hasta $5,000,000 a 240 meses' },
  { tipo: 'CREDITO_AUTOMOTRIZ', label: '🚗 Automotriz', desc: 'Hasta $800,000 a 60 meses' },
]

const PASOS = ['Producto', 'Datos', 'Confirmar', 'Resultado']

export default function SolicitudProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paso, setPaso] = useState(0)
  const [producto, setProducto] = useState(null)
  const [monto, setMonto] = useState('')
  const [plazo, setPlazo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const necesitaDatos = producto?.tipo?.startsWith('CREDITO')

  const handleConfirmar = async () => {
    setEnviando(true); setError(null)
    try {
      const res = await crearSolicitud({
        idCliente: Number(id), tipoProducto: producto.tipo,
        monto: necesitaDatos ? Number(monto) : null,
        plazo: necesitaDatos ? Number(plazo) : null,
      })
      setResultado(res.data); setPaso(3)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar solicitud')
    } finally { setEnviando(false) }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/clientes/${id}/cuentas`)} className="text-[#1a3a6b] hover:underline text-sm font-medium">← Volver</button>
          <h1 className="text-2xl font-bold text-[#1a3a6b]">Solicitar Producto Bancario</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {PASOS.map((p, i) => (
            <div key={p} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${i < paso ? 'bg-green-500 text-white' : i === paso ? 'bg-[#1a3a6b] text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i < paso ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-sm ${i === paso ? 'text-[#1a3a6b] font-semibold' : 'text-gray-400'}`}>{p}</span>
              {i < PASOS.length - 1 && <div className={`w-12 h-0.5 mx-3 ${i < paso ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">⚠️ {error}</div>}

        {/* Paso 0 */}
        {paso === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-base font-semibold text-[#1a3a6b] mb-4">Selecciona un producto</h2>
            <div className="grid gap-3">
              {PRODUCTOS.map(p => (
                <div key={p.tipo} onClick={() => setProducto(p)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${producto?.tipo === p.tipo ? 'border-[#1a3a6b] bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <p className="font-semibold text-gray-800">{p.label}</p>
                  <p className="text-sm text-gray-400">{p.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setPaso(1)} disabled={!producto}
              className="mt-6 w-full bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition-colors">
              Continuar →
            </button>
          </div>
        )}

        {/* Paso 1 */}
        {paso === 1 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-base font-semibold text-[#1a3a6b] mb-4">Datos de la solicitud</h2>
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <p className="text-[#1a3a6b] font-semibold">{producto.label}</p>
              <p className="text-blue-500 text-sm">{producto.desc}</p>
            </div>
            {necesitaDatos ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto solicitado (MXN)</label>
                  <input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="Ej. 50000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (meses)</label>
                  <input type="number" value={plazo} onChange={e => setPlazo(e.target.value)} placeholder="Ej. 24"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No se requieren datos adicionales para este producto.</p>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPaso(0)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 text-sm">← Atrás</button>
              <button onClick={() => setPaso(2)} disabled={necesitaDatos && (!monto || !plazo)}
                className="flex-1 bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {paso === 2 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-base font-semibold text-[#1a3a6b] mb-4">Confirma tu solicitud</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Producto</span><span className="font-semibold">{producto.label}</span></div>
              {necesitaDatos && <>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Monto</span><span className="font-semibold text-[#1a3a6b]">${Number(monto).toLocaleString('es-MX')}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Plazo</span><span className="font-semibold">{plazo} meses</span></div>
              </>}
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Estado inicial</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-sm font-semibold">EN EVALUACIÓN</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPaso(1)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 text-sm">← Atrás</button>
              <button onClick={handleConfirmar} disabled={enviando}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
                {enviando ? 'Enviando...' : '✅ Enviar solicitud'}
              </button>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {paso === 3 && resultado && (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Solicitud enviada!</h2>
            <p className="text-gray-500 mb-4">Tu solicitud fue registrada y está en evaluación.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-left flex gap-3 items-start">
              <span className="text-blue-500 text-lg mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-700">
                Tu solicitud será evaluada por nuestro equipo de crédito. La respuesta será enviada
                a tu correo registrado en un plazo máximo de <strong>48 horas hábiles</strong>.
                Puedes consultar el estatus con tu folio{' '}
                <strong className="font-mono">{resultado.folioSeguimiento}</strong>.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6 border border-gray-100">
              <div className="flex justify-between"><span className="text-gray-500">Folio</span><span className="font-mono font-bold text-[#1a3a6b]">{resultado.folioSeguimiento}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Producto</span><span className="font-semibold">{producto.label}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Estado</span><span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-sm font-semibold">EN EVALUACIÓN</span></div>
            </div>
            <button onClick={() => navigate(`/clientes/${id}/cuentas`)}
              className="w-full bg-[#1a3a6b] hover:bg-blue-900 text-white py-3 rounded-xl font-semibold">
              Volver a mis cuentas
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
