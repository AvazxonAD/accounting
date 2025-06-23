UPDATE
    saldo_naimenovanie_jur7 s
SET
    isdeleted = true
WHERE
    s.isdeleted = false
    AND s.type = 'prixod'
    AND NOT EXISTS (
        SELECT
            1
        FROM
            document_prixod_jur7 dj
        WHERE
            dj.isdeleted = false
            AND dj.id = ANY (
                CASE
                    WHEN s.prixod_id IS NULL
                    OR s.prixod_id = ''
                    OR s.prixod_id = 'null' THEN ARRAY [0] :: INTEGER []
                    ELSE string_to_array(s.prixod_id, ',') :: INTEGER []
                END
            )
    );