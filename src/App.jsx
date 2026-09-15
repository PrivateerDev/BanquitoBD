import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './context/RequireAuth'
import Layout from './features/shared/components/Layout'

import Login               from './features/auth/Login'
import Dashboard           from './features/ejecutivo/pages/Dashboard'
import NuevoCliente        from './features/ejecutivo/pages/NuevoCliente'
import CuentasCliente      from './features/ejecutivo/pages/CuentasCliente'
import Transferencia       from './features/ejecutivo/pages/Transferencia'
import SolicitudProducto   from './features/ejecutivo/pages/SolicitudProducto'
import BloqueoTarjeta      from './features/ejecutivo/pages/BloqueoTarjeta'
import Aclaracion          from './features/ejecutivo/pages/Aclaracion'
import ExpedienteCliente   from './features/ejecutivo/pages/ExpedienteCliente'
import EvaluadorDocumentos from './features/evaluador/pages/EvaluadorDocumentos'
import EvaluadorScoring    from './features/evaluador/pages/EvaluadorScoring'
import Caja                from './features/ejecutivo/pages/Caja'
import TransaccionesSospechosas from './features/supervisor/pages/TransaccionesSospechosas'
import DetalleClientePage  from './features/cliente/DetalleClientePage'
import CajasDia            from './features/supervisor/pages/CajasDia'
import AutorizacionesAltoMonto from './features/supervisor/pages/AutorizacionesAltoMonto'
import Anulaciones         from './features/supervisor/pages/Anulaciones'
import ReporteCajeros      from './features/supervisor/pages/ReporteCajeros'
import Arqueos             from './features/supervisor/pages/Arqueos'

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
                  <Route path="/clientes/:id"                   element={<DetalleClientePage />} />
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
                  <Route path="/evaluador/scoring" element={
                    <RequireAuth roles={['EVALUADOR', 'SUPERVISOR']}>
                      <EvaluadorScoring />
                    </RequireAuth>
                  } />
                  <Route path="/ejecutivo/caja" element={
                    <RequireAuth roles={['EJECUTIVO_SUCURSAL']}>
                      <Caja />
                    </RequireAuth>
                  } />
                  <Route path="/supervisor/sospechosas" element={
                    <RequireAuth roles={['SUPERVISOR']}>
                      <TransaccionesSospechosas />
                    </RequireAuth>
                  } />
                  <Route path="/supervisor/cajas" element={
                    <RequireAuth roles={['SUPERVISOR']}>
                      <CajasDia />
                    </RequireAuth>
                  } />
                  <Route path="/supervisor/autorizaciones" element={
                    <RequireAuth roles={['SUPERVISOR']}>
                      <AutorizacionesAltoMonto />
                    </RequireAuth>
                  } />
                  <Route path="/supervisor/anulaciones" element={
                    <RequireAuth roles={['SUPERVISOR']}>
                      <Anulaciones />
                    </RequireAuth>
                  } />
                  <Route path="/supervisor/reporte-cajeros" element={
                    <RequireAuth roles={['SUPERVISOR']}>
                      <ReporteCajeros />
                    </RequireAuth>
                  } />
                  <Route path="/supervisor/arqueos" element={
                    <RequireAuth roles={['SUPERVISOR']}>
                      <Arqueos />
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
