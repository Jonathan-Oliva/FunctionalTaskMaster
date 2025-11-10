// Utilidades para crear y manipular tareas 
export const ESTADOS = Object.freeze({ 
  PENDIENTE: 'Pendiente',
  EN_CURSO: 'En Curso',
  TERMINADA: 'Terminada',
  CANCELADA: 'Cancelada',
});

export const DIFICULTADES = Object.freeze({
  FACIL: 'Fácil',
  MEDIO: 'Medio',
  DIFICIL: 'Difícil',
});

// Constructor de tarea
export const crearTarea = (titulo, descripcion = '', vencimiento = null, dificultad = 1) => {
  if (!titulo || titulo.length > 100) throw new Error('Título obligatorio (máx 100 caracteres)'); //Valida título
  const ahora = new Date(); //Utiliza la fecha actual
  const fechaVencimiento = vencimiento ? new Date(vencimiento) : null; 

  return Object.freeze({ // Crea un objeto tarea inmutable
    id: crypto.randomUUID(), //Un identificador único utilizando UUID
    titulo: titulo.trim(), 
    descripcion: (descripcion || '').substring(0, 500),
    estado: ESTADOS.PENDIENTE,
    creacion: ahora,
    ultimaEdicion: ahora,
    vencimiento: fechaVencimiento,
    dificultad: parsearDificultad(dificultad),
  });
};

const parsearDificultad = (valor) => { // Convertidor de dificultad donde acepta número o texto
  const mapa = { 1: 'Fácil', 2: 'Medio', 3: 'Difícil' };
  if (typeof valor === 'number') return mapa[valor] || 'Fácil';
  const v = (valor || '').toLowerCase().trim();
  if (['fácil', 'facil', 'f'].includes(v)) return 'Fácil';
  if (['medio', 'm'].includes(v)) return 'Medio';
  if (['difícil', 'dificil', 'd'].includes(v)) return 'Difícil';
  return 'Fácil';
};

export const cambiarEstado = (tarea, codigo) => { 
  const mapa = { P: 'Pendiente', E: 'En Curso', T: 'Terminada', C: 'Cancelada' };
  const nuevo = mapa[codigo.toUpperCase()];
  if (!nuevo) return tarea; // Si el código es inválido, devuelve la tarea sin cambios
  return Object.freeze({ ...tarea, estado: nuevo, ultimaEdicion: new Date() });
};

export const mostrarDetalle = (tarea) => { 
  const emojis = { 'Fácil': '⭐', 'Medio': '⭐⭐', 'Difícil': '⭐⭐⭐' };
  const vencimiento = tarea.vencimiento 
    ? tarea.vencimiento.toLocaleDateString() 
    : 'No definido';
    
    //Retorna toda la información de la tarea en formato texto 
  return ` 
Título: ${tarea.titulo}
Descripción: ${tarea.descripcion || '(Sin descripción)'}
Creación: ${tarea.creacion.toLocaleString()}
Vencimiento: ${vencimiento}
Estado: ${tarea.estado}
Dificultad: ${tarea.dificultad} ${emojis[tarea.dificultad]}
Última edición: ${tarea.ultimaEdicion.toLocaleString()}
  `.trim();
};