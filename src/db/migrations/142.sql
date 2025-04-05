UPDATE
    saldo_naimenovanie_jur7
SET
    debet_schet = '010'
WHERE
    debet_schet IS NULL;

ALTER TABLE
    saldo_naimenovanie_jur7
ALTER COLUMN
    debet_schet
SET
    NOT NULL;