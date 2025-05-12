UPDATE
    smeta_grafik
SET
    order_number = 0;

ALTER TABLE
    smeta_grafik
ALTER COLUMN
    order_number
SET
    NOT NULL;