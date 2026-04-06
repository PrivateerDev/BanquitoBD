import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' }
})

export const loginEmpleado = (email, password) =>
  api.post('/empleados/login', { email, password })
