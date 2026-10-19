-- Diagnóstico de madurez en IA: las respuestas del cuestionario y quién del equipo puede verlas.
--
-- En lenguaje llano:
--   · Cualquiera que abra la web puede ENVIAR su diagnóstico, pero no puede LEER ninguno, ni el suyo.
--   · Solo las personas dadas de alta en «miembros_equipo», con su sesión iniciada, leen los diagnósticos.
--   · Nadie puede cambiar ni borrar un diagnóstico desde la web.
--   · Los miembros del equipo los da de alta una persona administradora, no la web.

-- 1. Los diagnósticos que envía quien contesta el cuestionario
create table public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  empresa text check (empresa is null or char_length(empresa) between 1 and 120),
  correo text check (correo is null or (char_length(correo) <= 254 and correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  acepta_contacto boolean not null default false,
  -- Una respuesta por pregunta, en su orden: de 1 a 4
  contestaciones smallint[] not null check (
    array_length(contestaciones, 1) between 1 and 50
    and 1 <= all (contestaciones)
    and 4 >= all (contestaciones)
  ),
  -- La media sobre 4 y el nivel que salen en el informe
  media numeric(3, 2) not null check (media between 1 and 4),
  nivel text not null check (nivel in ('Explorando', 'Probando', 'Integrando', 'Transformando')),
  -- Si deja el correo, tiene que haber aceptado que le escriban
  constraint correo_con_permiso check (correo is null or acepta_contacto)
);

comment on table public.diagnosticos is 'Diagnósticos de madurez en IA enviados desde la web. Los lee solo el equipo.';

create index diagnosticos_creado_en_idx on public.diagnosticos (creado_en desc);

-- 2. Las personas del equipo que pueden ver los diagnósticos en el panel
create table public.miembros_equipo (
  usuario_id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 120),
  alta_en timestamptz not null default now()
);

comment on table public.miembros_equipo is 'Quién del equipo entra en el panel. Se da de alta a mano, nunca desde la web.';

-- 3. Reglas de acceso (RLS) en todas las tablas: sin una regla que lo permita, no se puede nada
alter table public.diagnosticos enable row level security;
alter table public.miembros_equipo enable row level security;

-- 4. Permisos de partida: se quitan todos y se da solo lo necesario
revoke all on public.diagnosticos from anon, authenticated;
revoke all on public.miembros_equipo from anon, authenticated;

-- Quien contesta solo puede rellenar estas columnas: ni el id ni la fecha
grant insert (empresa, correo, acepta_contacto, contestaciones, media, nivel)
  on public.diagnosticos to anon, authenticated;
grant select on public.diagnosticos to authenticated;
grant select on public.miembros_equipo to authenticated;

-- 5. Las reglas, una por cosa que se permite
create policy "Cualquiera envía su diagnóstico"
  on public.diagnosticos
  for insert
  to anon, authenticated
  with check (correo is null or acepta_contacto);

create policy "Solo el equipo lee los diagnósticos"
  on public.diagnosticos
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.miembros_equipo m
      where m.usuario_id = (select auth.uid())
    )
  );

create policy "Cada miembro ve solo su propia ficha"
  on public.miembros_equipo
  for select
  to authenticated
  using (usuario_id = (select auth.uid()));
