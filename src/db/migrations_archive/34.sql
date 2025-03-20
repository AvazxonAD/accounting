UPDATE spravochnik_operatsii SET budjet_id = (SELECT id FROM spravochnik_budjet_name WHERE isdeleted = false LIMIT 1);
ALTER TABLE spravochnik_operatsii ALTER COLUMN budjet_id SET NOT NULL;