// documentoApi.js — Banquito
// Actor: Ejecutivo de Sucursal (tblempleado) sube docs · Evaluador (tblempleado, rol EVALUADOR) revisa
// Objeto gestionado: tbldocumentocliente → tblcliente, tblsolicitudcredito
// Trazabilidad: RF-EVAL-01 (flujo KYC), CU expdte. — Sección 7 Operaciones
// Usa el api de clienteApi para heredar el interceptor JWT automáticamente

import api from './clienteApi'

// Ejecutivo sube documento KYC del cliente (multipart/form-data)
export const subirDocumento = (idCliente, idEmpleado, tipoDocumento, idSolicitud, archivo) => {
  const form = new FormData()
  form.append('idCliente',     idCliente)
  form.append('idEmpleado',    idEmpleado)
  form.append('tipoDocumento', tipoDocumento)
  if (idSolicitud) form.append('idSolicitud', idSolicitud)
  form.append('archivo', archivo)
  return api.post('/documentos/subir', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// Ejecutivo consulta documentos subidos para un cliente
export const getDocumentosPorCliente  = (idCliente)    => api.get(`/documentos/cliente/${idCliente}`)

// Evaluador (Rol 43) consulta documentos pendientes de revisión
export const getDocumentosPendientes  = ()              => api.get('/documentos/pendientes')

// Evaluador valida o rechaza un documento
export const revisarDocumento         = (idDocumento, data) =>
  api.patch(`/documentos/${idDocumento}/revision`, data)
