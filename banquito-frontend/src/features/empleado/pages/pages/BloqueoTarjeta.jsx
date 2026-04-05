import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bloquearTarjeta } from '../services/bloqueoApi'
import { getCuentasPorCliente } from '../services/cuentaApi'

const MOTIVOS = ['ROBO', 'PERDIDA', 'CLONACION', 'USO_NO_RECONOCIDO']
const PASOS = ['Seleccionar tarjeta', 'Motivo', 'Confirmar', 'Folio']

export default function BloqueoTarjeta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paso, setPaso] = useState(0)
  const [tarjetas, setTarjetas] = useState([])
  const [form, setForm] = useState({ idTarjeta: '', motivo: '', descripcion: '' })
  const [errores, setErrores] = useState({})
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null)

  useEffect(() => {
    fetch(`/api/v1/tarjetas/cliente/${id}`).then(r => r.json())
      .then(data => setTarjetas(data))
      .catch(() => setTarjetas([]))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: null })
    if (e.target.name === 'idTarjeta')
      setTarjetaSeleccionada(tarjetas.find(t => t.idTarjeta === Number(e.target.value)))
  }

  const validarPaso = () => {
    const err = {}
    if (paso === 0 && !form.idTarjeta) err.idTarjeta = 'Selecciona una tarjeta'
    if (paso === 1 && !form.motivo) err.motivo = 'Selecciona un motivo'
    setErrores(err)
    return Object.keys(err).length === 0
  }

  const handleSiguiente = async () => {
    if (!validarPaso()) return
    if (paso === 2) {
      setLoading(true)
      try {
        const res = await bloquearTarjeta({
          idTarjeta: Number(form.idTarjeta),
          idCliente: Number(id),
          motivo: form.motivo,
          descripcion: form.descripcion
        })
        setResultado(res.data)
        setPaso(3)
      } catch (err) {
        const data = err.response?.data
        setErrores({ general: data?.error || 'Error al procesar el bloqueo' })
      } finally { setLoading(false) }
    } else { setPaso(paso + 1) }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/clientes/${id}/cuentas`)} className="text-[#1a3a6b] hover:underline text-sm font-medium">← Volver</button>
          <h1 className="text-2xl font-bold text-[#1a3a6b]">Bloqueo de Tarjeta</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {PASOS.map((p, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${i < paso ? 'bg-green-500 text-white' : i === paso ? 'bg-[#1a3a6b] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < paso ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-xs font-medium ${i === paso ? 'text-[#1a3a6b]' : 'text-gray-400'}`}>{p}</span>
              {i < PASOS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < paso ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {errores.general && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">⚠ {errores.general}</div>}

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

          {/* PASO 0 - Seleccionar tarjeta */}
          {paso === 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a3a6b]">¿Qué tarjeta deseas bloquear?</h2>
              {tarjetas.length === 0 && (
                <p className="text-gray-400 text-sm">No tienes tarjetas activas disponibles.</p>
              )}
              {tarjetas.map(t => (
                <label key={t.idTarjeta} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors
                  ${form.idTarjeta == t.idTarjeta ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}>
                  <input type="radio" name="idTarjeta" value={t.idTarjeta} onChange={handleChange} className="hidden" />
                  <div>
                    <p className="font-semibold text-gray-800">{t.tipoTarjeta}</p>
                    <p className="text-xs text-gray-400 font-mono">**** **** **** {t.numeroTarjeta?.slice(-4)}</p>
                    <p className="text-xs text-gray-400">Vence: {t.fechaVenc}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.estado === 'ACTIVA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {t.estado}
                  </span>
                </label>
              ))}
              {errores.idTarjeta && <p className="text-red-500 text-xs">{errores.idTarjeta}</p>}
            </div>
          )}

          {/* PASO 1 - Motivo */}
          {paso === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a3a6b]">¿Cuál es el motivo del bloqueo?</h2>
              {tarjetaSeleccionada && (
                <div className="bg-red-50 rounded-xl p-3 text-sm border border-red-100">
                  <p className="text-gray-500 text-xs">Tarjeta seleccionada</p>
                  <p className="font-semibold text-red-700">{tarjetaSeleccionada.tipoTarjeta} — **** {tarjetaSeleccionada.numeroTarjeta?.slice(-4)}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {MOTIVOS.map(m => (
                  <label key={m} className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-colors
                    ${form.motivo === m ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'border-gray-200 hover:border-red-300 text-gray-600'}`}>
                    <input type="radio" name="motivo" value={m} onChange={handleChange} className="hidden" />
                    <p className="text-sm font-medium">{m.replace('_', ' ')}</p>
                  </label>
                ))}
              </div>
              {errores.motivo && <p className="text-red-500 text-xs">{errores.motivo}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción adicional (opcional)</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
                  placeholder="Describe brevemente lo ocurrido..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
              </div>
            </div>
          )}

          {/* PASO 2 - Confirmar */}
          {paso === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a3a6b]">Confirma el bloqueo</h2>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Tarjeta</span><span className="font-mono font-bold text-gray-800">**** {tarjetaSeleccionada?.numeroTarjeta?.slice(-4)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tipo</span><span className="text-gray-700">{tarjetaSeleccionada?.tipoTarjeta}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Motivo</span><span className="font-bold text-red-700">{form.motivo.replace('_', ' ')}</span></div>
                {form.descripcion && <div className="flex justify-between"><span className="text-gray-500">Descripción</span><span className="text-gray-700 text-right max-w-xs">{form.descripcion}</span></div>}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                ⚠ Esta acción bloqueará la tarjeta de forma inmediata. Se generará un folio de seguimiento y recibirás una notificación.
              </div>
            </div>
          )}

          {/* PASO 3 - Folio */}
          {paso === 3 && resultado && (
            <div className="space-y-4 text-center">
              <div className="text-5xl mb-2">🔒</div>
              <h2 className="text-xl font-bold text-red-700">¡Tarjeta bloqueada!</h2>
              <p className="text-gray-500 text-sm">Tu tarjeta ha sido bloqueada exitosamente en menos de 30 segundos.</p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-left space-y-2 border border-gray-100">
                <div className="flex justify-between"><span className="text-gray-500">Folio</span><span className="font-mono font-bold text-[#1a3a6b]">{resultado.folio}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Motivo</span><span className="font-bold text-red-700">{resultado.motivo}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Fecha</span><span>{new Date(resultado.createdAt).toLocaleString('es-MX')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">SMS</span><span className={resultado.notificadoSms ? 'text-green-600' : 'text-gray-400'}>{resultado.notificadoSms ? 'Enviado' : 'Pendiente'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span className={resultado.notificadoEmail ? 'text-green-600' : 'text-gray-400'}>{resultado.notificadoEmail ? 'Enviado' : 'Pendiente'}</span></div>
              </div>
              <button onClick={() => navigate(`/clientes/${id}/cuentas`)}
                className="w-full bg-[#1a3a6b] hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition-colors">
                Volver a mis cuentas
              </button>
            </div>
          )}

          {paso < 3 && (
            <button onClick={handleSiguiente} disabled={loading}
              className={`w-full mt-6 font-semibold py-2 rounded-lg transition-colors text-white
                ${paso === 2 ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300' : 'bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-300'}`}>
              {loading ? 'Procesando...' : paso === 2 ? '🔒 Confirmar bloqueo' : 'Siguiente →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
