# Módulo 4 · Del artefacto al proyecto

En este módulo conviertes un artefacto en una web con su propio proyecto, la ves en tu equipo antes de publicarla, le metes el formulario del CRM y dejas que Claude la documente.

## Lo que hay en esta rama

Lo de la rama `modulo-3/github` más:

- **`web/`**: la propuesta interactiva convertida en proyecto React con Vite y TypeScript. Es el resultado de la demostración y te sirve de modelo:
  - `web/src/contenido/`: los datos (`propuesta.json`, que es el objeto `PROPUESTA` del artefacto) y los textos (`textos.json`), aparte del diseño.
  - `web/src/componentes/FormularioCrm.tsx`: el hueco para el formulario del CRM, con las instrucciones dentro.
  - `web/README.md` y `web/docs/guia-del-proyecto.md`: la documentación que escribe la skill de documentar.
  - Las pruebas, junto a cada pieza (los ficheros `.test.ts` y `.test.tsx`).
- **`.claude/skills/documentar-proyecto/`**: la skill que escribe el README y la guía del proyecto.
- **`.claude/skills/gestion-contenido/`**: la skill que cambia textos y datos sin tocar el diseño.
- **`.claude/launch.json`**: le dice a la app cómo arrancar la web de `web/` para verla en su navegador.
- Este documento.

## Las ideas del módulo, en corto

- **El punto de partida.** Claude Code parte del enlace del artefacto, si se puede abrir, o del fichero exportado. En claude.ai, el artefacto se exporta con **Compartir › Exportación › HTML «Página web independiente»**: sale un único fichero HTML, como los de `artefactos/`. Ese fichero no siempre se comporta igual que en claude.ai, que le pone su propio esqueleto y sus estilos al enseñarlo: ábrelo en el navegador y compruébalo antes de convertirlo. Con los artefactos del curso hizo falta añadirles el esqueleto de la página y, a la gestión de tareas, una línea de estilos; lo cuenta el README de `main`. Con un diseño de Claude Design hay dos caminos: enviarlo directamente a Vercel, que vale para un prototipo rápido, o pasarlo a Claude Code («Handoff to Claude Code») para que entre en un proyecto con su repositorio. En el curso se sigue el segundo, porque así la dirección de la web no cambia con cada versión (módulo 5). El menú exacto de Claude Design para enviar a Vercel míralo en la app: las guías de Anthropic y de Vercel no lo llaman igual.
- **Qué monta Claude.** Un proyecto con React, el estándar para este tipo de webs. Para ti, lo que cambia es que la web deja de ser un único fichero. Pídele que deje **los textos y los datos aparte del diseño**, que respete los colores, las letras y las imágenes del original y que te explique lo que ha montado en dos niveles.
- **Verla antes de publicarla.** Claude arranca la web en tu equipo y la abre en el navegador de la app (el panel **Browser**, con Ctrl+Shift+B o el botón «Browser» de la barra de título). Ahí se revisa sección a sección contra el artefacto original, y lo que no está igual se le pide que lo corrija.
- **Formularios.** Si el formulario ya existe en el CRM, se copia su código de inserción y Claude lo mete en la web: las respuestas llegan al CRM como hasta ahora. Si tienen que quedarse en la propia web, hace falta backend, y eso es el módulo 6.
- **La documentación.** Claude escribe el README del proyecto y una guía. Si se lo pides, también en Word con el estilo de la empresa.

## La demostración: la propuesta, en `web/`

Abre la carpeta `ArtWeb-curso` en la rama `modulo-4/proyecto` y pídele:

> Enséñame la web de `web/` en el navegador de la app y, al lado, el artefacto original `artefactos/propuesta-interactiva.html`. Recórrelas sección a sección y dime si hay alguna diferencia.

La única diferencia buscada es la sección «¿Hablamos?», con el hueco del formulario del CRM.

## Tu práctica

Con la **calculadora de ahorro**, en tu repositorio `gestoria-calculadora-ahorro` del módulo 3. Antes, deja la carpeta del curso en esta rama, porque vas a usar sus skills:

> (En la sesión de `ArtWeb-curso`) Cámbiate a la rama `modulo-4/proyecto` y copia las skills `documentar-proyecto` y `gestion-contenido` a mis skills personales.

Después, en una sesión con la carpeta `gestoria-calculadora-ahorro`, en modo Manual:

1. **La rama.** En `main` no se trabaja:

   > Crea la rama `mejora/proyecto-web` para este trabajo.

2. **La conversión:**

   > Convierte `calculadora-ahorro.html` en un proyecto web con React, Vite y TypeScript. Deja los datos del objeto `CALCULADORA` (los ejemplos y las constantes del cálculo) y los textos en ficheros JSON aparte del diseño. Respeta los colores, las letras y el comportamiento del original, y añade pruebas. Cuando termines, explícame en dos niveles lo que has montado.

3. **Verla y compararla:**

   > Enséñame la web en el navegador de la app y, al lado, el artefacto original. Recórrelas sección a sección y dime si hay diferencias.

   Mueve los mandos en las dos y comprueba que dan las mismas horas.

4. **El formulario del CRM.** Primero el hueco:

   > Añade al final una sección de contacto con un hueco para el formulario del CRM, como el de la propuesta del curso. Mientras esté vacío, que muestre un correo de contacto inventado.

   Si tu empresa tiene un formulario en su CRM, copia su código de inserción y pídele:

   > Mete en el hueco del formulario este código de inserción de nuestro CRM: (pega aquí el código).

   Y prueba a enviarlo con datos inventados. Comprueba en el CRM que ha llegado.

5. **La documentación:**

   > Documenta el proyecto.

6. **Un cambio de contenido:**

   > Cambia el coste por hora del primer ejemplo a 30 €.

   Pregúntale después qué ficheros ha tocado: tiene que ser solo uno de los JSON de contenido.

7. **Guardar y llevarlo a `main`:**

   > Pasa las pruebas y la compilación. Si todo está bien, guarda la versión, súbela y abre una pull request.

   Revísala, y cuando esté bien, acéptala: en el módulo 5 se publica lo que hay en `main`.

## Qué debe salir y cómo sabes que está bien

- [ ] El proyecto está en tu repositorio, hecho en la rama `mejora/proyecto-web`.
- [ ] Los textos y los datos están en **ficheros JSON aparte**. Pregúntale «¿En qué ficheros están los textos y los datos? Enséñamelos».
- [ ] En el navegador de la app, la web **se ve y se comporta como el original**: mismos colores, mismas letras, mismos cálculos.
- [ ] **Las pruebas y la compilación salen en verde.** Pídeselo y que te diga cuántas pruebas ha pasado.
- [ ] Hay una **sección de contacto** con el hueco del CRM o, si has pegado un código de inserción, con el formulario funcionando.
- [ ] Hay un **README** con una parte para el equipo y otra técnica, y una **guía** en `docs/`.
- [ ] El cambio de contenido **solo tocó un fichero de contenido**.
- [ ] La pull request está aceptada y el proyecto está en `main`.
