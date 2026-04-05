import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' }
})

export const getClientes = () => api.get('/clientes')
export const getClienteById = (id) => api.get(`/clientes/${id}`)
export const getClienteByEmail = (email) => api.get(`/clientes/email/${email}`)

export default api
