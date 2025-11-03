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

export const crearTarea = (titulo, descripcion = '', vencimiento = null, dificultad = 1) => {
  if (!titulo || titulo.length > 100) throw new Error('Título obligatorio (máx 100 caracteres)');
  const ahora = new Date();
  const fechaVencimiento = vencimiento ? new Date(vencimiento) : null;

  return Object.freeze({
    id: crypto.randomUUID(),
    titulo: titulo.trim(),
    descripcion: (descripcion || '').substring(0, 500),
    estado: ESTADOS.PENDIENTE,
    creacion: ahora,
    ultimaEdicion: ahora,
    vencimiento: fechaVencimiento,
    dificultad: parsearDificultad(dificultad),
  });
};

const parsearDificultad = (valor) => {
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
  if (!nuevo) return tarea;
  return Object.freeze({ ...tarea, estado: nuevo, ultimaEdicion: new Date() });
};

export const mostrarDetalle = (tarea) => {
  const emojis = { 'Fácil': '⭐', 'Medio': '⭐⭐', 'Difícil': '⭐⭐⭐' };
  const vencimiento = tarea.vencimiento 
    ? tarea.vencimiento.toLocaleDateString() 
    : 'No definido';
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