import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCuentasPorCliente } from '../services/cuentaApi'
import { realizarSPEI } from '../services/transaccionApi'

const PASOS = ['Origen', 'Destino', 'Confirmar', 'Comprobante']

export default function Transferencia() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paso, setPaso] = useState(0)
  const [cuentas, setCuentas] = useState([])
  const [form, setForm] = useState({ idCuenta: '', monto: '', cuentaDestino: '', concepto: '', otp: '' })
  const [errores, setErrores] = useState({})
  const [comprobante, setComprobante] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null)

  useEffect(() => {
    getCuentasPorCliente(id).then(res => setCuentas(res.data))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: null })
    if (e.target.name === 'idCuenta')
      setCuentaSeleccionada(cuentas.find(c => c.idCuenta === Number(e.target.value)))
  }

  const validarPaso = () => {
    const err = {}
    if (paso === 0 && !form.idCuenta) err.idCuenta = 'Selecciona una cuenta'
    if (paso === 1) {
      if (!form.cuentaDestino || form.cuentaDestino.length !== 18) err.cuentaDestino = 'CLABE debe tener 18 dígitos'
      if (!form.monto || Number(form.monto) < 1) err.monto = 'Monto mínimo $1.00'
      if (Number(form.monto) > 10000) err.monto = 'Monto máximo $10,000.00'
    }
    if (paso === 2 && (!form.otp || form.otp.length !== 6)) err.otp = 'OTP debe tener 6 dígitos'
    setErrores(err)
    return Object.keys(err).length === 0
  }

  const handleSiguiente = async () => {
    if (!validarPaso()) return
    if (paso === 2) {
      setLoading(true)
      try {
        const res = await realizarSPEI({
          idCuenta: Number(form.idCuenta), monto: Number(form.monto),
          cuentaDestino: form.cuentaDestino, concepto: form.concepto, otp: form.otp
        })
        setComprobante(res.data); setPaso(3)
      } catch (err) {
        const data = err.response?.data
        if (data?.campos) setErrores(data.campos)
        else setErrores({ general: data?.error || 'Error al procesar transferencia' })
      } finally { setLoading(false) }
    } else { setPaso(paso + 1) }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/clientes/${id}/cuentas`)} className="text-[#1a3a6b] hover:underline text-sm font-medium">← Volver</button>
          <h1 className="text-2xl font-bold text-[#1a3a6b]">Transferencia SPEI</h1>
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

        {errores.general && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">⚠️ {errores.general}</div>}

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

          {/* PASO 0 */}
          {paso === 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a3a6b]">Selecciona tu cuenta origen</h2>
              {cuentas.map(c => (
                <label key={c.idCuenta} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors
                  ${form.idCuenta == c.idCuenta ? 'border-[#1a3a6b] bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input type="radio" name="idCuenta" value={c.idCuenta} onChange={handleChange} className="hidden" />
                  <div>
                    <p className="font-semibold text-gray-800">{c.tipoCuenta}</p>
                    <p className="text-xs text-gray-400 font-mono">{c.clabe}</p>
                  </div>
                  <p className="text-xl font-bold text-[#1a3a6b]">
                    ${Number(c.saldo).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </label>
              ))}
              {errores.idCuenta && <p className="text-red-500 text-xs">{errores.idCuenta}</p>}
            </div>
          )}

          {/* PASO 1 */}
          {paso === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a3a6b]">Destino y monto</h2>
              {cuentaSeleccionada && (
                <div className="bg-blue-50 rounded-xl p-3 text-sm border border-blue-100">
                  <p className="text-gray-500 text-xs">Cuenta origen</p>
                  <p className="font-semibold text-[#1a3a6b]">{cuentaSeleccionada.tipoCuenta} — Saldo: ${Number(cuentaSeleccionada.saldo).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CLABE destino (18 dígitos)</label>
                <input name="cuentaDestino" value={form.cuentaDestino} onChange={handleChange} maxLength={18}
                  placeholder="032180XXXXXXXXXXXX"
                  className={`w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.cuentaDestino ? 'border-red-400' : 'border-gray-300'}`} />
                {errores.cuentaDestino && <p className="text-red-500 text-xs mt-1">{errores.cuentaDestino}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto (máx. $10,000)</label>
                <input name="monto" value={form.monto} onChange={handleChange} type="number" min="1" max="10000"
                  placeholder="0.00"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.monto ? 'border-red-400' : 'border-gray-300'}`} />
                {errores.monto && <p className="text-red-500 text-xs mt-1">{errores.monto}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concepto (opcional)</label>
                <input name="concepto" value={form.concepto} onChange={handleChange} placeholder="Ej: Pago de renta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a3a6b]">Confirma tu transferencia</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm border border-gray-100">
                <div className="flex justify-between"><span className="text-gray-500">Monto</span><span className="font-bold text-[#1a3a6b]">${Number(form.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">CLABE destino</span><span className="font-mono text-gray-700">{form.cuentaDestino}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Concepto</span><span className="text-gray-700">{form.concepto || '—'}</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingresa tu OTP</label>
                <p className="text-xs text-gray-400 mb-2">💡 Para esta demo el OTP es: <strong>123456</strong></p>
                <input name="otp" value={form.otp} onChange={handleChange} maxLength={6}
                  placeholder="••••••" type="password"
                  className={`w-full px-3 py-2 border rounded-lg text-sm text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.otp ? 'border-red-400' : 'border-gray-300'}`} />
                {errores.otp && <p className="text-red-500 text-xs mt-1">{errores.otp}</p>}
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {paso === 3 && comprobante && (
            <div className="space-y-4 text-center">
              <div className="text-5xl mb-2">✅</div>
              <h2 className="text-xl font-bold text-green-700">¡Transferencia exitosa!</h2>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-left space-y-2 border border-gray-100">
                <div className="flex justify-between"><span className="text-gray-500">Folio</span><span className="font-mono font-bold text-[#1a3a6b]">TX-{comprobante.idTransaccion}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Monto</span><span className="font-bold text-gray-800">${Number(comprobante.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Saldo anterior</span><span>${Number(comprobante.saldoAntes).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Saldo actual</span><span className="font-bold text-[#1a3a6b]">${Number(comprobante.saldoDespues).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">CLABE destino</span><span className="font-mono text-xs">{comprobante.cuentaDestino}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Fecha</span><span>{new Date(comprobante.createdAt).toLocaleString('es-MX')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Estado</span><span className="text-green-600 font-semibold">{comprobante.estado}</span></div>
              </div>
              <button onClick={() => navigate(`/clientes/${id}/cuentas`)}
                className="w-full bg-[#1a3a6b] hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition-colors">
                Volver a mis cuentas
              </button>
            </div>
          )}

          {paso < 3 && (
            <button onClick={handleSiguiente} disabled={loading}
              className="w-full mt-6 bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition-colors">
              {loading ? 'Procesando...' : paso === 2 ? 'Confirmar transferencia' : 'Siguiente →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
