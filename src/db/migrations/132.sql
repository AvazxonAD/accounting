ALTER TABLE
    kassa_saldo
ADD
    COLUMN saldo_date DATE;

UPDATE
    kassa_saldo
SET
    saldo_date = TO_DATE(
        year || LPAD(month :: TEXT, 2, '0') || '01',
        'YYYYMMDD'
    );

ALTER TABLE
    kassa_saldo
ALTER COLUMN
    saldo_date
SET
    NOT NULL;