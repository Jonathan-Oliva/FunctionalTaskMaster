import prompt from 'prompt';
import { menuVerMisTareas } from './menuVerMisTareas.js';
import { buscarPorTitulo } from './todoList.js';
import { crearTarea, cambiarEstado } from './tarea.js';
import { parseFecha } from './utils.js';

prompt.start(); // Inicia el prompt para entrada de usuario y activa la consola
// Función principal del menú
export const menuPrincipal = async (estado) => { 
  let { tareas, guardar } = estado; //Extrae las tareas y la función de guardado

  //Bucle principal del menú que se repite hasta que el usuario decida salir
  while (true) { 
    console.clear();
    console.log(`
=== GESTOR DE TAREAS ===

[1] Ver Mis Tareas
[2] Buscar una Tarea
[3] Agregar una Tarea
[4] Eliminar una Tarea
[0] Salir
    `);
    const { opcion } = await prompt.get(['opcion']); //Solicita la opción del usuario 
    
    if (opcion === '0') { //Salir de la aplicación
      await guardar(tareas);
      break;
    }
    
    if (opcion === '1') { //Ver mis tareas 
      const result = await menuVerMisTareas({ tareas, guardar });
      tareas = result.tareas;
      continue;
    }

    if (opcion === '2') { //Buscar una tarea por título
      const { texto } = await prompt.get(['texto']);
      const resultados = buscarPorTitulo(tareas, texto || '');
      console.log(resultados.length ? 'Resultados:' : 'No encontrado.');
      resultados.forEach((t, i) => console.log(`[${i + 1}] ${t.titulo}`));
      await prompt.get(['enter']);
      continue;
    }

    if (opcion === '3') {
      console.log('=== AGREGAR TAREA ===\n');

      // TÍTULO OBLIGATORIO
      let titulo; 
      while (!titulo?.trim()) {
        const input = await prompt.get(['Título (obligatorio)']);
        titulo = input['Título (obligatorio)'];
        if (!titulo?.trim()) {
          console.log('Error: El título no puede estar vacío.\n');
        }
      }

      // DESCRIPCIÓN OPCIONAL
      const { desc } = await prompt.get([{ 
        name: 'desc', 
        description: 'Descripción (opcional)', 
        required: false 
      }]);

      // VENCIMIENTO OPCIONAL
      const { fecha } = await prompt.get([{ 
        name: 'fecha', 
        description: 'Vencimiento (D-M-AAAA o 0 para eliminar)', 
        required: false 
      }]);

      // DIFICULTAD: 1=Fácil, 2=Medio, 3=Difícil
      let dificultadValida = false;
      let dificultad = 1; // valor por defecto

      while (!dificultadValida) {
        const input = await prompt.get(['Dificultad (1=Fácil, 2=Medio, 3=Difícil)']);
        const valor = input['Dificultad (1=Fácil, 2=Medio, 3=Difícil)']?.trim();
        const d = parseInt(valor, 10);

        if (!isNaN(d) && d >= 1 && d <= 3) {
          dificultad = d;
          dificultadValida = true;
        } else {
          console.log('Dificultad inválida. Usa 1, 2 o 3.\n');
        }
      }

      // ESTADO OPCIONAL
      const { est } = await prompt.get([{ 
        name: 'est', 
        description: 'Estado (P=Pendiente, E=En Curso, T=Terminada, C=Cancelada)', 
        required: false 
      }]);

      try { // Intentar crear la tarea y manejar errores
        const nueva = crearTarea(
          titulo.trim(),
          desc || '',
          parseFecha(fecha),
          dificultad
        );

        const tareaFinal = est?.trim() 
          ? cambiarEstado(nueva, est.trim().toUpperCase()) 
          : nueva;

        tareas = [...tareas, tareaFinal];
        console.log('\nTarea creada con éxito!\n');
      } catch (error) {
        console.log(`\nError: ${error.message}\n`);
      }

      await prompt.get(['enter']); // Pausa hasta que el usuario presione Enter 
      console.log("Pulse enter para continuar..."); 
    }

    // === ELIMINAR TAREA ===
    if (opcion === '4') {
      if (tareas.length === 0) {
        console.log('No hay tareas para eliminar.\n');
        await prompt.get(['enter']);
        console.log("Pulse enter para continuar..."); 
        continue;
      }

      console.log('=== ELIMINAR TAREA ===\n');
      tareas.forEach((t, i) => {
        console.log(`[${i + 1}] ${t.titulo} (ID: ${t.id})`);
      });

      console.log('\nEscribe el número de la tarea a eliminar, o [0] para cancelar');
      const input = await prompt.get(['num']);
      const n = parseInt(input.num?.trim());

      if (n === 0 || isNaN(n)) {
        console.log('Eliminación cancelada.\n');
        await prompt.get(['enter']);
        continue;
      }

      if (n > 0 && n <= tareas.length) {
        const tareaEliminada = tareas[n - 1];
        tareas = tareas.filter((_, i) => i !== n - 1); //Elimina la tarea seleccionada por indice 
        console.log(`\nTarea eliminada: "${tareaEliminada.titulo}"\n`);
      } else {
        console.log('Número inválido.\n');
      }

      await prompt.get(['enter']);
    }
  }

  return { tareas }; // Devuelve el estado final con las tareas actualizadas 
};