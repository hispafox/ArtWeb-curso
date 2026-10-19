// Hook PreToolUse de Claude Code, configurado en ../settings.json.
// Antes de cada comando de Bash o PowerShell, Claude Code le pasa el comando por la entrada estándar.
// Si el comando guarda (commit) o sube (push) cambios en main, sale con código 2 y Claude no lo ejecuta.

import { evaluar } from "./rama-protegida.mjs";

let entrada = "";
process.stdin.setEncoding("utf8");
for await (const trozo of process.stdin) entrada += trozo;

const { codigo, mensaje } = evaluar(entrada);
if (mensaje) process.stderr.write(mensaje + "\n");
process.exit(codigo);
