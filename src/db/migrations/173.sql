ALTER TABLE
    saldo_152_child
ADD
    COLUMN prixod DECIMAL NOT NULL;

ALTER TABLE
    saldo_152_child
ADD
    COLUMN rasxod DECIMAL NOT NULL;

ALTER TABLE
    saldo_152_child DROP COLUMN summa;

CREATE TABLE IF NOT EXISTS date_saldo_152(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id),
    schet_id INTEGER REFERENCES jur_schets(id) NOT NULL,
    doc_id INTEGER REFERENCES saldo_152(id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE
    date_saldo_152
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id) NOT NULL;