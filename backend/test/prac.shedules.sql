\connect afisha

TRUNCATE TABLE schedules;

\set mongo_stub_json `node -e "const fs=require('fs');const path=require('path');const candidates=['test/mongodb_initial_stub.json','backend/test/mongodb_initial_stub.json'];const file=candidates.map(p=>path.resolve(process.cwd(),p)).find(fs.existsSync);if(!file){throw new Error('mongodb_initial_stub.json not found');}const data=JSON.parse(fs.readFileSync(file,'utf8'));process.stdout.write(JSON.stringify(data));"`

WITH seed AS (
  SELECT :'mongo_stub_json'::jsonb AS films
),
film_docs AS (
  SELECT jsonb_array_elements(seed.films) AS film
  FROM seed
),
schedule_docs AS (
  SELECT
    film->>'id' AS film_id,
    jsonb_array_elements(film->'schedule') AS session
  FROM film_docs
)
INSERT INTO schedules (
  id,
  film_id,
  daytime,
  hall,
  "rows",
  seats,
  price,
  taken
)
SELECT
  session->>'id' AS id,
  film_id,
  (session->>'daytime')::TIMESTAMPTZ AS daytime,
  (session->>'hall')::INTEGER AS hall,
  (session->>'rows')::INTEGER AS "rows",
  (session->>'seats')::INTEGER AS seats,
  (session->>'price')::INTEGER AS price,
  COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(session->'taken')),
    ARRAY[]::TEXT[]
  ) AS taken
FROM schedule_docs
ON CONFLICT (id) DO UPDATE
SET
  film_id = EXCLUDED.film_id,
  daytime = EXCLUDED.daytime,
  hall = EXCLUDED.hall,
  "rows" = EXCLUDED."rows",
  seats = EXCLUDED.seats,
  price = EXCLUDED.price,
  taken = EXCLUDED.taken;
