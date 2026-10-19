# Normas del equipo para Claude

Este repositorio guarda un artefacto que hace el equipo para un cliente: una propuesta, una calculadora, un panel, un formulario… Quien te habla no programa. Trabaja contigo hablando y tú haces la parte técnica.

## Este proyecto

Rellénalo al crear el repositorio, o pídele a Claude que lo rellene:

- **Cliente:** _(nombre del cliente)_
- **Qué es:** _(una frase: qué hace el artefacto y para quién)_
- **Dónde se publica:** _(la dirección de Vercel, cuando la haya)_
- **¿Guarda datos?** _(no / sí, en Supabase)_

## Cómo trabajamos

1. **En `main` no se trabaja nunca.** `main` es lo que ve el cliente. Cada cambio va en su rama (`mejora/…`, `arreglo/…`, `contenido/…`), se revisa en su vista previa y llega a `main` con una pull request que acepta una persona. Un hook de este repositorio te impide guardar o subir cambios en `main`: si te lo piden, explica por qué no puedes y propón la rama.
2. **Antes de crear, publicar, borrar o tocar datos, pregunta.** Explica en lenguaje llano qué vas a hacer y qué cambia, y espera a que te digan que sí. Vale para GitHub, para Vercel, para Supabase y para cualquier otro conector.
3. **Explica en dos niveles.** Primero, lo que entiende cualquiera del equipo: qué has hecho y cómo se comprueba. Después, si hace falta, el detalle técnico.
4. **Nada de claves ni datos de clientes en el repositorio.** Las claves van en `.env`, que no se sube nunca; en el repositorio solo va `.env.example`, sin valores reales. Para probar se usan datos inventados.
5. **Lo que está en el front es público.** Todo lo que lleva la web lo puede leer quien la abra. Lo que no deba verse va en el backend, con sus reglas de acceso.
6. **Textos y datos, aparte del diseño.** Si conviertes un artefacto en web, deja los textos y los datos en ficheros JSON propios (`src/contenido/`), para que se puedan cambiar sin tocar el diseño. Respeta los colores, las fuentes y las imágenes del artefacto original.
7. **Comprueba antes de dar algo por hecho.** Pasa los tests y la compilación antes de proponer una pull request, y enseña el resultado en el navegador de la app. Si dices que has creado o cambiado un fichero, di cuál.
8. **Las tareas, como issues en dos niveles:** arriba lo que entiende el equipo, abajo el detalle técnico.
9. **Mensajes de commit en castellano,** que digan qué cambia y por qué.

## Lo que no hace falta preguntar

Leer ficheros, buscar en el repositorio, pasar los tests, compilar y enseñar la web en el navegador de la app.
