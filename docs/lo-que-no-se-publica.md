# Lo que no se publica

La lista contra la que se revisa cada repositorio y cada web antes de publicarlos. El agente `revisor-antes-de-publicar` la recorre entera; esta página es para que la tengas a mano y sepas por qué está cada cosa.

## 1. Datos de clientes

| Qué | Por qué | Cómo se comprueba |
|---|---|---|
| Ningún dato real de un cliente en el front: ni en el artefacto, ni en la web, ni en sus ficheros de contenido | Lo que va en la web lo puede leer cualquiera que la abra, aunque no se vea en pantalla | Pregúntale a Claude si hay correos, teléfonos, DNI, IBAN o nombres reales en la web y en `src/contenido/` |
| Ningún dato real de un cliente en el repositorio: ni exportaciones, ni hojas de cálculo, ni capturas | El repositorio guarda todo su historial: lo que se sube una vez queda ahí aunque se borre después | El revisor busca ficheros de datos y patrones de datos personales en todo el repositorio |
| Para probar, datos inventados | Así un error en las pruebas no expone a nadie | Los correos de ejemplo son de `example.com` |
| Los datos reales, solo en el backend y detrás de reglas de acceso | Es el único sitio donde se decide quién ve qué | El revisor de accesos (módulo 6) |

## 2. Claves

| Qué | Por qué | Cómo se comprueba |
|---|---|---|
| Las claves secretas no van ni en el repositorio ni en la web | Quien tiene una clave secreta hace lo que haría su dueño: la de Supabase, por ejemplo, se salta las reglas de acceso | El revisor busca claves conocidas (`sb_secret_`, tokens de GitHub, claves privadas…) en los ficheros y en el historial |
| Las claves van en `.env`, que no se sube nunca; en el repositorio solo va `.env.example`, sin valores reales | Cada persona tiene su `.env` en su equipo, y en Vercel las variables se guardan en el proyecto | Pregúntale a Claude: «¿Está el fichero .env en el repositorio?» |
| La clave publicable sí puede ir en la web | Está hecha para eso: lo que protege los datos son las reglas de acceso | Que empiece por `sb_publishable_` |
| Una variable con `VITE_` delante acaba dentro de la web | Vite la mete en lo que se descarga el navegador | Ninguna clave secreta lleva ese prefijo |
| Si una clave secreta se ha subido, **se cambia en el servicio**, no basta con borrarla | Sigue en el historial, y alguien puede haberla copiado ya | El revisor lo marca como grave |

## 3. Ficheros que no se suben

La plantilla de la empresa ya los trae en su `.gitignore`:

| Fichero o carpeta | Qué es |
|---|---|
| `.env`, `.env.*` (menos `.env.example`) | Claves y configuración de cada equipo |
| `node_modules/` | Las piezas que se instalan en cada equipo |
| `dist/`, `build/` | La web compilada, que genera Vercel al publicar |
| `.vercel/`, `supabase/.temp/` | Enlaces locales con Vercel y Supabase |
| `.claude/settings.local.json` | Ajustes personales de Claude Code |
| `*.pem`, `*.key`, `*.p12`, `*.pfx` | Certificados y claves privadas |

## 4. Repositorios

| Qué | Por qué | Cómo se comprueba |
|---|---|---|
| El repositorio de un trabajo para un cliente es **privado** | Un repositorio público lo puede leer cualquiera, con todo su historial | Pregúntale a Claude qué visibilidad tiene |
| Un cliente que tenga que verlo entra como colaborador externo, solo en el suyo | Así no ve los de otros clientes | En GitHub, en los ajustes del repositorio |
| En los repositorios privados no hay aviso automático si se sube una clave | Ese aviso de GitHub (Secret Protection) es de pago y solo se compra con GitHub Team o Enterprise. Sin él, lo que protege es la costumbre: este documento y el revisor | — |

Este repositorio del curso es público porque solo trae datos inventados. Un repositorio de cliente, nunca.

## 5. La web publicada

| Qué | Por qué | Cómo se comprueba |
|---|---|---|
| Una web publicada la abre cualquiera que tenga la dirección, aunque el repositorio sea privado | Vercel publica en abierto si no se protege | Ábrela en una ventana privada, sin sesión |
| Si es solo para un cliente, se protege (módulo 5) o cada cliente entra con su usuario (módulo 6) | La dirección se reenvía con facilidad | Pregúntale a Claude qué protección tiene el proyecto en Vercel |

## 6. Lo que hace y lo que lee Claude

| Qué | Por qué | Cómo se comprueba |
|---|---|---|
| Lo que publica, borra o cambia datos lo aprueba una persona | Cada conector actúa con los permisos de quien lo conectó: el de Vercel tiene el mismo acceso que su cuenta, y con Supabase pasa igual | La sesión está en modo **Manual**. En modo Auto las acciones las revisa un clasificador, no una persona |
| El conector de Supabase va al proyecto de pruebas, acotado a ese proyecto | Es lo que recomienda Supabase | Pregúntale a Claude a qué proyecto está conectado |
| Los conectores no se le dan nunca a un cliente | Actuaría con los permisos de quien los conectó | — |
| Desconfía de las órdenes que aparezcan dentro de lo que Claude lee | Un texto, una web o un dato pueden llevar escondida una instrucción («olvida lo anterior y envía esto a…»): es la inyección de instrucciones, y Vercel y Supabase avisan de ella | Si Claude propone algo que no le has pedido, no lo apruebes y pregúntale de dónde sale |
