# Del artefacto a la web con Claude Code

Repositorio de ejemplos del curso. Aquí están los artefactos con los que se practica y, en cada rama, lo que se construye en cada módulo: la plantilla de la empresa, el artefacto convertido en web, lo necesario para publicarlo en Vercel, el backend en Supabase y las revisiones de seguridad.

No hace falta saber programar para usarlo. Todo se le pide a Claude Code de escritorio hablando, como a una persona del equipo.

> Este repositorio es **público** porque solo trae ejemplos inventados. Los repositorios de tu empresa con trabajo de clientes van siempre **privados**: lo verás en los módulos 3 y 7.

## Los cinco artefactos

Están en la carpeta `artefactos/`, tal como salen de Claude. Se hicieron como artefactos en claude.ai y se exportaron con Compartir › Exportación › HTML «Página web independiente»: cada uno es un único fichero que se abre con doble clic en cualquier navegador. Las empresas, las personas, las cifras y las fechas son de ejemplo. Cada artefacto lleva sus datos juntos al principio de su código (`PROPUESTA`, `CALCULADORA`, `DIAGNOSTICO`, `PORTAL` y `TABLERO`), y son esos datos los que pasan a ficheros aparte cuando el artefacto se convierte en web (módulo 4).

| Artefacto | Qué hace | ¿Guarda datos? | Para qué se usa en el curso |
|---|---|---|---|
| `propuesta-interactiva.html` | El cliente elige entre tres planes, añade extras y la fecha de arranque, y ve al momento qué incluye, cuánto dura y cuánto cuesta | No | El recorrido de la sesión 1, del artefacto a la web publicada |
| `calculadora-ahorro.html` | Con unos mandos, calcula cuántas horas al mes libera automatizar una tarea y lo que valen | No | Tu práctica de la sesión 1 |
| `diagnostico-madurez-ia.html` | Ocho preguntas sobre cuatro áreas, con el nivel, un gráfico por área y por dónde empezar | No, todavía | En el módulo 6 recibe su backend: las respuestas se guardan y el equipo las ve en un panel con inicio de sesión |
| `portal-proyecto.html` | Cada cliente vería solo el avance de su proyecto, con sus fases, documentos y mensajes | No: los dos clientes están en la misma página | Práctica de reglas de acceso, sesión 2 |
| `gestion-tareas.html` | Un tablero de tareas en el que cada persona vería solo las suyas | No: se pierde al recargar | Práctica de reglas de acceso con datos, sesión 2 |

Fíjate en los dos últimos: el portal deja entrar como uno u otro cliente y el tablero tiene un «Ver como», pero todos los datos están dentro del fichero y cualquiera que lo abra puede leerlos. Ellos mismos lo avisan. Que de verdad cada persona vea solo lo suyo pide un backend con reglas de acceso, y eso es el módulo 6.

## Una rama por módulo

Cada rama trae lo de la anterior más lo de su módulo, y en `docs/modulo-<n>.md` explica qué hay que hacer, qué debe salir y cómo se sabe que está bien.

| Rama | Módulo | Lo que añade |
|---|---|---|
| `main` | — | Este README y los cinco artefactos en `artefactos/` |
| `modulo-1/el-camino` | 1 · El camino del artefacto a la web | `docs/modulo-1.md`: el recorrido de la propuesta interactiva, de una vez |
| `modulo-2/claude-code` | 2 · Claude Code de escritorio sin programar | `docs/modulo-2.md`: el primer encargo sobre un artefacto y cómo comprobar el resultado |
| `modulo-3/github` | 3 · GitHub, el archivo de la empresa | La plantilla de la empresa en `plantilla/`, con el hook que impide trabajar en `main`. La skill del issue en dos niveles. `docs/modulo-3.md` |
| `modulo-4/proyecto` | 4 · Del artefacto al proyecto | La propuesta convertida en proyecto React con Vite, en `web/`, con los textos y los datos aparte y un hueco para el formulario del CRM. Las skills de documentar el proyecto y de gestión de contenido. `docs/modulo-4.md` |
| `modulo-5/vercel` | 5 · Publicar en Vercel con la cuenta de la empresa | Lo necesario para publicar `web/` en Vercel enlazada al repositorio, y la mejora que se revisa en la vista previa. `docs/modulo-5.md` |
| `modulo-6/supabase` | 6 · El backend con Supabase | El diagnóstico con su backend en `diagnostico/`: migraciones, inicio de sesión y reglas de acceso. El agente revisor de accesos. `docs/modulo-6.md` |
| `modulo-7/seguridad` | 7 · Lo que no puede fallar | El agente revisor antes de publicar y la lista de lo que no se publica. `docs/modulo-7.md` |

## Cómo empezar

1. Crea en tu equipo una carpeta para el curso, por ejemplo `Documentos/curso`.
2. Abre la aplicación de escritorio de Claude, ve a la pestaña **Code**, abre una sesión nueva y elige esa carpeta.
3. Pídeselo así:

   > Descarga en esta carpeta el repositorio público https://github.com/hispafox/ArtWeb-curso y dime qué hay dentro.

4. Cuando termine, abre una sesión nueva con la carpeta `ArtWeb-curso` que acaba de crear. A partir de ahí trabajas siempre desde esa carpeta.

## Cómo cambiar de rama

Cambiar de rama es cambiar el contenido de la carpeta por el de otro módulo. No se pierde nada: cada rama sigue guardada en el repositorio y puedes volver a ella cuando quieras. Se lo pides a Claude:

> ¿En qué rama estoy?

> Cámbiate a la rama `modulo-3/github` y dime qué ha cambiado respecto a la anterior.

> Vuelve a la rama `main`.

Si has hecho pruebas en la carpeta, Claude te avisará antes de cambiar de rama y te preguntará qué hacer con ellas. Si son pruebas del curso que no quieres conservar, puedes pedirle que las deshaga; si quieres guardarlas, pídele que las deje en una rama tuya, por ejemplo `pruebas/tu-nombre`.

Para traer las novedades del repositorio, si se ha actualizado después de que lo descargaras:

> Trae los últimos cambios del repositorio para todas las ramas.

## Lo que necesita tu equipo

La aplicación de escritorio de Claude con un plan que incluya Claude Code, Git y Node.js. Qué es cada cosa y cómo se comprueba que funciona está en el módulo 2.
