DROP TABLE test;

ALTER TABLE iznos_tovar_jur7 ADD COLUMN full_date DATE;

UPDATE iznos_tovar_jur7 SET full_date = '2025-01-01';

ALTER TABLE iznos_tovar_jur7 ALTER COLUMN full_date SET NOT NULL;