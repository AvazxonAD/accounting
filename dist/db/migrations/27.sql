ALTER TABLE spravochnik_operatsii ADD COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

UPDATE spravochnik_operatsii SET budjet_id = (SELECT id FROM spravochnik_budjet_name WHERE isdeleted = false LIMIT 1);

ALTER TABLE spravochnik_operatsii ALTER COLUMN budjet_id SET NOT NULL;