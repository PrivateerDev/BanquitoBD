import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './context/RequireAuth'
import Layout from './features/empleado/components/Layout'

// Páginas originales — NO tocar
import Login               from './features/empleado/pages/Login'
import Dashboard           from './features/empleado/pages/Dashboard'
import NuevoCliente        from './features/empleado/pages/NuevoCliente'
import CuentasCliente      from './features/empleado/pages/CuentasCliente'
import Transferencia       from './features/empleado/pages/Transferencia'
import SolicitudProducto   from './features/empleado/pages/SolicitudProducto'
import BloqueoTarjeta      from './features/empleado/pages/BloqueoTarjeta'
import Aclaracion          from './features/empleado/pages/Aclaracion'
import ExpedienteCliente   from './features/empleado/pages/ExpedienteCliente'
import EvaluadorDocumentos         from './features/empleado/pages/EvaluadorDocumentos'
import TransaccionesSospechosas from './features/empleado/pages/TransaccionesSospechosas'

// Páginas NUEVAS — productos y movimientos
import DetalleClientePage  from './features/cliente/DetalleClientePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/*" element={
            <RequireAuth>
              <Layout>
                <Routes>
                  <Route path="/"                               element={<Dashboard />} />
                  <Route path="/clientes/nuevo"                 element={<NuevoCliente />} />

                  {/* ── NUEVA: detalle unificado con tabs Productos + Movimientos ── */}
                  <Route path="/clientes/:id"                   element={<DetalleClientePage />} />

                  {/* Rutas legadas originales — siguen funcionando */}
                  <Route path="/clientes/:id/cuentas"           element={<CuentasCliente />} />
                  <Route path="/clientes/:id/transferencia"     element={<Transferencia />} />
                  <Route path="/clientes/:id/solicitud"         element={<SolicitudProducto />} />
                  <Route path="/clientes/:id/bloqueo"           element={<BloqueoTarjeta />} />
                  <Route path="/clientes/:id/aclaracion"        element={<Aclaracion />} />
                  <Route path="/clientes/:id/expediente"        element={<ExpedienteCliente />} />

                  <Route path="/evaluador/documentos" element={
                    <RequireAuth roles={['EVALUADOR', 'SUPERVISOR']}>
                      <EvaluadorDocumentos />
                    </RequireAuth>
                  } />

                  <Route path="/supervisor/sospechosas" element={
                    <RequireAuth roles={['SUPERVISOR']}>
                      <TransaccionesSospechosas />
                    </RequireAuth>
                  } />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </RequireAuth>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
