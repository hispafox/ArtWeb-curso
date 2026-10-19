// Tests del hook que protege main. Se ejecutan con: node --test .claude/hooks/rama-protegida.test.mjs

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { trocear, palabras, analizar, evaluar, mensaje } from "./rama-protegida.mjs";

const PROYECTO = resolve("/proyecto");
const OTRO = resolve("/otro");

// Simula la rama de cada carpeta sin tocar Git
const ramas = mapa => carpeta => mapa[carpeta] ?? null;
const enMain = ramas({ [PROYECTO]: "main", [OTRO]: "mejora/pie" });
const enRama = ramas({ [PROYECTO]: "mejora/pie", [OTRO]: "main" });
const bloquea = (comando, ramaDe) => analizar(comando, PROYECTO, ramaDe).bloquear;

describe("trocear y palabras", () => {
  test("separa por &&, ||, ;, | y saltos de línea", () => {
    assert.deepEqual(trocear("git add . && git commit -m x; git push | cat\ngit status || echo no"),
      ["git add .", "git commit -m x", "git push", "cat", "git status", "echo no"]);
  });

  test("no rompe lo que va entre comillas", () => {
    assert.deepEqual(trocear('git commit -m "uno; dos && tres"'), ['git commit -m "uno; dos && tres"']);
  });

  test("quita las comillas al separar palabras", () => {
    assert.deepEqual(palabras(`git commit -m "texto con espacios" -m 'otro'`),
      ["git", "commit", "-m", "texto con espacios", "-m", "otro"]);
  });
});

describe("commit", () => {
  test("bloquea un commit en main", () => {
    assert.equal(bloquea('git commit -m "cambio"', enMain), true);
  });

  test("deja pasar un commit en otra rama", () => {
    assert.equal(bloquea('git commit -m "cambio"', enRama), false);
  });

  test("bloquea también commit --amend en main", () => {
    assert.equal(bloquea("git commit --amend --no-edit", enMain), true);
  });

  test("deja pasar si en el mismo comando se crea antes una rama", () => {
    assert.equal(bloquea("git checkout -b mejora/textos && git commit -m x", enMain), false);
    assert.equal(bloquea("git switch -c mejora/textos; git commit -m x", enMain), false);
  });

  test("bloquea si en el mismo comando se vuelve a main antes del commit", () => {
    assert.equal(bloquea("git switch main && git commit -m x", enRama), true);
    assert.equal(bloquea("git checkout main; git commit -m x", enRama), true);
  });

  test("sigue la carpeta con cd, Set-Location y git -C", () => {
    assert.equal(bloquea("cd ../otro && git commit -m x", enRama), true);
    assert.equal(bloquea("Set-Location ../otro; git commit -m x", enRama), true);
    assert.equal(bloquea("git -C ../otro commit -m x", enRama), true);
    assert.equal(bloquea("git -C ../otro commit -m x", enMain), false);
  });

  test("reconoce git con ruta completa, con & de PowerShell y con variables delante", () => {
    assert.equal(bloquea('& "C:/Program Files/Git/cmd/git.exe" commit -m x', enMain), true);
    assert.equal(bloquea("GIT_AUTHOR_NAME=Ana git commit -m x", enMain), true);
  });

  test("mira dentro de bash -c, powershell -Command y cmd /c", () => {
    assert.equal(bloquea('bash -c "git commit -m x"', enMain), true);
    assert.equal(bloquea('powershell -Command "git commit -m x"', enMain), true);
    assert.equal(bloquea('cmd /c "git commit -m x"', enMain), true);
  });

  test("no confunde un texto que solo menciona git commit", () => {
    assert.equal(bloquea('echo "git commit -m x"', enMain), false);
    assert.equal(bloquea("git log --oneline -5", enMain), false);
    assert.equal(bloquea("git status", enMain), false);
  });
});

describe("push", () => {
  test("bloquea un push estando en main", () => {
    assert.equal(bloquea("git push", enMain), true);
    assert.equal(bloquea("git push -u origin", enMain), true);
  });

  test("bloquea subir a main desde otra rama", () => {
    assert.equal(bloquea("git push origin main", enRama), true);
    assert.equal(bloquea("git push origin HEAD:main", enRama), true);
    assert.equal(bloquea("git push origin +mejora/pie:refs/heads/main", enRama), true);
  });

  test("bloquea subir todas las ramas de golpe", () => {
    assert.equal(bloquea("git push --all origin", enRama), true);
  });

  test("deja pasar el push de una rama de trabajo", () => {
    assert.equal(bloquea("git push", enRama), false);
    assert.equal(bloquea("git push -u origin mejora/pie", enRama), false);
    assert.equal(bloquea("git push origin HEAD", enRama), false);
  });

  test("deja pasar traer cambios de main", () => {
    assert.equal(bloquea("git pull", enMain), false);
    assert.equal(bloquea("git fetch origin main", enMain), false);
  });
});

describe("evaluar", () => {
  const entrada = (comando, herramienta = "Bash") =>
    JSON.stringify({ tool_name: herramienta, tool_input: { command: comando }, cwd: PROYECTO });

  test("devuelve 2 y explica el motivo cuando bloquea", () => {
    const r = evaluar(entrada("git commit -m x", "PowerShell"), enMain);
    assert.equal(r.codigo, 2);
    assert.match(r.mensaje, /rama main/);
    assert.match(r.mensaje, /pull request/);
  });

  test("devuelve 0 para otras herramientas, comandos sin git y entradas rotas", () => {
    assert.equal(evaluar(entrada("git commit -m x", "Write"), enMain).codigo, 0);
    assert.equal(evaluar(entrada("npm test"), enMain).codigo, 0);
    assert.equal(evaluar("esto no es JSON", enMain).codigo, 0);
  });

  test("si falla la comprobación, no deja pasar un commit", () => {
    const r = evaluar(entrada("git commit -m x"), () => { throw new Error("sin git"); });
    assert.equal(r.codigo, 2);
  });

  test("el mensaje distingue commit y push", () => {
    assert.match(mensaje({ accion: "commit", rama: "main" }), /guardar una versión/);
    assert.match(mensaje({ accion: "push", rama: "main" }), /subir cambios/);
  });
});

describe("el hook de verdad, con un repositorio de Git", () => {
  const script = join(dirname(fileURLToPath(import.meta.url)), "proteger-main.mjs");

  function repositorio(rama) {
    const carpeta = mkdtempSync(join(tmpdir(), "hook-main-"));
    execFileSync("git", ["init", "-q", "-b", rama], { cwd: carpeta });
    return carpeta;
  }

  function lanzar(carpeta, comando) {
    return spawnSync(process.execPath, [script], {
      input: JSON.stringify({ tool_name: "Bash", tool_input: { command: comando }, cwd: carpeta }),
      encoding: "utf8"
    });
  }

  test("bloquea el commit en main con código 2", () => {
    const carpeta = repositorio("main");
    try {
      const r = lanzar(carpeta, 'git commit -m "prueba"');
      assert.equal(r.status, 2);
      assert.match(r.stderr, /rama main/);
    } finally {
      rmSync(carpeta, { recursive: true, force: true });
    }
  });

  test("deja pasar el commit en una rama de trabajo", () => {
    const carpeta = repositorio("mejora/prueba");
    try {
      const r = lanzar(carpeta, 'git commit -m "prueba"');
      assert.equal(r.status, 0);
      assert.equal(r.stderr, "");
    } finally {
      rmSync(carpeta, { recursive: true, force: true });
    }
  });

  test("deja pasar en una carpeta que no es un repositorio", () => {
    const carpeta = mkdtempSync(join(tmpdir(), "hook-sin-git-"));
    try {
      assert.equal(lanzar(carpeta, "git commit -m x").status, 0);
    } finally {
      rmSync(carpeta, { recursive: true, force: true });
    }
  });
});
