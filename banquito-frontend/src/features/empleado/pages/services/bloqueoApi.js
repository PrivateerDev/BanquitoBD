import axios from 'axios'

const BASE = 'http://localhost:8080/api/v1/bloqueos'

export const bloquearTarjeta = (data) => axios.post(BASE, data)
export const getBloqueosPorCliente = (idCliente) => axios.get(`${BASE}/cliente/${idCliente}`)
export const getBloqueoByFolio = (folio) => axios.get(`${BASE}/folio/${folio}`)
