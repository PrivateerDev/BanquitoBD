import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/clienteApi'

const camposIniciales = {
  idSucursal: 1, nombre: '', apellidoPat: '', apellidoMat: '',
  rfc: '', curp: '', email: '', telefono: '', pin: ''
}

function Input({ label, name, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function NuevoCliente() {
  const [form, setForm] = useState(camposIniciales)
  const [errores, setErrores] = useState({})
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setExito(null)
    try {
      const res = await api.post('/clientes', { ...form, idSucursal: Number(form.idSucursal) })
      setExito(`Cliente ${res.data.nombre} ${res.data.apellidoPat} creado con ID #${res.data.idCliente}`)
      setForm(camposIniciales); setErrores({})
    } catch (err) {
      const data = err.response?.data
      if (data?.campos) setErrores(data.campos)
      else setErrores({ general: data?.error || 'Error al crear cliente' })
    } finally { setLoading(false) }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="text-[#1a3a6b] hover:underline text-sm font-medium">← Volver</button>
          <h1 className="text-2xl font-bold text-[#1a3a6b]">Nuevo Cliente</h1>
        </div>

        {exito && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">✅ {exito}</div>}
        {errores.general && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">⚠️ {errores.general}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-100">
          <h2 className="text-base font-semibold text-[#1a3a6b] border-b border-gray-100 pb-2">Datos Personales</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" name="nombre" placeholder="Ana" value={form.nombre} onChange={handleChange} error={errores.nombre} />
            <Input label="Apellido Paterno" name="apellidoPat" placeholder="García" value={form.apellidoPat} onChange={handleChange} error={errores.apellidoPat} />
          </div>
          <Input label="Apellido Materno" name="apellidoMat" placeholder="López (opcional)" value={form.apellidoMat} onChange={handleChange} error={errores.apellidoMat} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="RFC" name="rfc" placeholder="GALA900101ABC" value={form.rfc} onChange={handleChange} error={errores.rfc} />
            <Input label="CURP" name="curp" placeholder="GALA900101MDFXXX01" value={form.curp} onChange={handleChange} error={errores.curp} />
          </div>

          <h2 className="text-base font-semibold text-[#1a3a6b] border-b border-gray-100 pb-2 pt-2">Contacto y Acceso</h2>
          <Input label="Email" name="email" type="email" placeholder="ana@email.com" value={form.email} onChange={handleChange} error={errores.email} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Teléfono (10 dígitos)" name="telefono" placeholder="5512345678" value={form.telefono} onChange={handleChange} error={errores.telefono} />
            <Input label="PIN (6 dígitos)" name="pin" type="password" placeholder="••••••" value={form.pin} onChange={handleChange} error={errores.pin} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            {loading ? 'Creando...' : 'Crear Cliente'}
          </button>
        </form>
      </div>
    </div>
  )
}
