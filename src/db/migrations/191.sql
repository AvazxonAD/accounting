ALTER TABLE
    smeta_grafik
ADD
    COLUMN main_schet_id INTEGER REFERENCES main_schet(id);

UPDATE
    smeta_grafik s
SET
    main_schet_id = (
        SELECT
            m.id
        FROM
            main_schet m
        WHERE
            m.spravochnik_budjet_name_id = s.spravochnik_budjet_name_id
            AND m.isdeleted = false
        ORDER BY
            m.id
        LIMIT
            1
    );