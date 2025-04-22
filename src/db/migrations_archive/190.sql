DO $$ BEGIN IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'kassa'
) THEN
ALTER TABLE
    access
ADD
    COLUMN kassa BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'bank'
) THEN
ALTER TABLE
    access
ADD
    COLUMN bank BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'jur3'
) THEN
ALTER TABLE
    access
ADD
    COLUMN jur3 BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'jur4'
) THEN
ALTER TABLE
    access
ADD
    COLUMN jur4 BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'jur5'
) THEN
ALTER TABLE
    access
ADD
    COLUMN jur5 BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'jur7'
) THEN
ALTER TABLE
    access
ADD
    COLUMN jur7 BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'jur8'
) THEN
ALTER TABLE
    access
ADD
    COLUMN jur8 BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'spravochnik'
) THEN
ALTER TABLE
    access
ADD
    COLUMN spravochnik BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'region'
) THEN
ALTER TABLE
    access
ADD
    COLUMN region BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'main_book'
) THEN
ALTER TABLE
    access
ADD
    COLUMN main_book BOOLEAN NOT NULL DEFAULT FALSE;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'created_at'
) THEN
ALTER TABLE
    access
ADD
    COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'updated_at'
) THEN
ALTER TABLE
    access
ADD
    COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'role_id'
) THEN
ALTER TABLE
    access
ADD
    COLUMN role_id INTEGER REFERENCES role(id) NOT NULL;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'region_id'
) THEN
ALTER TABLE
    access
ADD
    COLUMN region_id INTEGER REFERENCES regions(id) NOT NULL;

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'access'
        AND column_name = 'isdeleted'
) THEN
ALTER TABLE
    access
ADD
    COLUMN isdeleted BOOLEAN DEFAULT FALSE;

END IF;

END;

$$ LANGUAGE plpgsql;