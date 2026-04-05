import api from './clienteApi'

export const getTransaccionesPorCuenta = (idCuenta) => api.get(`/transacciones/cuenta/${idCuenta}`)
export const realizarSPEI = (data) => api.post('/transacciones/spei', data)

// ── RF-CLI-08 / RNF-CLI-08: Transacciones sospechosas ────────────────────────
export const getSospechosas = ()    => api.get('/transacciones/sospechosas')
export const marcarRevisada = (id)  => api.patch(`/transacciones/${id}/revisar`)
