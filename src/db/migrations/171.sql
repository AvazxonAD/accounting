ALTER TABLE
    date_saldo_159
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id) NOT NULL;