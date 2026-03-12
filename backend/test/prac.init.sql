DROP DATABASE IF EXISTS afisha;
CREATE DATABASE afisha;
\connect afisha

DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE films (
  id VARCHAR PRIMARY KEY,
  rating REAL NOT NULL,
  director VARCHAR NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  title VARCHAR NOT NULL,
  about TEXT NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR NOT NULL,
  cover VARCHAR NOT NULL
);

CREATE TABLE schedules (
  id VARCHAR PRIMARY KEY,
  film_id VARCHAR NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  daytime TIMESTAMPTZ NOT NULL,
  hall INTEGER NOT NULL,
  "rows" INTEGER NOT NULL,
  seats INTEGER NOT NULL,
  price INTEGER NOT NULL,
  taken TEXT[] NOT NULL DEFAULT '{}',
  CONSTRAINT uq_schedule_film_hall_daytime UNIQUE (film_id, hall, daytime)
);
