import prompt from 'prompt';
import { filtrarTareas, ordenarTareas } from './todoList.js';
import { mostrarListado } from './mostrarListado.js';

export const menuVerMisTareas = async (estado) => {
  console.clear();
  console.log(`
¿Qué tareas deseas ver?

[1] Todas
[2] Pendientes
[3] En curso
[4] Terminadas
[5] Canceladas
[0] Volver
  `);
  const { opcion } = await prompt.get(['opcion']);
  if (opcion === '0') return estado;

  const filtros = { '1': 'todas', '2': 'pendiente', '3': 'en curso', '4': 'terminada', '5': 'cancelada' };
  const filtro = filtros[opcion] || 'todas';

  console.log('\n¿Ordenar? [1] A-Z [2] Vencimiento [3] Creación [0] No');
  const { orden } = await prompt.get(['orden']);
  const ordenTipo = { '1': 'titulo', '2': 'vencimiento', '3': 'creacion' }[orden] || null;

  return await mostrarListado(estado, filtro, ordenTipo);
};