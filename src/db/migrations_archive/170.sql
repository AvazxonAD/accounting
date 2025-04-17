DROP TABLE date_saldo_jur3;

CREATE TABLE IF NOT EXISTS date_saldo_159(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id),
    schet_id INTEGER REFERENCES jur_schets(id) NOT NULL,
    doc_id INTEGER REFERENCES saldo_159(id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);