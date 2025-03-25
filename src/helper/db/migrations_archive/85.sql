ALTER TABLE
    saldo_naimenovanie_jur7
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);