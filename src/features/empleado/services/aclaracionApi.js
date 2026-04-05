const BASE_URL = '/api/v1/aclaraciones';

export const crearAclaracion = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear aclaración');
  return res.json();
};

export const obtenerAclaracionesPorCliente = async (idCliente) => {
  const res = await fetch(`${BASE_URL}/cliente/${idCliente}`);
  if (!res.ok) throw new Error('Error al obtener aclaraciones');
  return res.json();
};

export const obtenerAclaracionPorFolio = async (folio) => {
  const res = await fetch(`${BASE_URL}/folio/${folio}`);
  if (!res.ok) throw new Error('Aclaración no encontrada');
  return res.json();
};
