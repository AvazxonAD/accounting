ALTER TABLE
    kassa_saldo
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

UPDATE
    kassa_saldo
SET
    budjet_id = 1;

ALTER TABLE
    kassa_saldo
ALTER COLUMN
    budjet_id
SET
    NOT NULL;