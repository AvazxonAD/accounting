ALTER TABLE iznos_tovar_jur7 ADD COLUMN iznos_summa DECIMAL;

UPDATE iznos_tovar_jur7 SET iznos_summa = sena * 0.1;

ALTER TABLE iznos_tovar_jur7 ALTER COLUMN iznos_summa SET NOT NULL;