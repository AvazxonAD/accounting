ALTER TABLE
    saldo_date
ADD
    COLUMN main_schet_id INTEGER REFERENCES main_schet(id);

ALTER TABLE
    saldo_date
ADD
    COLUMN budje_id INTEGER REFERENCES spravochnik_budjet_name(id);