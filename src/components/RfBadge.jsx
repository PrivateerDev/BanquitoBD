// RfBadge.jsx — Banquito
// Trazabilidad RF/RNF/CU con referencias exactas al esquema de BD
// Actor principal: Ejecutivo de Sucursal (tblempleado) gestiona tblcliente y sus relaciones
// Esquema: banquito_db · PostgreSQL 16 · 7 migraciones Flyway (V1–V7)

const RF_DESCRIPTIONS = {
  // ── Módulo Cliente — operado por Ejecutivo de Sucursal ──────────────────
  'RF-CLI-01':  'Ejecutivo consulta saldos y productos → tblcuenta (idx_cuenta_cliente_estado) + tbltarjeta · FK tblsucursal',
  'RF-CLI-02':  'Ejecutivo registra operación financiera → tbltransaccion (chk_tx_tipoop, chk_tx_estado, chk_tx_canal)',
  'RF-CLI-03':  'Ejecutivo tramita solicitud → tblsolicitudcredito (chk_solicitud_tipoproducto, chk_solicitud_estado) · tblcliente FK tblsucursal',
  'RF-CLI-05':  'Ejecutivo bloquea medio de pago → tblbloqueotarjeta (folio UNIQUE BLQ-YYYY-NNNN) · ≤30 s',
  'RF-CLI-06':  'Ejecutivo abre aclaración → tblaclaracion (chk_plazo: apertura + 45 días CONDUSEF)',
  'RF-CLI-08':  'Sistema genera comprobante → tbltransaccion.comprobante_generado (BOOLEAN DEFAULT FALSE)',

  // ── No Funcionales ───────────────────────────────────────────────────────
  'RNF-CLI-02': 'Consultas < 5 s → idx_tx_cuenta_fecha (idcuenta, createdat DESC) · V6__indices_rendimiento',
  'RNF-CLI-03': 'Validación OTP → tbltransaccion.otpvalidado (SMALLINT DEFAULT 0)',
  'RNF-CLI-08': 'Detección fraude → tbltransaccion.sospechosa (BOOLEAN) + idx_tx_sospechosa (WHERE sospechosa=TRUE)',
  'RNF-ES-01':  'Índices de rendimiento → idx_empleado_rol, idx_empleado_sucursal · V6__indices_rendimiento',

  // ── Casos de Uso ─────────────────────────────────────────────────────────
  'CU-CLI-01':  'CU: Ejecutivo consulta productos y movimientos del cliente (tblcuenta + tbltransaccion)',
  'CU-CLI-02':  'CU: Ejecutivo realiza SPEI → tbltransaccion FK tblcuenta + FK tblempleado (idempleado_registro)',
  'CU-CLI-03':  'CU: Ejecutivo tramita solicitud → tblsolicitudcredito FK tblcliente · folio UNIQUE SOL-YYYY-NNNN',
  'CU-CLI-04':  'CU: Ejecutivo bloquea tarjeta → tblbloqueotarjeta FK tbltarjeta FK tblcliente · TRIGGER after_update',
  'CU-CLI-05':  'CU: Ejecutivo registra aclaración → tblaclaracion FK tbltransaccion FK tblcliente',

  // ── Módulo Evaluación / KYC ──────────────────────────────────────────────
  'RF-EVAL-01': 'Evaluador (Rol 43) revisa expediente → tbldocumentocliente (idx_doc_cliente, idx_doc_estado) · FK tblempleado revisor',
}

export function RfBadge({ code }) {
  const desc   = RF_DESCRIPTIONS[code] || code
  const isRnf  = code.startsWith('RNF')
  const isCu   = code.startsWith('CU')
  const isEval = code.startsWith('RF-EVAL')

  const style = isRnf
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : isCu
    ? 'bg-green-50 text-green-700 border-green-200'
    : isEval
    ? 'bg-purple-50 text-purple-700 border-purple-200'
    : 'bg-blue-50 text-blue-700 border-blue-200'

  return (
    <span
      title={desc}
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border cursor-help select-none ${style}`}
    >
      {code}
    </span>
  )
}

export function TrazabilidadBar({ codes = [], label }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-500 mb-4">
      <span className="font-semibold text-gray-700 mr-1">📋 Trazabilidad:</span>
      {label && <span className="text-gray-500 mr-2 font-mono">{label}</span>}
      <span className="text-gray-300 mr-1">—</span>
      {codes.map(c => <RfBadge key={c} code={c} />)}
    </div>
  )
}
