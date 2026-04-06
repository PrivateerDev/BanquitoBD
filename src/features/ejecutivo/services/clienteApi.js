import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor — agrega el token JWT en cada request automaticamente
api.interceptors.request.use((config) => {
  const session = localStorage.getItem('banquito_session')
  if (session) {
    try {
      const { token } = JSON.parse(session)
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch (_) {}
  }
  return config
})

export const getClientes       = ()    => api.get('/clientes')
export const getClienteById    = (id)  => api.get(`/clientes/${id}`)
export const getClienteByEmail = (e)   => api.get(`/clientes/email/${e}`)

// Endpoints nuevos Ronda 2
export const getProductosCliente  = (id)      => api.get(`/clientes/${id}/productos`)
export const getMovimientosCuenta = (idCuenta) => api.get(`/cuentas/${idCuenta}/movimientos`)
export const getCuentasPorCliente = (id)       => api.get(`/cuentas/cliente/${id}`)

export default api
