import prompt from 'prompt';
import { actualizarTareaPorId } from './todoList.js';
import { parseFecha } from './utils.js';

export const menuDetallesTarea = async (estado, tareaId) => { ///Función para mostrar y editar detalles de una tarea específica
  let { tareas, guardar } = estado;
  const tarea = tareas.find(t => t.id === tareaId);
  if (!tarea) return { tareas, guardar };

  console.clear();
  console.log(`\nTAREA: "${tarea.titulo}"\n`);
  console.log('[1] Cambiar Estado');
  console.log('[2] Editar Vencimiento');
  console.log('[3] Editar Descripción');
  console.log('[4] Editar Dificultad');
  console.log('[0] Volver');

  const { opcion } = await prompt.get(['opcion']);
  if (opcion === '0') return { tareas, guardar };

  let cambios = {};
  if (opcion === '1') {
    const { est } = await prompt.get(['Nuevo estado (P/E/T/C)']);
    const codigo = est?.trim().toUpperCase();
    cambios.estado = codigo && { P: 'Pendiente', E: 'En Curso', T: 'Terminada', C: 'Cancelada' }[codigo] || tarea.estado;
  }
  if (opcion === '2') {
    const { fecha } = await prompt.get(['Nueva fecha (D-M-YYYY o 0 para eliminar)']);
    cambios.vencimiento = fecha === '0' ? null : parseFecha(fecha);
  }
  if (opcion === '3') {
    const { desc } = await prompt.get(['Nueva descripción']);
    cambios.descripcion = desc?.substring(0, 500) || '';
  }
  if (opcion === '4') {
    const { dif } = await prompt.get(['Dificultad (1/2/3)']);
    const d = parseInt(dif);
    cambios.dificultad = { 1: 'Fácil', 2: 'Medio', 3: 'Difícil' }[d] || tarea.dificultad;
  }

  tareas = actualizarTareaPorId(tareas, tareaId, cambios);
  console.log('Actualizado.\n');
  await prompt.get(['enter']);

  return { tareas, guardar };
};