ALTER TABLE
    iznos_tovar_jur7
ADD
    COLUMN region_id BIGINT REFERENCES regions(id);