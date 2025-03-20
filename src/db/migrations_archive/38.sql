UPDATE spravochnik_operatsii
SET sub_schet = REGEXP_REPLACE(sub_schet, '\s+', '', 'g');