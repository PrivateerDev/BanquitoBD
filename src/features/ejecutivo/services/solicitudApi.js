// solicitudApi.js — Banquito
// Actor: Ejecutivo de Sucursal (tblempleado)
// Objeto gestionado: tblsolicitudcredito → tblcliente
// Trazabilidad: RF-CLI-03 (solicitar producto bancario), CU-CLI-03
// Usa el api de clienteApi para heredar el interceptor JWT automáticamente

import api from './clienteApi'

// RF-CLI-03: Ejecutivo tramita solicitud de producto en nombre del cliente
export const crearSolicitud          = (data)       => api.post('/solicitudes', data)
export const getSolicitudesPorCliente = (idCliente) => api.get(`/solicitudes/cliente/${idCliente}`)
