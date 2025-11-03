import { crearTarea } from './tarea.js';

export const agregarTarea = (lista, titulo, desc = '', venc = null, dif = 1) => {
  const nueva = crearTarea(titulo, desc, venc, dif);
  return [...lista, nueva];
};

export const filtrarTareas = (lista, filtro = 'todas') => {
  const f = filtro.toLowerCase();
  return lista.filter(t => f === 'todas' || t.estado.toLowerCase() === f);
};

export const ordenarTareas = (lista, criterio) => {
  const copia = [...lista];
  if (criterio === 'titulo') return copia.sort((a, b) => a.titulo.localeCompare(b.titulo));
  if (criterio === 'vencimiento') return copia.sort((a, b) => 
    (!a.vencimiento ? 1 : !b.vencimiento ? -1 : a.vencimiento - b.vencimiento)
  );
  if (criterio === 'creacion') return copia.sort((a, b) => a.creacion - b.creacion);
  return copia;
};

export const buscarPorTitulo = (lista, texto) => 
  lista.filter(t => t.titulo.toLowerCase().includes(texto.toLowerCase()));

export const actualizarTareaPorId = (lista, id, cambios) => 
  lista.map(t => t.id === id ? Object.freeze({ ...t, ...cambios, ultimaEdicion: new Date() }) : t);