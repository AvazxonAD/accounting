CREATE TABLE IF NOT EXISTS date_saldo_jur2(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);