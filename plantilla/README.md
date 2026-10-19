# Plantilla de repositorio de la empresa

Cada artefacto que hace el equipo para un cliente tiene su propio repositorio, y todos salen de esta plantilla. Así, desde el primer día, cada uno trae las normas del equipo para Claude, la lista de ficheros que no se suben nunca y la regla que protege la rama principal.

## Qué trae

| Fichero | Para qué sirve |
|---|---|
| `CLAUDE.md` | Las normas del equipo. Claude las lee al empezar cada conversación en este repositorio |
| `README.md` | Esta página. Cuando el repositorio ya tenga su artefacto, se sustituye por la explicación del proyecto |
| `.gitignore` | La lista de ficheros que Git no sube nunca: claves, `.env`, `node_modules`… |
| `.claude/settings.json` | La configuración de Claude Code para este repositorio, con el hook que protege `main` |
| `.claude/hooks/proteger-main.mjs` | El hook: antes de cada comando de Bash o PowerShell, comprueba si va a guardar o subir cambios en `main` y, si es así, lo frena |
| `.claude/hooks/rama-protegida.mjs` | La lógica del hook |
| `.claude/hooks/rama-protegida.test.mjs` | Las pruebas del hook |

## Cómo se crea un repositorio nuevo

Esta carpeta vive en GitHub como un repositorio marcado como plantilla (Settings › «Template repository»). Para un artefacto nuevo se le pide a Claude:

> Crea un repositorio privado nuevo llamado `cliente-artefacto` a partir de la plantilla de la empresa y descárgalo en mi carpeta de trabajo.

El nombre lleva siempre el cliente delante, para que la lista de repositorios se lea de un vistazo.

## El hook que protege `main`

`main` es la rama que se publica para el cliente, así que en ella no se trabaja directamente: cada cambio se hace en una rama y llega a `main` con una pull request. El hook lo hace cumplir. Si se le pide a Claude que guarde o suba algo en `main`, contesta que no puede y propone crear una rama.

- Vigila los comandos de **Bash y de PowerShell**, porque en Windows Claude puede usar cualquiera de los dos.
- Está escrito para **Node.js**, así que funciona igual en Windows y en Mac.
- Frena el commit en `main`, el push estando en `main` y el push que apunta a `main` desde otra rama.
- **No frena** a quien edita a mano desde la web de GitHub ni a quien trabaja con Git fuera de Claude. Para eso están las reglas de protección de ramas de GitHub.

Para comprobar que funciona, se le pide a Claude:

> Pasa las pruebas del hook que protege main.
