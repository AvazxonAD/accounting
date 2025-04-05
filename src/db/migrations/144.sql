UPDATE
    saldo_naimenovanie_jur7
SET
    doc_date = now()
WHERE
    doc_date IS NULL;

ALTER TABLE
    saldo_naimenovanie_jur7
ALTER COLUMN
    doc_date
SET
    NOT NULL;