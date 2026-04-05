import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalClientes: 0, totalSaldos: 0, activos: 0 });
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    setStats({ totalClientes: 3, totalSaldos: 24200, activos: 2 });
    setClientes([
      { id: 1, nombre: 'Ana García', rfc: 'GARA850101', sucursal: 'Centro', saldo: 12500, activo: true },
      { id: 2, nombre: 'Juan López', rfc: 'LOPJ750202', sucursal: 'Polanco', saldo: 8500, activo: true },
      { id: 3, nombre: 'María Rodríguez', rfc: 'RODM650303', sucursal: 'Reforma', saldo: 3200, activo: false }
    ]);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Panel de Clientes Banquito</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Total Clientes</CardTitle>
            <Users className="h-8 w-8 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Saldos Totales</CardTitle>
            <DollarSign className="h-8 w-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${stats.totalSaldos.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Activos</CardTitle>
            <TrendingUp className="h-8 w-8 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{stats.activos}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientes.map(cliente => (
              <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h3 className="font-bold text-lg">{cliente.nombre}</h3>
                  <p className="text-sm text-gray-600">RFC: {cliente.rfc} | {cliente.sucursal}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${cliente.saldo.toLocaleString()}
                  </div>
                  <Badge variant={cliente.activo ? 'default' : 'secondary'}>
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
