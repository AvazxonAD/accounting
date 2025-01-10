ALTER TABLE group_jur7 DROP COLUMN eski_iznos_summa;

ALTER TABLE iznos_tovar_jur7 ADD COLUMN eski_iznos_summa DECIMAL DEFAULT 0;

