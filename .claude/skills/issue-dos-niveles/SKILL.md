---
name: issue-dos-niveles
description: Redacta y abre en GitHub un issue (una tarea del repositorio) escrito en dos niveles, arriba lo que entiende cualquiera del equipo y abajo el detalle técnico. Úsala cuando alguien pida apuntar una tarea, abrir un issue, dejar algo pendiente en el repositorio o convertir la petición de un cliente en tarea, y también al resolver o cerrar uno de esos issues.
---

# Issue en dos niveles

Quien te lo pide no programa. El issue tiene que poder leerlo cualquiera del equipo, y a la vez llevar lo necesario para que tú, u otra sesión de Claude, lo resuelva sin volver a preguntar.

## Pasos

1. **Entiende la tarea.** Qué hay que hacer, para quién, por qué y cómo se sabrá que está hecha. Si falta algo imprescindible, pregúntalo, como mucho dos preguntas. Lo demás, dedúcelo del repositorio y dilo en el borrador.
2. **Mira el repositorio** para el detalle técnico: qué ficheros o carpetas toca, si hay tests y cómo se comprueba.
3. **Redacta el issue** con la plantilla de abajo.
4. **Enséñale el borrador** y espera su visto bueno. No lo crees sin un sí.
5. **Créalo en el repositorio de esta carpeta.** Comprueba primero cuál es con `git remote -v` y no supongas el propietario. Usa la CLI de GitHub: `gh issue create --title "…" --body-file <fichero temporal>`. Si `gh` no está instalada o no tiene sesión iniciada, dilo y explica qué falta; la app ofrece instalarla.
6. **Devuelve el número y el enlace** del issue.

## Plantilla

Título: empieza por un verbo y dice el resultado, en castellano, en menos de 70 caracteres. Por ejemplo: «Añadir el número de versión al pie de la web».

```markdown
## Para el equipo

**Qué hay que hacer:** una o dos frases, sin jerga.

**Por qué:** qué gana el cliente o el equipo.

**Cómo sabremos que está hecho:**
- [ ] algo que se pueda comprobar mirando la web o el repositorio
- [ ] …

## Detalle técnico

**Dónde:** ficheros y carpetas que se tocan.

**Cómo:** los pasos, en orden.

**Comprobaciones:** tests, compilación y qué mirar en la vista previa.

**Riesgos o dudas:** lo que puede romperse o falta por decidir. Si no hay, «Ninguno».
```

## Reglas

- En la parte de arriba no hay términos técnicos. Si uno es inevitable, se explica en la misma frase.
- Ni claves, ni datos de clientes, ni enlaces privados en el issue. Si el repositorio es público, cualquiera puede leerlo.
- Un issue, una tarea. Si la petición mezcla varias, propón dividirla.

## Al resolver un issue

- Trabaja en una rama con su número, por ejemplo `issue-12-version-al-pie`. Nunca en `main`.
- En la descripción de la pull request escribe `Closes #12`, para que el issue se cierre solo cuando se acepte.
- Al terminar, marca en el issue las casillas de «Cómo sabremos que está hecho» que hayas comprobado y di cuáles quedan para que las mire una persona.
