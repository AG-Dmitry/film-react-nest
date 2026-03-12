\connect afisha

TRUNCATE TABLE schedules, films;

\set mongo_stub_json `node -e "const fs=require('fs');const path=require('path');const candidates=['test/mongodb_initial_stub.json','backend/test/mongodb_initial_stub.json'];const file=candidates.map(p=>path.resolve(process.cwd(),p)).find(fs.existsSync);if(!file){throw new Error('mongodb_initial_stub.json not found');}const data=JSON.parse(fs.readFileSync(file,'utf8'));process.stdout.write(JSON.stringify(data));"`

WITH seed AS (
  SELECT :'mongo_stub_json'::jsonb AS films
),
film_docs AS (
  SELECT jsonb_array_elements(seed.films) AS film
  FROM seed
)
INSERT INTO films (
  id,
  rating,
  director,
  tags,
  title,
  about,
  description,
  image,
  cover
)
SELECT
  film->>'id' AS id,
  (film->>'rating')::REAL AS rating,
  film->>'director' AS director,
  COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(film->'tags')),
    ARRAY[]::TEXT[]
  ) AS tags,
  film->>'title' AS title,
  film->>'about' AS about,
  film->>'description' AS description,
  film->>'image' AS image,
  film->>'cover' AS cover
FROM film_docs
ON CONFLICT (id) DO UPDATE
SET
  rating = EXCLUDED.rating,
  director = EXCLUDED.director,
  tags = EXCLUDED.tags,
  title = EXCLUDED.title,
  about = EXCLUDED.about,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  cover = EXCLUDED.cover;
