import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

// Menú base: sólo rutas independientes de cliente
// Las acciones por cliente (cuentas, transferencia, bloqueo, etc.)
// se navegan desde el Dashboard o DetalleClientePage — no van en el sidebar global.
const MENU_EJECUTIVO = [
  { icon: '🏠', label: 'Dashboard',        path: '/' },
  { icon: '👤', label: 'Registrar Cliente', path: '/clientes/nuevo' },
]

const MENU_EVALUADOR = [
  { icon: '🔍', label: 'Evaluador Docs',    path: '/evaluador/documentos' },
  { icon: '⚠',  label: 'Sospechosas',       path: '/supervisor/sospechosas' },
]

const MENU_SUPERVISOR = [
  { icon: '🏠', label: 'Dashboard',         path: '/' },
  { icon: '👤', label: 'Registrar Cliente', path: '/clientes/nuevo' },
  { icon: '🔍', label: 'Evaluador Docs',    path: '/evaluador/documentos' },
  { icon: '⚠',  label: 'Sospechosas',       path: '/supervisor/sospechosas' },
]

function getMenu(rol) {
  if (rol === 'EVALUADOR')  return MENU_EVALUADOR
  if (rol === 'SUPERVISOR') return MENU_SUPERVISOR
  return MENU_EJECUTIVO
}

// Etiqueta de trazabilidad por rol — tabla y referencia de documentación
const ROL_META = {
  EJECUTIVO_SUCURSAL: { tabla: 'tblempleado', ref: 'Sección 7 — Operaciones' },
  SUPERVISOR:         { tabla: 'tblempleado', ref: 'Sección 7 — Supervisión' },
  EVALUADOR:          { tabla: 'tblempleado', ref: 'Rol 43 — Evaluación Bancaria' },
}

export default function Layout({ children }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { empleado, logout } = useAuth()

  const rol       = empleado?.rol || ''
  const menuItems = getMenu(rol)
  const meta      = ROL_META[rol] || { tabla: 'tblempleado', ref: '' }

  const handleLogout = () => { logout(); navigate('/login') }
  const inicial = empleado?.nombre?.charAt(0).toUpperCase() || 'E'

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* ── Navbar ── */}
      <nav className="bg-[#1a3a6b] text-white px-6 py-3 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logoBanquito.jpeg" alt="Banquito" className="w-12 h-12 rounded-xl object-cover shadow-md" />
          <div>
            <p className="font-bold text-xl leading-none tracking-wide">BANQUITO</p>
            {/* Corregido: nombre del sistema, no del cliente externo */}
            <p className="text-blue-300 text-xs">Panel Ejecutivo de Sucursal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{empleado?.nombre} {empleado?.apellidoPat}</p>
            {/* Muestra rol + tabla de origen para trazabilidad */}
            <p className="text-blue-300 text-xs">
              {rol.replace(/_/g, ' ')} · {meta.tabla} · {empleado?.sucursalNombre}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center font-bold text-sm shadow border-2 border-blue-400">
            {inicial}
          </div>
          <button onClick={handleLogout}
            className="text-blue-300 hover:text-white text-xs border border-blue-700 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-colors">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-56 flex-shrink-0 bg-[#1a3a6b] text-white flex flex-col py-6 px-4 gap-1 shadow-xl">
          <p className="text-blue-400 text-xs uppercase font-semibold px-3 mb-2 tracking-widest">Menú</p>
          {menuItems.map(item => {
            const active = location.pathname === item.path
            return (
              <div key={item.label} onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all
                  ${active ? 'bg-blue-700 text-white font-semibold' : 'text-blue-200 hover:bg-blue-900 hover:text-white'}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            )
          })}

          {/* Trazabilidad del rol activo */}
          <div className="mt-4 mx-3 px-3 py-2.5 rounded-lg bg-blue-950 border border-blue-800">
            <p className="text-blue-400 text-[10px] uppercase font-semibold mb-1">Sesión activa</p>
            <p className="text-white text-xs font-mono">{meta.tabla}</p>
            <p className="text-blue-400 text-[10px] mt-0.5">{meta.ref}</p>
          </div>

          <div className="mt-auto pt-6 border-t border-blue-900">
            <div className="flex items-center gap-3 px-3 py-2 text-blue-300 text-xs">
              <img src="/logoBanquito.jpeg" alt="logo" className="w-8 h-8 rounded-lg object-cover" />
              <div>
                <p className="font-semibold text-white text-xs">BANQUITO</p>
                <p>© 2026 · CNBV</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Contenido principal ── */}
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
          <p className="text-center text-gray-400 text-xs py-6">
            BANQUITO · {rol.replace(/_/g, ' ')} · {meta.tabla} © 2026 · CNBV · CONDUSEF · Atención 800-226-7886
          </p>
        </main>
      </div>
    </div>
  )
}
