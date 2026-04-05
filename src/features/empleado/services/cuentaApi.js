import api from './clienteApi'

export const getCuentasPorCliente = (idCliente) => api.get(`/cuentas/cliente/${idCliente}`)
export const crearCuenta = (data) => api.post('/cuentas', data)
