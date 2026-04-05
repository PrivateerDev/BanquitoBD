import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginEmpleado } from '../services/authApi'
import { useAuth } from '../../../context/AuthContext'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginEmpleado(email, password)
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo — branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#1a3a6b] px-14 py-12">
        <div className="flex items-center gap-4">
          <img src="/logoBanquito.jpeg" alt="Banquito"
            className="w-16 h-16 rounded-2xl object-cover shadow-xl border-2 border-blue-400" />
          <div>
            <p className="text-white font-bold text-2xl tracking-widest">BANQUITO</p>
            <p className="text-blue-300 text-xs tracking-wide">Banca en Línea</p>
          </div>
        </div>

        <div>
          <h2 className="text-white text-4xl font-bold leading-snug mb-4">
            Panel de<br />Atención<br />al Cliente
          </h2>
          <p className="text-blue-300 text-sm leading-relaxed max-w-xs">
            Acceso exclusivo para ejecutivos de sucursal. Gestiona clientes, cuentas,
            transferencias y más desde un solo lugar.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {[
              { icon: '👥', text: 'Registro y gestión de clientes' },
              { icon: '💳', text: 'Cuentas y movimientos en tiempo real' },
              { icon: '💸', text: 'Transferencias SPEI' },
              { icon: '🔒', text: 'Bloqueo de tarjetas y aclaraciones' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-blue-200 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-500 text-xs">
          BANQUITO © 2026 · CNBV · CONDUSEF · Atención 800-226-7886
        </p>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 relative overflow-hidden px-8 py-12">

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100 rounded-full opacity-30 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Logo mobile */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <img src="/logoBanquito.jpeg" alt="Banquito"
            className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-[#1a3a6b]" />
          <div>
            <p className="text-[#1a3a6b] font-bold text-xl tracking-widest">BANQUITO</p>
            <p className="text-gray-400 text-xs">Panel Ejecutivo de Sucursal</p>
          </div>
        </div>

        <div className="w-full max-w-md relative z-10">

          {/* Card principal */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 px-10 py-10">

            {/* Header del form */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1a3a6b] text-xs font-semibold
                px-3 py-1.5 rounded-full mb-4 border border-blue-100">
                🏦 Ejecutivo de Sucursal · tblempleado
              </div>
              <h1 className="text-3xl font-bold text-[#1a3a6b]">Bienvenido</h1>
              <p className="text-gray-400 text-sm mt-1">Ingresa tus credenciales para continuar</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3
                rounded-xl mb-6 text-sm flex items-center gap-2">
                <span className="text-base">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo institucional
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-300 text-base select-none">✉</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nombre@banquito.mx"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                      bg-gray-50 focus:bg-white focus:outline-none focus:ring-2
                      focus:ring-[#1a3a6b] focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Contraseña
                  </label>
                  <span className="text-xs text-[#1a3a6b] cursor-pointer hover:underline">
                    ¿Olvidaste tu acceso?
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-300 text-base select-none">🔑</span>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                      bg-gray-50 focus:bg-white focus:outline-none focus:ring-2
                      focus:ring-[#1a3a6b] focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a3a6b] hover:bg-blue-900 disabled:bg-blue-300
                  text-white font-semibold py-3.5 rounded-xl transition-all shadow-md
                  hover:shadow-lg active:scale-[0.98] text-base mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Verificando identidad...
                  </span>
                ) : 'Iniciar sesión →'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">CUENTAS DE PRUEBA</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Cuentas demo */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { email: 'laura.ramirez@banquito.mx',  rol: 'Ejecutivo Sucursal', inicial: 'L' },
                { email: 'marco.sanchez@banquito.mx',   rol: 'Ejecutivo Sucursal', inicial: 'M' },
                { email: 'admin@banquito.mx',          rol: 'Supervisor',         inicial: 'A' },
                { email: 'carlos.mendoza@banquito.mx', rol: 'Evaluador',          inicial: 'C' },
              ].map(c => (
                <button key={c.email}
                  onClick={() => { setEmail(c.email); setPassword(c.email.includes('carlos') ? 'eval2026' : 'banquito2026') }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100
                    hover:border-blue-200 hover:bg-blue-50 transition-all text-left group">
                  <div className="w-8 h-8 rounded-full bg-[#1a3a6b] text-white text-xs
                    font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700">
                    {c.inicial}
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[#1a3a6b] font-semibold">{c.email}</p>
                    <p className="text-xs text-gray-400">{c.rol}</p>
                  </div>
                  <span className="ml-auto text-xs text-gray-300 group-hover:text-blue-400">→</span>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-gray-300 mt-4">
              Password: <span className="font-semibold text-gray-400">banquito2026</span>
              {' '}· Click en cualquier cuenta para autocompletar
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Uso exclusivo para personal autorizado · CNBV · NOM-151
          </p>
        </div>
      </div>
    </div>
  )
}
