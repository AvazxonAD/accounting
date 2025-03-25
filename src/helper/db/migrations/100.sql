DO $$ BEGIN IF EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'main_book'
        AND column_name = 'acsept_time'
) THEN
ALTER TABLE
    main_book RENAME COLUMN acsept_time TO accept_time;

END IF;

END $$;