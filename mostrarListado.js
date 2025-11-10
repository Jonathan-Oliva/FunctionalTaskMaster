import prompt from 'prompt';
import { filtrarTareas, ordenarTareas, actualizarTareaPorId } from './todoList.js';
import { parseFecha } from './utils.js'; // Función para convertir texto a fecha

export const mostrarListado = async (estado, filtro, orden) => {
  let { tareas, guardar } = estado;
  let tareasFiltradas = filtrarTareas(tareas, filtro);
  tareasFiltradas = ordenarTareas(tareasFiltradas, orden);

  console.clear();
  console.log(`\nTAREAS (${filtro.toUpperCase()}) - ${tareasFiltradas.length}\n`);

  if (tareasFiltradas.length === 0) {
    console.log('No hay tareas.\n');
    await prompt.get(['enter']);
    return { tareas, guardar };
  }

  // Mostrar lista
  tareasFiltradas.forEach((t, i) => {
    const vencimiento = t.vencimiento 
      ? t.vencimiento.toLocaleDateString() 
      : 'Sin vencimiento';
    console.log(`[${i + 1}] ${t.titulo} [${t.estado}] - ${vencimiento}`);
  });

  console.log('\nSelecciona una tarea por número para ver/editar, o [0] para volver');
  const inputNum = await prompt.get(['num']);
  const n = parseInt(inputNum.num?.trim());

  if (n === 0 || isNaN(n)) {
    return { tareas, guardar };
  }

  if (n > 0 && n <= tareasFiltradas.length) {
    const tareaOriginal = tareasFiltradas[n - 1];

    // === MOSTRAR DETALLE DE CADA TAREA ELEGIDA===
    const mostrarDetalle = () => {
      console.clear();
      console.log('=== DETALLE DE TAREA ===\n');
      console.log(`ID: ${tareaOriginal.id}`);
      console.log(`Título: ${tareaOriginal.titulo}`);
      console.log(`Descripción: ${tareaOriginal.descripcion || '(Sin descripción)'}`);
      console.log(`Estado: ${tareaOriginal.estado}`);
      console.log(`Creación: ${tareaOriginal.creacion.toLocaleString()}`);
      console.log(`Última edición: ${tareaOriginal.ultimaEdicion.toLocaleString()}`);
      console.log(`Vencimiento: ${tareaOriginal.vencimiento ? tareaOriginal.vencimiento.toLocaleDateString() : 'No definido'}`);
      console.log(`Dificultad: ${tareaOriginal.dificultad}\n`);
    };

    mostrarDetalle();

    // === MENÚ DE EDICIÓN ===
    while (true) {
      console.log('[1] Editar Título');
      console.log('[2] Editar Descripción');
      console.log('[3] Editar Estado');
      console.log('[4] Editar Vencimiento');
      console.log('[5] Editar Dificultad (1=Fácil, 2=Medio, 3=Difícil)');
      console.log('[0] Volver al listado');

      const inputOpcion = await prompt.get(['opcion']);
      const opcion = inputOpcion.opcion;

      if (opcion === '0') break;

      let cambios = {};
      const ahora = new Date();

      if (opcion === '1') {
        const input = await prompt.get(['Nuevo título']);
        const nuevo = input['Nuevo título'];
        if (nuevo?.trim()) {
          cambios.titulo = nuevo.trim();
          console.log('Título actualizado.\n');
        }
      }
      if (opcion === '2') {
        const input = await prompt.get(['Nueva descripción']);
        const desc = input['Nueva descripción'];
        cambios.descripcion = (desc || '').substring(0, 500);
        console.log('Descripción actualizada.\n');
      }
      if (opcion === '3') {
        const input = await prompt.get(['Estado (P/E/T/C)']);
        const est = input['Estado (P/E/T/C)'];
        const codigo = est?.trim().toUpperCase();
        const mapa = { P: 'Pendiente', E: 'En Curso', T: 'Terminada', C: 'Cancelada' };
        if (mapa[codigo]) {
          cambios.estado = mapa[codigo];
          console.log('Estado actualizado.\n');
        } else {
          console.log('Código inválido. Usa P, E, T o C.\n');
        }
      }
      if (opcion === '4') {
        const input = await prompt.get(['Vencimiento (D-M-AAAA o 0 para eliminar)']);
        const fecha = input['Vencimiento (D-M-AAAA o 0 para eliminar)'];
        cambios.vencimiento = fecha?.trim() === '0' ? null : parseFecha(fecha);
        console.log('Vencimiento actualizado.\n');
      }
      if (opcion === '5') {
        const input = await prompt.get(['Dificultad (1/2/3)']);
        const valor = input['Dificultad (1/2/3)']?.trim();
        const d = parseInt(valor, 10);

        if (!isNaN(d) && d >= 1 && d <= 3) {
          cambios.dificultad = { 1: 'Fácil', 2: 'Medio', 3: 'Difícil' }[d];
          console.log(`Dificultad actualizada a ${cambios.dificultad}.\n`);
        } else {
          console.log('Dificultad inválida. Usa 1, 2 o 3.\n');
        }
      }

      // Si hubo cambios, actualiza y cambia detalles 
      if (Object.keys(cambios).length > 0) {
        cambios.ultimaEdicion = ahora;
        tareas = actualizarTareaPorId(tareas, tareaOriginal.id, cambios);
        // Actualizar referencia local para mostrar cambios
        const tareaActualizada = tareas.find(t => t.id === tareaOriginal.id);
        Object.setPrototypeOf(tareaOriginal, Object.getPrototypeOf(tareaActualizada));
        Object.assign(tareaOriginal, tareaActualizada);
        console.log('Cambios guardados.\n');
        await prompt.get(['enter']);
        mostrarDetalle();
      }
    }
  } else {
    console.log('Número inválido.');
    await prompt.get(['enter']);
  }

  return { tareas, guardar }; // Devuelve el estado actualizado
};