UPDATE
    shartnomalar_organization c
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