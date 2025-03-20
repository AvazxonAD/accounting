ALTER TABLE iznos_tovar_jur7 
ADD COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

UPDATE iznos_tovar_jur7 
SET budjet_id = (SELECT id FROM spravochnik_budjet_name WHERE isdeleted = false LIMIT 1);

ALTER TABLE iznos_tovar_jur7 
ALTER COLUMN budjet_id SET NOT NULL;
