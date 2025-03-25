ALTER TABLE group_jur7 ADD COLUMN kimni_buynida BIGINT REFERENCES spravochnik_javobgar_shaxs_jur7(id);

UPDATE group_jur7 SET kimni_buynida = (SELECT id FROM spravochnik_javobgar_shaxs_jur7 WHERE isdeleted = false LIMIT 1);

ALTER TABLE group_jur7 ALTER COLUMN kimni_buynida SET NOT NULL;
