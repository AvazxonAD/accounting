UPDATE spravochnik_operatsii SET isdeleted = true AND id > 112;


INSERT INTO spravochnik_operatsii(name, schet, sub_schet, type_schet, smeta_id, budjet_id)
SELECT op.name, op.schet, op.sub_schet, op.type_schet, op.smeta_id, b.id
FROM spravochnik_operatsii AS op 
CROSS JOIN spravochnik_budjet_name AS b
WHERE b.isdeleted = false 
    AND b.id != 6
    AND op.isdeleted = false