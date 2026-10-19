# Diagnóstico de madurez en IA, con backend

Las ocho preguntas del artefacto `artefactos/diagnostico-madurez-ia.html`, convertidas en web y con backend en Supabase: quien las contesta puede enviar sus respuestas, y el equipo las ve en un panel con inicio de sesión. Las preguntas y los niveles son de ejemplo.

## Para el equipo

- **Qué hace:** como el artefacto, a la izquierda están las ocho preguntas, con unas respuestas de ejemplo ya marcadas, y a la derecha el informe se actualiza al momento: el nivel (Explorando, Probando, Integrando o Transformando), la media sobre 4, un gráfico por área y por dónde empezar. Lo nuevo es que, con todo contestado, se pueden enviar las respuestas, con el nombre de la empresa y un correo, los dos opcionales. Si deja el correo, tiene que aceptar que le escriban.
- **El panel del equipo:** en la dirección `/panel`. Se entra con correo y contraseña, y solo ve los diagnósticos quien está dado de alta en el equipo.
- **¿Guarda datos?** Sí, en Supabase, en dos tablas:
  - `diagnosticos`: lo que envía quien contesta. **Cualquiera puede enviar, nadie de fuera puede leer**, ni siquiera lo que acaba de enviar. Nadie puede cambiar ni borrar desde la web.
  - `miembros_equipo`: quién del equipo entra en el panel. Se da de alta a mano, nunca desde la web.
- **Quién ve qué:** lo deciden las reglas de acceso de `supabase/migrations`. El agente `revisor-de-accesos` las comprueba.
- **Cómo verla antes de publicar:** pídele a Claude «Enséñame el diagnóstico en el navegador de la app». Sin configurar Supabase funciona igual, pero avisa de que no guarda nada.
- **Cómo cambiar las preguntas o los textos:** en `src/contenido/` (`diagnostico.json` y `textos.json`), con la skill de gestión de contenido. Si cambias los nombres de los niveles, hay que cambiarlos también en la base de datos con una migración nueva.

## Detalle técnico

- **Hecho con:** React 19, Vite 8, TypeScript 6 y `@supabase/supabase-js` 2. Pruebas con Vitest 5 y Testing Library.
- **Estructura:**
  - `supabase/migrations/`: las tablas, los permisos y las reglas de acceso (RLS), como migraciones.
  - `src/lib/supabase.ts`: el cliente, con la dirección y la clave publicable de las variables `VITE_`. Se niega a arrancar con la clave secreta.
  - `src/servicios/diagnosticos.ts`: lo que se guarda y se lee.
  - `src/componentes/`: la cabecera, el cuestionario, el informe con su envío, el radar y el panel.
  - `src/contenido/`: `diagnostico.json` (el objeto `DIAGNOSTICO` del artefacto, tal cual: áreas, preguntas, niveles y respuestas de ejemplo) y `textos.json`.
  - `src/logica/`: la puntuación (la misma del artefacto) y el gráfico.
  - `src/estilos.css`: el CSS del artefacto original, copiado tal cual, más el envío y el panel. Las letras se cargan de Google Fonts en `index.html`, como en el original.
- **Órdenes:** `npm run dev` (la web en `http://localhost:5174`), `npm run build`, `npm test` y `npm run preview`.
- **Variables de entorno** (ver `.env.example`): `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. Son públicas: van dentro de la web. La clave secreta no se usa en ningún sitio.
- **Pruebas:** la media, los niveles y el área más floja, con las respuestas de ejemplo y sin ellas; que la configuración rechaza la clave secreta; que el envío inserta sin pedir la fila de vuelta; el flujo entero del cuestionario y del envío; el panel con y sin sesión, y con usuario que no es del equipo; y que las migraciones activan RLS en todas las tablas, no dejan leer a nadie sin sesión y exigen ser del equipo para leer los diagnósticos.
- **Base de datos:** las migraciones se aplican al proyecto de pruebas con el conector de Supabase, y a producción con la integración de Supabase con GitHub al entrar en `main`.
- **Publicación:** Vercel, como la propuesta, con `vercel.json`. En el repositorio del curso, con `diagnostico` como Root Directory. En Vercel hay que crear las dos variables `VITE_` a mano, o renombrar las que copia la integración de Supabase, que no llevan ese prefijo.
