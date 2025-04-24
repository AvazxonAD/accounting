ALTER TABLE
    shartnoma_grafik
ADD
    COLUMN main_schet_id INTEGER REFERENCES main_schet(id);

UPDATE
    shartnoma_grafik c
SET
    main_schet_id = (
        SELECT
            m.id
        FROM
            main_schet m
            JOIN users u ON m.user_id = u.id
            JOIN regions r ON r.id = u.region_id
        WHERE
            m.spravochnik_budjet_name_id = c.budjet_id
            AND m.isdeleted = false
            AND r.id = (
                SELECT
                    _r.id
                FROM
                    users _u
                    JOIN regions _r ON _r.id = _u.region_id
                WHERE
                    _u.id = c.user_id
            )
        LIMIT
            1
    );

UPDATE
    shartnoma_grafik c
SET
    main_schet_id = (
        SELECT
            m.id
        FROM
            main_schet m
            JOIN users u ON m.user_id = u.id
            JOIN regions r ON r.id = u.region_id
        WHERE
            m.isdeleted = false
            AND r.id = (
                SELECT
                    _r.id
                FROM
                    users _u
                    JOIN regions _r ON _r.id = _u.region_id
                WHERE
                    _u.id = c.user_id
            )
        LIMIT
            1
    )
WHERE
    main_schet_id IS NULL;