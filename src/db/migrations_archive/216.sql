DO $$ BEGIN IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'odinox_child'
        AND column_name = 'type_id'
) THEN
ALTER TABLE
    odinox_child
ADD
    COLUMN type_id INTEGER REFERENCES odinox_type(id) NOT NULL;

END IF;

END $$;