---
name: documentar-proyecto
description: Escribe o pone al día la documentación de un proyecto web hecho a partir de un artefacto, el README (qué es, cómo se ve, cómo se cambia y cómo se publica) y la guía del proyecto, en dos niveles, uno para el equipo y otro técnico. Úsala cuando pidan documentar el proyecto, escribir o actualizar el README, hacer la guía, explicar cómo está montada la web o dejar el proyecto listo para que otra persona lo entienda.
---

# Documentar el proyecto

Quien lee la documentación puede ser alguien del equipo que no programa, el cliente o la persona técnica que lo mantenga dentro de un año. Por eso todo va en dos niveles: primero lo que entiende cualquiera, después el detalle técnico.

## Pasos

1. **Lee el proyecto antes de escribir.** El `package.json` (nombre, versión, órdenes), la estructura de carpetas, dónde están los textos y los datos (normalmente `src/contenido/`), cómo se publica (`vercel.json`, si existe), si tiene backend (`supabase/`) y qué variables de entorno pide (`.env.example`). No inventes nada que no esté en el repositorio: si algo no se puede saber, escribe «Por confirmar» y dilo al terminar.
2. **Escribe el `README.md`** en la carpeta raíz del proyecto, con la estructura de abajo. Si ya existe, actualízalo sin perder lo que siga siendo cierto.
3. **Escribe la guía** en `docs/guia-del-proyecto.md`: el recorrido completo, para quien tenga que trabajar en el proyecto sin haber estado al principio.
4. **Comprueba lo que afirmas.** Si dices que una orden pasa los tests o compila, ejecútala antes. Si nombras un fichero, que exista.
5. **Enséñale el resultado** y dile qué ha quedado «Por confirmar».

Si te piden la guía en Word, hazla con la herramienta de documentos que tengas disponible, con el mismo contenido, y guárdala en `docs/`.

## Estructura del README

```markdown
# Nombre del proyecto

Una frase: qué es y para quién.

## Para el equipo

- **Qué hace:** lo que ve y hace quien abre la web.
- **Dónde se ve:** la dirección publicada, o «Todavía sin publicar».
- **Cómo verla antes de publicar:** qué pedirle a Claude.
- **Cómo cambiar textos y datos:** qué fichero tiene qué, y qué pedirle a Claude.
- **Cómo se publica un cambio:** rama, vista previa, pull request.
- **¿Guarda datos?:** no, o dónde y quién puede verlos.

## Detalle técnico

- **Hecho con:** las piezas y sus versiones, sacadas del package.json.
- **Estructura:** las carpetas que importan, una línea cada una.
- **Órdenes:** las del package.json y para qué sirve cada una.
- **Pruebas:** qué comprueban.
- **Variables de entorno:** las de .env.example, sin valores reales.
- **Publicación:** dónde y cómo.
```

## Reglas

- Castellano llano, en frases cortas. Un término técnico se explica la primera vez que aparece.
- Ni claves, ni datos de clientes reales, ni direcciones privadas en la documentación.
- La documentación describe lo que hay, no lo que habrá. Lo pendiente va en una sección «Pendiente», o mejor en un issue.
