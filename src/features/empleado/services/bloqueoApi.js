// bloqueoApi.js — Banquito
// Actor: Ejecutivo de Sucursal (tblempleado)
// Objeto gestionado: tblbloqueotarjeta → tbltarjeta → tblcliente
// Trazabilidad: RF-CLI-05 (bloqueo ≤30 s), CU-CLI-04
// Usa el api de clienteApi para heredar el interceptor JWT automáticamente

import api from './clienteApi'

const BASE = '/bloqueos'

// RF-CLI-05: Ejecutivo bloquea tarjeta del cliente en ≤30 segundos
export const bloquearTarjeta       = (data)       => api.post(BASE, data)
export const getBloqueosPorCliente = (idCliente)  => api.get(`${BASE}/cliente/${idCliente}`)
export const getBloqueoByFolio     = (folio)      => api.get(`${BASE}/folio/${folio}`)
