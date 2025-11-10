import { readFile, writeFile } from 'fs/promises'; //Herramientas de Node.js para manejar archivos

export const serializarTarea = (tarea) => ({
  ...tarea, // Copia todas las propiedades originales
  creacion: tarea.creacion.toISOString(), // Convierte fechas a cadenas ISO
  ultimaEdicion: tarea.ultimaEdicion.toISOString(), // Convierte fechas a cadenas ISO
  vencimiento: tarea.vencimiento ? tarea.vencimiento.toISOString() : null, // Maneja posible null
});

export const deserializarTarea = (obj) => ({ // Convierte el texto JSON de vuelta a un objeto tarea reales
  ...obj,
  creacion: new Date(obj.creacion), //Crea la fecha de creacion
  ultimaEdicion: new Date(obj.ultimaEdicion), //Crea la fecha de ultima edicion
  vencimiento: obj.vencimiento ? new Date(obj.vencimiento) : null,
}); // Al cargar volvermos a texto en fecha que JS entiende

export const guardarEnArchivo = (ruta) => async (tareas) => { 
  const datos = tareas.map(serializarTarea); // Convierte cada tarea a formato serializable
  await writeFile(ruta, JSON.stringify(datos, null, 2), 'utf-8');
  return tareas; // Devuelve las tareas originales tras guardar
}; // Guarda las tareas en un archivo JSON 

export const cargarDesdeArchivo = (ruta) => async (fallback = []) => {
  try {
    const data = await readFile(ruta, 'utf-8'); // Lee el archivo
    const parsed = JSON.parse(data); // Convierte el texto JSON a objetos
    return parsed.map(deserializarTarea); //Devuelve las tareas deserializadas 
  } catch { //Si hay un error (como archivo no encontrado) usa las tareas creadas manualmente
    console.log('No se encontró archivo. Usando datos por defecto.');
    return fallback;
  }
}; // Carga tareas desde un archivo JSON, o usa datos por defecto si no existe

export const iniciarConPersistencia = (ruta, fallback) =>  
  cargarDesdeArchivo(ruta)(fallback); // Inicia la app con tareas por defecto