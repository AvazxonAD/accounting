ALTER TABLE
    spravochnik_podotchet_litso
ADD
    COLUMN position VARCHAR;

UPDATE
    spravochnik_podotchet_litso
SET
    position = 'Xodim';

ALTER TABLE
    spravochnik_podotchet_litso
ALTER COLUMN
    position
SET
    NOT NULL;