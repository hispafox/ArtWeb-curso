# Guía del proyecto: propuesta interactiva

Para quien tenga que trabajar en esta web sin haber estado al principio.

## De dónde sale

Del artefacto `artefactos/propuesta-interactiva.html`, que se hizo en claude.ai y se exportó como página web independiente. Al convertirlo en proyecto se mantuvieron el diseño, los colores, las letras y el comportamiento, con dos cambios:

1. **Los datos y los textos salieron del código.** En el artefacto, los datos estaban en el objeto `PROPUESTA` al principio del script y los textos, mezclados con el HTML. Ahora los datos están en `src/contenido/propuesta.json`, tal cual, y los textos en `src/contenido/textos.json`. Se cambian sin tocar nada más.
2. **Se añadió la sección de contacto,** con un hueco para el formulario del CRM.

## Cómo está organizada la página

A la izquierda, el documento de la propuesta; a la derecha, el resumen fijo. En el móvil, una sola columna con el resumen al final. Entre paréntesis, la pieza de `src/componentes/` que dibuja cada parte:

1. **La cabecera** (`Cabecera.tsx`): la referencia, la fecha y la validez de la propuesta, el título y la entradilla.
2. **Paso 1 · Elige el plan** (`Planes.tsx`): las tres tarjetas. Sale elegido el plan de `planInicial`.
3. **Paso 2 · Ajusta los detalles** (`Ajustes.tsx`): la fecha de arranque y los extras. Un extra que ya trae el plan sale marcado, bloqueado y como «Incluido».
4. **Paso 3 · Qué incluye** (`Incluye.tsx`): lo que entra en el plan y en los extras, y lo que no.
5. **Paso 4 · El calendario** (`Calendario.tsx`): una barra por fase, una detrás de otra, y el soporte con borde discontinuo al final, si lo hay.
6. **¿Hablamos?** (`FormularioCrm.tsx`): el hueco del CRM.
7. **Tu elección** (`Resumen.tsx`): plan, duración, arranque, puesta en marcha, formación, equipo e inversión, y el botón «Aceptar este plan».

## Cómo se calcula

Lo hace `src/logica/calculo.ts`, igual que el artefacto:

- Las **semanas** son las de cada fase del plan; un extra puede alargar una fase concreta.
- El **precio** es el del plan más el de cada extra marcado que el plan no traiga ya incluido.
- La **puesta en marcha** es el viernes de la última semana, contando desde el lunes de arranque.
- El **soporte**, si lo hay, son doce semanas después de la puesta en marcha, y no la retrasa.

## Cambiar el contenido

| Quiero cambiar… | Fichero | Campo |
|---|---|---|
| El precio de un plan | `propuesta.json` | `precio` del plan, sin puntos ni símbolo |
| Las semanas de un plan | `propuesta.json` | `semanasPorFase`, una cifra por fase, en el orden de `fases` |
| Lo que incluye un plan | `propuesta.json` | `incluye`, con los `id` del `alcance` |
| Un extra | `propuesta.json` | `extras`: precio, horas, qué fase alarga (`semanas.fase`, contando desde 0) |
| La fecha de arranque que sale propuesta | `propuesta.json` | `inicioPorDefecto`, en formato AAAA-MM-DD |
| El plan que sale elegido | `propuesta.json` | `planInicial` |
| Un título o una frase | `textos.json` | el de su parte de la página |
| El correo de contacto | `textos.json` | `contacto.correo` |

Lo más cómodo es pedírselo a Claude: la skill de gestión de contenido cambia solo estos ficheros, pasa las pruebas y enseña el resultado.

## Comprobar que todo está bien

- Las **pruebas** (`npm test`) avisan si un cambio deja algo incoherente: un plan que incluye algo que no existe, un plan sin semanas para alguna fase, un extra que alarga una fase que no existe, un texto vacío o una fecha mal escrita.
- La **compilación** (`npm run build`) avisa si a `propuesta.json` le falta un campo.
- Y la **vista** en el navegador de la app, parte a parte, contra el artefacto original.

## Lo que no hace

No guarda nada. Si algún día tuviera que guardar la aceptación de cada cliente, haría falta un backend: es lo que se hace en el módulo 6 con otro artefacto.
