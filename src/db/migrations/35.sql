-- 1. Eski operatsiyalar uchun budjet_id ni "Respublika budjeti" ga o‘rnatish, faqat NULL bo‘lganlar uchun
UPDATE spravochnik_operatsii 
SET budjet_id = (
    SELECT id FROM spravochnik_budjet_name  
    WHERE isdeleted = false 
    AND name = 'Respublika budjeti'
    LIMIT 1
)
WHERE budjet_id IS NULL;

-- 2. Yangi qatorlarni qo‘shish
INSERT INTO spravochnik_operatsii(name, schet, sub_schet, type_schet, smeta_id, budjet_id)
SELECT op.name, op.schet, op.sub_schet, op.type_schet, op.smeta_id, b.id
FROM spravochnik_operatsii AS op 
CROSS JOIN spravochnik_budjet_name AS b
WHERE b.isdeleted = false 
AND op.budjet_id IS NOT NULL  -- NULL bo'lgan eski qatorlarni chetlab o'tish
AND op.budjet_id != (
    SELECT id FROM spravochnik_budjet_name  
    WHERE isdeleted = false 
    AND name = 'Respublika budjeti'
    LIMIT 1
);
