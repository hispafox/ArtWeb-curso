# Instalación: lo que necesita cada equipo

Esto se hace una vez en cada ordenador, antes de la primera sesión, y es lo único técnico del curso. A partir de aquí, todo se le pide a Claude hablando.

Vale para Windows y para Mac. Donde los pasos cambian, cada sistema tiene los suyos. Si tu ordenador lo gestiona el departamento de informática de la empresa, pásales esta página: casi todo pide permisos de administrador.

## Lo que se instala

| Qué | Para qué | ¿Hace falta? | Dónde se descarga |
|---|---|---|---|
| La aplicación de escritorio de Claude | Trae Claude Code en su pestaña **Code**, que es la herramienta del curso | Sí. Con un plan Pro, Max, Team o Enterprise: el gratuito no incluye Claude Code | https://claude.com/download |
| Git | Lo usa Claude para guardar las versiones y subirlas a GitHub (módulo 3) | Sí | https://git-scm.com/downloads/win (Windows) · https://git-scm.com/downloads/mac (Mac) |
| Node.js, versión LTS | Para ver en tu equipo las webs hechas con React antes de publicarlas (módulo 4), pasar sus pruebas y que funcione el hook que protege la rama principal (módulo 3) | Sí | https://nodejs.org/es/download |
| La CLI de GitHub (`gh`) | Para que Claude abra pull requests desde la app (módulo 3) | Sí | https://cli.github.com |
| Visual Studio Code | Para abrir la carpeta del curso y mirar los ficheros con calma, si quieres | No: recomendado | https://code.visualstudio.com/download |
| Un navegador al día | Para ver las webs publicadas y los paneles de GitHub, Vercel y Supabase | Sí (seguramente ya lo tienes) | Chrome, Edge, Safari o Firefox |

Y cuatro cuentas: Claude, GitHub, Vercel y Supabase. Están en el paso 6.

Instálalo en este orden. Al terminar cada instalación, cierra la aplicación de Claude y vuelve a abrirla, para que vea los programas nuevos.

## 1 · La aplicación de escritorio de Claude

1. Entra en https://claude.com/download y descarga la versión para tu sistema.
2. Instálala con las opciones que trae.
3. Ábrela e inicia sesión con tu cuenta de Claude, la de la empresa si la tienes.
4. Comprueba que arriba aparece la pestaña **Code**. Si no aparece, tu plan no incluye Claude Code.

## 2 · Git

**En Windows:**

1. Entra en https://git-scm.com/downloads/win y descarga el instalador de 64 bits.
2. Ábrelo y deja todas las opciones como vienen, pulsando *Next* hasta *Install*. La que importa ya viene marcada: la que deja usar Git desde la línea de comandos y desde otros programas, porque así lo encuentra Claude.
3. Con Git se instala también Git Bash, que Claude Code usa para lanzar las comprobaciones automáticas (los hooks) en Windows.

**En Mac:**

1. Abre la aplicación **Terminal**, la de Aplicaciones › Utilidades.
2. Escribe `git --version` y pulsa Intro.
3. Si Git no está, el Mac ofrece instalar las herramientas para desarrolladores (*Command Line Tools*). Acepta y espera a que termine. Si en vez de eso sale un número de versión, ya lo tienes.

**Tu nombre y tu correo en cada versión.** Git apunta en cada versión quién la ha guardado. La primera vez, pídeselo a Claude en una sesión de la pestaña Code:

> Configura Git con mi nombre, «Nombre Apellido», y mi correo, «tu-correo@empresa.com».

Usa **el mismo correo que tu cuenta de GitHub**. Con otro, GitHub no relaciona las versiones con tu cuenta y Vercel puede negarse a publicarlas.

## 3 · Node.js

1. Entra en https://nodejs.org/es/download y descarga la versión **LTS**, la de soporte largo. En octubre de 2026 es la 24. Las pruebas de las webs del curso piden como mínimo la 22.12.
2. Elige el instalador de tu sistema: el `.msi` en Windows y el `.pkg` en Mac.
3. Instálalo con las opciones que trae. Si te ofrece instalar herramientas adicionales para compilar módulos nativos, no hacen falta para el curso.

## 4 · La CLI de GitHub

La app ofrece instalarla la primera vez que Claude la necesita, pero es mejor dejarla lista antes.

1. Entra en https://cli.github.com y descarga el instalador de tu sistema.
2. Instálalo con las opciones que trae.
3. Inicia sesión con tu cuenta de GitHub. Este es el único comando que vas a escribir en el curso: abre una terminal (en Windows, **PowerShell**; en Mac, **Terminal**) y escribe:

   ```
   gh auth login
   ```

   Contesta así a sus preguntas: *GitHub.com*; *HTTPS*; *Yes*, para que Git use esta misma cuenta; y *Login with a web browser*. Te enseñará un código de ocho caracteres y abrirá el navegador. Pégalo allí y autoriza el acceso.

## 5 · Visual Studio Code (recomendado)

No hace falta para el curso: todo se hace desde la aplicación de Claude. Pero es la forma más cómoda de abrir la carpeta de un proyecto y ver sus ficheros, o de comparar lo que ha cambiado entre dos versiones.

**En Windows:**

1. Entra en https://code.visualstudio.com/download y descarga el instalador para Windows (*User Installer*).
2. En la pantalla de tareas adicionales, deja marcada **Agregar a PATH**. Si quieres abrir carpetas con el botón derecho, marca también las dos opciones **«Abrir con Code»**.
3. Termina la instalación.

**En Mac:**

1. Descarga la versión para Mac desde la misma página. Es un `.zip`.
2. Ábrelo y arrastra **Visual Studio Code** a la carpeta Aplicaciones.

Al abrirlo por primera vez, si te ofrece instalar el paquete de idioma español, acéptalo. VS Code también tiene una extensión de Claude Code, pero en el curso se trabaja con la aplicación de escritorio.

## 6 · Las cuentas y los conectores

| Cuenta | Para qué | Dónde se crea |
|---|---|---|
| **Claude** | La aplicación, con un plan que incluya Claude Code | La que ya usas, o https://claude.ai |
| **GitHub** | Guardar los artefactos y sus versiones. Actívale el segundo factor de autenticación. La organización de la empresa se ve en el módulo 3 | https://github.com/signup |
| **Vercel** | Publicar las webs. Conviene darse de alta con la cuenta de GitHub. El equipo de la empresa, en el plan Pro, se ve en el módulo 5 | https://vercel.com/signup |
| **Supabase** | El backend del módulo 6. Conviene darse de alta con la cuenta de GitHub | https://supabase.com/dashboard/sign-up |

Después, conecta Vercel y Supabase en la aplicación de Claude. Hay dos sitios: en la pestaña Code, el botón **+** › **Connectors**, y en Settings › Connectors. Cada uno abre el navegador para que inicies sesión y des permiso. Para GitHub, lo que usa Claude es la CLI del paso 4; si en la lista de conectores aparece GitHub, puedes conectarlo también.

## 7 · Comprueba que todo está

Abre una sesión nueva en la pestaña Code, con cualquier carpeta, y pídele:

> Comprueba si tengo instalados Git, Node.js, la CLI de GitHub y Visual Studio Code, dime qué versión tiene cada uno y si he iniciado sesión en la CLI de GitHub. No instales nada sin preguntarme.

Tiene que contestarte algo así:

| Programa | Lo que tiene que salir |
|---|---|
| Git | `git version 2.` y un número |
| Node.js | `v24.` y un número, o como mínimo `v22.12` |
| La CLI de GitHub | `gh version 2.` y un número, y que has iniciado sesión en github.com con tu cuenta |
| Visual Studio Code | Un número de versión, si lo has instalado |

Y pídele que mire los conectores:

> ¿Qué conectores tengo conectados y con qué cuenta está cada uno?

Cuando todo esté, descarga el repositorio del curso como explica el README, en «Cómo empezar».

## Si algo falla

- **Claude dice que no encuentra Git, Node.js o la CLI de GitHub, y los acabas de instalar:** cierra la aplicación de Claude y vuelve a abrirla. Si sigue sin verlos, reinicia el ordenador.
- **Node.js sale con una versión anterior a la 22.12:** instala la LTS encima; sustituye a la anterior.
- **La CLI de GitHub dice que no has iniciado sesión:** repite el paso 4.3.
- **En el Mac, `git --version` no ofrece instalar nada y tampoco da una versión:** descarga Git desde https://git-scm.com/downloads/mac, que explica las otras formas de instalarlo.
- **El ordenador no te deja instalar:** hacen falta permisos de administrador. Pídeselo a quien gestione los equipos de la empresa.
