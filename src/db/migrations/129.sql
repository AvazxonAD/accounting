DROP TABLE IF EXISTS kassa_saldo_child CASCADE;

DROP TABLE IF EXISTS kassa_saldo CASCADE;

CREATE TABLE IF NOT EXISTS kassa_saldo(
    id SERIAL PRIMARY KEY,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    summa DECIMAL NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);