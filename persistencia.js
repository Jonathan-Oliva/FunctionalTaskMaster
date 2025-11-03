import { readFile, writeFile } from 'fs/promises';

export const serializarTarea = (tarea) => ({
  ...tarea,
  creacion: tarea.creacion.toISOString(),
  ultimaEdicion: tarea.ultimaEdicion.toISOString(),
  vencimiento: tarea.vencimiento ? tarea.vencimiento.toISOString() : null,
});

export const deserializarTarea = (obj) => ({
  ...obj,
  creacion: new Date(obj.creacion),
  ultimaEdicion: new Date(obj.ultimaEdicion),
  vencimiento: obj.vencimiento ? new Date(obj.vencimiento) : null,
});

export const guardarEnArchivo = (ruta) => async (tareas) => {
  const datos = tareas.map(serializarTarea);
  await writeFile(ruta, JSON.stringify(datos, null, 2), 'utf-8');
  return tareas;
};

export const cargarDesdeArchivo = (ruta) => async (fallback = []) => {
  try {
    const data = await readFile(ruta, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.map(deserializarTarea);
  } catch {
    console.log('No se encontró archivo. Usando datos por defecto.');
    return fallback;
  }
};

export const iniciarConPersistencia = (ruta, fallback) => 
  cargarDesdeArchivo(ruta)(fallback);