import api from './clienteApi'

export const getTransaccionesPorCuenta = (idCuenta) => api.get(`/transacciones/cuenta/${idCuenta}`)
export const realizarSPEI = (data) => api.post('/transacciones/spei', data)
