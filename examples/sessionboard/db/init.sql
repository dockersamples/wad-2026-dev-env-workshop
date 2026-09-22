create table sessions (
  id        serial primary key,
  title     text        not null,
  speaker   text        not null,
  track     text        not null,
  starts_at timestamptz not null
);

create table ratings (
  id         serial primary key,
  session_id integer not null references sessions (id),
  score      integer not null check (score between 1 and 5),
  created_at timestamptz not null default now()
);

insert into sessions (title, speaker, track, starts_at) values
  ('The AI-Ready Developer Environment', 'Michael Irwin', 'DevOps',   '2026-09-23 10:00+02'),
  ('Everything I Know About Caching Is Wrong', 'A. Speaker', 'Backend',  '2026-09-23 11:30+02'),
  ('Shipping Without a Staging Environment',   'B. Speaker', 'Platform', '2026-09-23 14:00+02');
