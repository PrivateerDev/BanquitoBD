import { useState, useEffect } from 'react';
import { crearAclaracion, obtenerAclaracionesPorCliente } from '../services/aclaracionApi';

const ID_CLIENTE = 1;

const TIPOS = [
  'CARGO_NO_RECONOCIDO',
  'DEVOLUCION',
  'DUPLICADO',
  'FRAUDE',
  'OTRO',
];

export default function Aclaracion() {
  const [aclaraciones, setAclaraciones] = useState([]);
  const [form, setForm] = useState({
    idTransaccion: '',
    tipoAclaracion: TIPOS[0],
    descripcion: '',
    monto: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [errores, setErrores] = useState({});

  const cargar = async () => {
    try {
      const data = await obtenerAclaracionesPorCliente(ID_CLIENTE);
      setAclaraciones(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { cargar(); }, []);

  const validar = () => {
    const e = {};
    const idTx = parseInt(form.idTransaccion);
    if (!form.idTransaccion || isNaN(idTx) || idTx <= 0)
      e.idTransaccion = 'Ingresa un ID de transacción válido (número mayor a 0)';
    if (!form.descripcion.trim() || form.descripcion.trim().length < 10)
      e.descripcion = 'La descripción debe tener al menos 10 caracteres';
    if (form.monto !== '' && (isNaN(parseFloat(form.monto)) || parseFloat(form.monto) <= 0))
      e.monto = 'El monto debe ser mayor a 0';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }
    setErrores({});
    setEnviando(true);
    setMensaje(null);
    try {
      await crearAclaracion({
        idCliente: ID_CLIENTE,
        idTransaccion: parseInt(form.idTransaccion),
        tipoAclaracion: form.tipoAclaracion,
        descripcion: form.descripcion.trim(),
        monto: form.monto ? parseFloat(form.monto) : null,
      });
      setMensaje({ tipo: 'ok', texto: 'Aclaración registrada correctamente.' });
      setForm({ idTransaccion: '', tipoAclaracion: TIPOS[0], descripcion: '', monto: '' });
      cargar();
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error al registrar la aclaración. Verifica que el ID de transacción exista.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Aclaraciones</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
        <h3 className="text-lg font-semibold">Nueva aclaración</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ID Transacción */}
          <div>
            <label className="block text-sm font-medium mb-1">ID de Transacción</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ej. 1042 — lo encuentras en tu historial de movimientos"
              className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-400 ${errores.idTransaccion ? 'border-red-500' : ''}`}
              value={form.idTransaccion}
              onChange={e => setForm({ ...form, idTransaccion: e.target.value.replace(/\D/g, '') })}
            />
            {errores.idTransaccion
              ? <p className="text-red-500 text-xs mt-1">{errores.idTransaccion}</p>
              : <p className="text-gray-400 text-xs mt-1">📋 Consúltalo en <span className="font-medium">Cuentas → Movimientos</span></p>
            }
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de aclaración</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.tipoAclaracion}
              onChange={e => setForm({ ...form, tipoAclaracion: e.target.value })}
            >
              {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium mb-1">Monto en disputa <span className="text-gray-400 font-normal">(opcional)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00 — monto del cargo que disputas"
                className={`w-full border rounded-lg pl-6 pr-3 py-2 text-sm placeholder-gray-400 ${errores.monto ? 'border-red-500' : ''}`}
                value={form.monto}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  setForm({ ...form, monto: val });
                }}
              />
            </div>
            {errores.monto && <p className="text-red-500 text-xs mt-1">{errores.monto}</p>}
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Descripción del problema</label>
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Describe con detalle qué ocurrió. Ej: El día 20 de marzo aparece un cargo de $1,500 en un comercio que no reconozco..."
              className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-400 ${errores.descripcion ? 'border-red-500' : ''}`}
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
            />
            <div className="flex justify-between">
              {errores.descripcion
                ? <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
                : <p className="text-gray-400 text-xs mt-1">Mínimo 10 caracteres</p>
              }
              <p className="text-gray-400 text-xs mt-1">{form.descripcion.length}/500</p>
            </div>
          </div>
        </div>

        {mensaje && (
          <p className={`text-sm font-medium ${mensaje.tipo === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : 'Registrar aclaración'}
        </button>
      </form>

      {/* Historial */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mis aclaraciones</h3>
        {aclaraciones.length === 0 ? (
          <p className="text-gray-500 text-sm">No tienes aclaraciones registradas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Folio</th>
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Monto</th>
                <th className="pb-2">Estado</th>
                <th className="pb-2">Plazo regulatorio</th>
              </tr>
            </thead>
            <tbody>
              {aclaraciones.map(a => (
                <tr key={a.idAclaracion} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{a.folio}</td>
                  <td className="py-2">{a.tipoAclaracion}</td>
                  <td className="py-2">{a.monto ? `$${a.monto}` : '—'}</td>
                  <td className="py-2">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                      {a.estado}
                    </span>
                  </td>
                  <td className="py-2">{a.plazoRegulatorio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
