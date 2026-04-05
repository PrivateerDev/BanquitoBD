import { useNavigate, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: '🏠', label: 'Dashboard',      path: '/' },
    { icon: '👥', label: 'Clientes',       path: '/clientes/nuevo' },
    { icon: '💳', label: 'Cuentas',        path: '/clientes/1/cuentas' },
    { icon: '💸', label: 'Transferencias', path: '/clientes/1/transferencia' },
    { icon: '📋', label: 'Solicitudes',    path: '/clientes/1/solicitud' },
    { icon: '⚠',  label: 'Aclaraciones',  path: '/clientes/1/aclaracion' },
    { icon: '🔒', label: 'Bloqueos',       path: '/clientes/1/bloqueo' },
    { icon: '⚙',  label: 'Configuración', path: '/' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <nav className="bg-[#1a3a6b] text-white px-6 py-3 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logoBanquito.jpeg" alt="Banquito" className="w-12 h-12 rounded-xl object-cover shadow-md" />
          <div>
            <p className="font-bold text-xl leading-none tracking-wide">BANQUITO</p>
            <p className="text-blue-300 text-xs">Banca en Línea</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['Inicio','Cuentas','Tarjetas','Créditos','Sucursales'].map(item => (
            <span key={item} className="text-blue-200 hover:text-white cursor-pointer transition-colors">{item}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">Banca en Línea</p>
            <p className="text-blue-300 text-xs">Cliente · Rol 51</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm shadow">A</div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 bg-[#1a3a6b] text-white flex flex-col py-6 px-4 gap-1 shadow-xl">
          <p className="text-blue-400 text-xs uppercase font-semibold px-3 mb-2 tracking-widest">Menú</p>
          {menuItems.map(item => {
            const active = location.pathname === item.path
            return (
              <div key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all
                  ${active ? 'bg-blue-600 text-white font-semibold' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            )
          })}
          <div className="mt-auto pt-6 border-t border-blue-800">
            <div className="flex items-center gap-3 px-3 py-2 text-blue-300 text-xs">
              <img src="/logoBanquito.jpeg" alt="logo" className="w-8 h-8 rounded-lg object-cover" />
              <div>
                <p className="font-semibold text-white text-xs">BANQUITO</p>
                <p>© 2026 · CNBV</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
          <p className="text-center text-gray-400 text-xs py-6">
            BANQUITO Banca en Línea © 2026 · CNBV · CONDUSEF · Atención 800-226-7886
          </p>
        </main>

      </div>
    </div>
  )
}
