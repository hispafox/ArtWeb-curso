// Lógica del hook que impide guardar (commit) o subir (push) cambios en la rama principal.
// La usa proteger-main.mjs, que es lo que ejecuta Claude Code antes de cada comando de Bash o PowerShell.

import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

export const RAMAS_PROTEGIDAS = ["main"];

const OPCIONES_CREAR_RAMA = ["-b", "-B", "-c", "-C", "--create", "--force-create", "--orphan"];
const CAMBIAR_CARPETA = ["cd", "chdir", "pushd", "set-location", "sl", "push-location"];

// Rama actual de una carpeta, o null si no es un repositorio o no hay Git.
export function ramaGit(carpeta) {
  try {
    return execFileSync("git", ["symbolic-ref", "--short", "-q", "HEAD"], {
      cwd: carpeta, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000
    }).trim() || null;
  } catch {
    return null;
  }
}

// Parte un comando en tramos por &&, ||, ;, |, & y saltos de línea, sin romper lo que va entre comillas.
export function trocear(comando) {
  const tramos = [];
  let actual = "";
  let comilla = null;
  for (let i = 0; i < comando.length; i++) {
    const c = comando[i];
    if (comilla) {
      if (c === comilla) comilla = null;
      actual += c;
    } else if (c === '"' || c === "'") {
      comilla = c;
      actual += c;
    } else if (c === ";" || c === "|" || c === "&" || c === "\n" || c === "\r") {
      tramos.push(actual);
      actual = "";
      if ((c === "&" || c === "|") && comando[i + 1] === c) i++;
    } else {
      actual += c;
    }
  }
  tramos.push(actual);
  return tramos.map(t => t.trim()).filter(Boolean);
}

// Parte un tramo en palabras, quitando las comillas.
export function palabras(tramo) {
  const lista = [];
  let actual = "";
  let hayPalabra = false;
  let comilla = null;
  for (const c of tramo) {
    if (comilla) {
      if (c === comilla) comilla = null;
      else actual += c;
    } else if (c === '"' || c === "'") {
      comilla = c;
      hayPalabra = true;
    } else if (/\s/.test(c)) {
      if (hayPalabra) lista.push(actual);
      actual = "";
      hayPalabra = false;
    } else {
      actual += c;
      hayPalabra = true;
    }
  }
  if (hayPalabra) lista.push(actual);
  return lista;
}

const esGit = palabra => /(^|[\\/])git(\.exe)?$/i.test(palabra);
const nombreRama = ref => ref.replace(/^\+/, "").replace(/^refs\/heads\//, "");

// Decide si un comando guarda o sube cambios a una rama protegida.
// ramaDe(carpeta) devuelve la rama actual de esa carpeta; en los tests se sustituye.
export function analizar(comando, carpeta, ramaDe = ramaGit, estado = { simuladas: new Map() }) {
  const ramaEn = dir => (estado.simuladas.has(dir) ? estado.simuladas.get(dir) : ramaDe(dir));
  let dir = carpeta;

  for (const tramo of trocear(comando)) {
    const p = palabras(tramo);
    // Fuera lo que va delante de la orden: el operador & de PowerShell, variables (X=1) y env
    while (p.length && (p[0] === "&" || p[0] === "env" || /^[A-Za-z_][A-Za-z0-9_]*=/.test(p[0]))) p.shift();
    if (p.length === 0) continue;
    const orden = p[0].toLowerCase();

    // Cambios de carpeta: cd, Set-Location…
    if (CAMBIAR_CARPETA.includes(orden)) {
      const destino = p.slice(1).find(x => !x.startsWith("-"));
      if (destino) dir = resolve(dir, destino);
      continue;
    }

    // Comandos dentro de otra shell: bash -c "…", powershell -Command "…", cmd /c "…"
    const interior = comandoInterior(p);
    if (interior !== null) {
      const r = analizar(interior, dir, ramaDe, estado);
      if (r.bloquear) return r;
      continue;
    }

    if (!esGit(p[0])) continue;

    // Opciones de git antes de la orden: -C carpeta, -c clave=valor, --no-pager…
    let i = 1;
    let dirGit = dir;
    while (i < p.length && p[i].startsWith("-")) {
      if (p[i] === "-C") { dirGit = resolve(dir, p[i + 1] || "."); i += 2; }
      else if (p[i] === "-c") i += 2;
      else i++;
    }
    const sub = (p[i] || "").toLowerCase();
    const resto = p.slice(i + 1);

    if (sub === "checkout" || sub === "switch") {
      const corte = resto.indexOf("--");
      const args = corte >= 0 ? resto.slice(0, corte) : resto;
      const crear = args.findIndex(a => OPCIONES_CREAR_RAMA.includes(a));
      if (crear >= 0 && args[crear + 1]) estado.simuladas.set(dirGit, args[crear + 1]);
      else if (args.includes("--detach") || (sub === "switch" && args.includes("-d"))) estado.simuladas.set(dirGit, null);
      else {
        const destino = args.find(a => !a.startsWith("-"));
        if (destino) estado.simuladas.set(dirGit, destino);
        else if (args.includes("-")) estado.simuladas.delete(dirGit);
      }
      continue;
    }

    if (sub === "commit") {
      const rama = ramaEn(dirGit);
      if (RAMAS_PROTEGIDAS.includes(rama)) return { bloquear: true, accion: "commit", rama };
      continue;
    }

    if (sub === "push") {
      const rama = ramaEn(dirGit);
      if (resto.includes("--all") || resto.includes("--mirror")) {
        return { bloquear: true, accion: "push", rama: RAMAS_PROTEGIDAS[0] };
      }
      const posicionales = resto.filter(a => !a.startsWith("-"));
      const refspecs = posicionales.slice(1); // el primero es el remoto
      const destinos = refspecs.length
        ? refspecs.map(r => nombreRama(r.includes(":") ? r.split(":").pop() : r)).map(d => (d === "HEAD" ? rama : d))
        : [rama];
      const protegida = destinos.find(d => RAMAS_PROTEGIDAS.includes(d));
      if (protegida) return { bloquear: true, accion: "push", rama: protegida };
    }
  }
  return { bloquear: false };
}

function comandoInterior(p) {
  const orden = p[0].toLowerCase().replace(/\.exe$/, "").split(/[\\/]/).pop();
  if (["bash", "sh", "zsh"].includes(orden)) {
    const i = p.indexOf("-c");
    return i >= 0 && p[i + 1] !== undefined ? p[i + 1] : null;
  }
  if (["powershell", "pwsh"].includes(orden)) {
    const i = p.findIndex(x => /^-(c|command)$/i.test(x));
    return i >= 0 ? p.slice(i + 1).join(" ") : null;
  }
  if (orden === "cmd") {
    const i = p.findIndex(x => /^\/[ck]$/i.test(x));
    return i >= 0 ? p.slice(i + 1).join(" ") : null;
  }
  return null;
}

export function mensaje({ accion, rama }) {
  const que = accion === "commit" ? "guardar una versión (commit)" : "subir cambios (push)";
  return [
    `Bloqueado por la norma del equipo: no se puede ${que} en la rama ${rama}.`,
    `La rama ${rama} es la que se publica para el cliente, así que en ella no se trabaja directamente.`,
    "Explícale a la persona por qué no puedes hacerlo y proponle crear una rama para este cambio",
    "(por ejemplo, mejora/descripcion-corta), guardar allí la versión y abrir una pull request."
  ].join("\n");
}

// Recibe el JSON que manda Claude Code y devuelve el código de salida: 2 bloquea, 0 deja pasar.
export function evaluar(textoEntrada, ramaDe = ramaGit) {
  let entrada;
  try {
    entrada = JSON.parse(textoEntrada);
  } catch {
    return { codigo: 0 };
  }
  const herramienta = entrada?.tool_name;
  const comando = entrada?.tool_input?.command;
  if (!["Bash", "PowerShell"].includes(herramienta) || typeof comando !== "string") return { codigo: 0 };
  if (!/git/i.test(comando)) return { codigo: 0 };

  try {
    const resultado = analizar(comando, entrada.cwd || process.cwd(), ramaDe);
    return resultado.bloquear ? { codigo: 2, mensaje: mensaje(resultado) } : { codigo: 0 };
  } catch {
    // Si algo falla al comprobarlo, un commit o un push no pasan sin revisar
    if (/\bgit\b[\s\S]*\b(commit|push)\b/i.test(comando)) {
      return { codigo: 2, mensaje: "No he podido comprobar en qué rama estás, así que no dejo guardar ni subir cambios. Pídele a la persona que lo revise." };
    }
    return { codigo: 0 };
  }
}
