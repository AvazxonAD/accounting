ALTER TABLE
    shartnomalar_organization
ADD
    COLUMN main_schet_id INTEGER REFERENCES main_schet(id);

UPDATE
    shartnomalar_organization c
SET
    main_schet_id = (
        SELECT
            id
        FROM
            main_schet m
        WHERE
            m.spravochnik_budjet_name_id = c.budjet_id
            AND m.isdeleted = false
        ORDER BY
            m.id
        LIMIT
            1
    );