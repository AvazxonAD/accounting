UPDATE
    saldo_naimenovanie_jur7
SET
    prixod_id = REGEXP_REPLACE(prixod_id, '(^|,)null(,|$)', '\1', 'g')
WHERE
    prixod_id ILIKE '%null%';