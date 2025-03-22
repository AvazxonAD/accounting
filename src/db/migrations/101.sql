ALTER TABLE
    main_schet
ADD
    COLUMN jur5_schet VARCHAR;

UPDATE
    main_schet
SET
    jur5_schet = 'jur5_schet';

ALTER TABLE
    main_schet
ALTER COLUMN
    jur5_schet
SET
    NOT NULL;

ALTER TABLE
    main_schet
ADD
    COLUMN jur7_schet VARCHAR;

UPDATE
    main_schet
SET
    jur7_schet = 'jur7_schet';

ALTER TABLE
    main_schet
ALTER COLUMN
    jur7_schet
SET
    NOT NULL;