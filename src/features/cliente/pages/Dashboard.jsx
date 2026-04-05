// features/cliente/pages/Dashboard.jsx
// Archivo de referencia — dashboard alternativo (no enrutado actualmente)
// El dashboard principal del ejecutivo está en features/empleado/pages/Dashboard.jsx
// Este componente puede activarse como vista de resumen por cliente en el futuro.

import React, { useState, useEffect } from 'react'

const Dashboard = () => {
  const [cuentas, setCuentas] = useState([])
  const [movimientos, setMovimientos] = useState([])

  useEffect(() => {
    setCuentas([
      { id: 1, numero: '****1234', saldo: 12500.50, tipo: 'Ahorros', sucursal: 'Centro' },
      { id: 2, numero: '****5678', saldo: 8500.00,  tipo: 'Corriente', sucursal: 'Polanco' }
    ])
    setMovimientos([
      { id: 1, descripcion: 'Depósito nómina',         monto:  5000, tipo: 'INGRESO', fecha: '2026-03-27' },
      { id: 2, descripcion: 'Retiro cajero',            monto:  -250, tipo: 'EGRESO',  fecha: '2026-03-28' },
      { id: 3, descripcion: 'Transferencia recibida',   monto:  1000, tipo: 'INGRESO', fecha: '2026-03-28' }
    ])
  }, [])

  const saldoTotal = cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#1a3a6b]">Resumen de Cliente</h1>
      <div className="bg-[#1a3a6b] text-white rounded-2xl p-6">
        <p className="text-sm opacity-80">Saldo total consolidado</p>
        <p className="text-4xl font-bold mt-1">${saldoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
      </div>
    </div>
  )
}

export default Dashboard
