ALTER TABLE iznos_tovar_jur7 ADD COLUMN year INTEGER;
ALTER TABLE iznos_tovar_jur7 ADD COLUMN month INTEGER;

UPDATE iznos_tovar_jur7 SET year = 2024, month = 6;

ALTER TABLE iznos_tovar_jur7 ALTER COLUMN month SET NOT NULL;
ALTER TABLE iznos_tovar_jur7 ALTER COLUMN year SET NOT NULL;