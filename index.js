
import { menuPrincipal } from './menu.js';
import { crearTarea } from './tarea.js';
import { iniciarConPersistencia, guardarEnArchivo } from './persistencia.js';

const RUTA_DATOS = 'tareas.json';
const guardar = guardarEnArchivo(RUTA_DATOS);

//Aqui se declaran las tareas de prueba y se inicia la app
const ejecutarApp = async () => {
  const tareasDemo = [
    crearTarea("Aprender HTML", "Primer paso en desarrollo web", null, 2),
    crearTarea("Aprender CSS", "Para estilos y diseño", null, 1),
    crearTarea("Aprender JavaScript", "Para lógica y dinámicas", null, 3),
    crearTarea("Aprender React", "Para interfaces interactivas", null, 3),
    crearTarea("Revisar roadmap.sh", "Roadmap actualizado", null, 2),
  ];

  const tareas = await iniciarConPersistencia(RUTA_DATOS, tareasDemo);
  const { tareas: finales } = await menuPrincipal({ tareas, guardar });
  
  await guardar(finales);
  console.log(`¡Adiós! Tareas guardadas en ${RUTA_DATOS}`);
};

//Llamamos a la función para ejecutar la aplicación
ejecutarApp();