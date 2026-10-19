# Propuesta interactiva

La propuesta de un asistente de IA para la atención al cliente, convertida en web: el cliente elige uno de tres planes, añade extras y la fecha de arranque, y ve al momento qué incluye, cuánto dura y cuánto cuesta. Sale del artefacto `artefactos/propuesta-interactiva.html` del repositorio del curso. La empresa, los planes y las cifras son inventados.

## Para el equipo

- **Qué hace:** quien la abre elige el plan Piloto, Implantación o Escala, marca los extras que quiera (un segundo idioma, formación para supervisores, tres meses de soporte) y elige cuándo empezar. El resumen de la derecha dice el plan, la duración, las fechas, la formación, el equipo y la inversión. Al final hay una sección de contacto.
- **Dónde se ve:** todavía sin publicar. Publicarla es el módulo 5.
- **Cómo verla antes de publicar:** pídele a Claude «Enséñame la web de la propuesta en el navegador de la app».
- **Cómo cambiar datos y textos:** todo está en `src/contenido/`. Los datos (planes, precios, semanas, extras, fechas), en `propuesta.json`; los textos de la página, en `textos.json`. Pídele a Claude el cambio, por ejemplo «Sube el plan Implantación a 26.000 €»: lo hace con la skill de gestión de contenido, sin tocar el diseño.
- **El formulario de contacto:** la sección «¿Hablamos?» tiene un hueco para el formulario del CRM. Mientras está vacío, muestra el correo de contacto. Para rellenarlo, copia el código de inserción del formulario en el CRM y pídele a Claude «Mete en el hueco del formulario del CRM este código de inserción».
- **Cómo se publica un cambio:** en una rama, nunca en `main`, y con una pull request que revisa una persona.
- **¿Guarda datos?** No. El botón «Aceptar este plan» solo enseña un aviso, y lo que se escribe en el formulario llega al CRM.

## Detalle técnico

- **Hecho con:** React 19, Vite 8 y TypeScript 6. Pruebas con Vitest 5 y Testing Library. Las letras (Bricolage Grotesque, Atkinson Hyperlegible y JetBrains Mono) se cargan de Google Fonts en `index.html`, como en el original.
- **Estructura:**
  - `src/contenido/`: `propuesta.json` (el objeto `PROPUESTA` del artefacto, más `planInicial`), `textos.json` y su forma en `tipos.ts`.
  - `src/componentes/`: una pieza por parte de la página (cabecera, planes, ajustes, qué incluye, calendario, resumen y contacto). `FormularioCrm.tsx` es el hueco del CRM, con las instrucciones dentro.
  - `src/logica/`: los cálculos sin pantalla (`calculo.ts`, los mismos del artefacto) y el formato de euros y fechas.
  - `src/estilos.css`: el CSS del artefacto original, copiado tal cual, más lo de la sección de contacto.
- **Órdenes:**
  - `npm run dev`: arranca la web en `http://localhost:5173` para verla en el equipo.
  - `npm run build`: comprueba los tipos y genera la versión publicable en `dist/`.
  - `npm test`: pasa las pruebas.
  - `npm run preview`: sirve en local lo que hay en `dist/`.
- **Pruebas:** los cálculos de cada plan y de cada extra (precio, semanas, formación, soporte incluido en Escala, fechas), la coherencia de `propuesta.json` (que los planes incluyan cosas que existen, que haya semanas para cada fase, que los extras apunten a fases y planes que existen), que no haya textos vacíos, la página entera al cambiar de plan, de extras y de fecha, y el hueco del formulario.
- **Variables de entorno:** ninguna.
- **Publicación:** todavía sin publicar.
