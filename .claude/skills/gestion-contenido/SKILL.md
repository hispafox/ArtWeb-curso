---
name: gestion-contenido
description: Cambia los textos y los datos de una web hecha a partir de un artefacto (títulos, frases, precios, planes, fechas, preguntas frecuentes, listas) sin tocar el diseño ni el código, editando solo los ficheros de contenido. Úsala cuando pidan cambiar un texto, un precio, un plan, una fecha o un dato de la web, corregir una errata o añadir o quitar un elemento de una lista.
---

# Gestión de contenido

La web separa el contenido del diseño: los textos y los datos están en ficheros JSON (normalmente en `src/contenido/`) y el resto es diseño y código. Esta skill cambia solo el contenido, para que quien no programa pueda pedir cambios sin riesgo de romper la web.

## Pasos

1. **Localiza el contenido.** Busca la carpeta de contenido del proyecto y su `README.md`, si lo tiene. Identifica en qué fichero y en qué campo está lo que hay que cambiar.
2. **Comprueba que es un cambio de contenido.** Si para hacerlo hay que tocar componentes, estilos o código (un color, una sección nueva, otro orden de las secciones), **para**: explica que eso es un cambio de diseño y pregunta si se hace como tal, en su propia rama.
3. **Haz el cambio en una rama**, nunca en `main`: por ejemplo `contenido/precio-profesional`.
4. **Edita solo los ficheros de contenido.** Respeta su forma:
   - No cambies los nombres de los campos ni los `id`; solo los valores.
   - No borres las marcas entre llaves, como `{semanas}` o `{fecha}`: las rellena la web.
   - Los números van sin comillas (`4900`, no `"4.900 €"`): el formato lo pone la web.
   - Las fechas, en formato `AAAA-MM-DD`.
   - Si añades un elemento a una lista, cópiale la forma a uno que ya exista.
5. **Comprueba:** pasa las pruebas y la compilación del proyecto. Las pruebas de contenido avisan de un plan que incluye algo que no existe, de un texto vacío o de una fecha mal escrita.
6. **Enséñalo:** abre la web en el navegador de la app, en la sección que ha cambiado, y di en una frase qué cambió y dónde.
7. **Guarda la versión** con un mensaje que diga el cambio («Sube el plan Implantación a 26.000 €») y, si te lo piden, abre la pull request.

## Lo que no hace esta skill

- No cambia colores, letras, imágenes ni la disposición de la página.
- No mete datos de clientes reales ni nada que no deba ser público: todo lo que va en la web lo puede leer quien la abra.
- No da por bueno un cambio sin haberlo visto en la web.
