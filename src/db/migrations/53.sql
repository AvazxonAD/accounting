ALTER TABLE
    saldo_naimenovanie_jur7
ADD
    COLUMN region_id BIGINT REFERENCES regions(id);