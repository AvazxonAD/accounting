UPDATE naimenovanie_tovarov_jur7 SET name = 'product_name' WHERE name IS NULL;
UPDATE naimenovanie_tovarov_jur7 SET edin = 'product_measure' WHERE edin IS NULL;

ALTER TABLE naimenovanie_tovarov_jur7 ALTER COLUMN name SET NOT NULL;
ALTER TABLE naimenovanie_tovarov_jur7 ALTER COLUMN edin SET NOT NULL;


