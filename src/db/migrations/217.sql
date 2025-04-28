DELETE FROM
    odinox_child;

DELETE FROM
    odinox;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'odinox_child'
          AND column_name = 'is_year'
    ) THEN
        ALTER TABLE odinox_child
        ADD COLUMN is_year BOOLEAN;
    END IF;
END
$$;
