import api from './clienteApi'

export const crearSolicitud = (data) => api.post('/solicitudes', data)
export const getSolicitudesPorCliente = (idCliente) => api.get(`/solicitudes/cliente/${idCliente}`)
