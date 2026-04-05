// api.js — Banquito Frontend
// Centraliza todos los llamados al backend (puerto 8081)
// Trazabilidad de endpoints documentada por RF/RNF

const BASE_URL = 'http://localhost:8081/api/v1'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `Error ${res.status}`)
  }
  return res.json()
}

// ── Empleados ────────────────────────────────────────────────────────────────
export const loginEmpleado = (body) =>
  request('/empleados/login', { method: 'POST', body: JSON.stringify(body) })

// ── Clientes ─────────────────────────────────────────────────────────────────
export const listarClientes    = ()   => request('/clientes')
export const buscarClientePorId = (id) => request(`/clientes/${id}`)

// ── Cuentas ──────────────────────────────────────────────────────────────────
export const cuentasPorCliente = (idCliente) => request(`/cuentas/cliente/${idCliente}`)
export const crearCuenta       = (body)       => request('/cuentas', { method: 'POST', body: JSON.stringify(body) })

// ── Solicitudes de crédito ───────────────────────────────────────────────────
export const crearSolicitud = (body) =>
  request('/solicitudes', { method: 'POST', body: JSON.stringify(body) })

// ── Productos del cliente (cuentas + solicitudes activos/finalizados) ─────────
// Trazabilidad: RF-CLI-01, RF-CLI-03 · CU-CLI-01
export const productosCliente = (idCliente) =>
  request(`/clientes/${idCliente}/productos`)

// ── Movimientos de una cuenta específica ─────────────────────────────────────
// Trazabilidad: RF-CLI-02, RF-CLI-08 · RNF-CLI-02 (<5s) · RNF-CLI-08 (fraude)
export const movimientosCuenta = (idCuenta) =>
  request(`/cuentas/${idCuenta}/movimientos`)

// ── Movimientos consolidados de todas las cuentas del cliente ────────────────
// Trazabilidad: RF-CLI-01, RF-CLI-02 · CU-CLI-01
export const movimientosCliente = (idCliente) =>
  request(`/clientes/${idCliente}/movimientos`)
