CREATE TABLE IF NOT EXISTS saldo_152(
    id SERIAL PRIMARY KEY,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    schet_id INTEGER REFERENCES jur_schets(id) NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    date_saldo DATE NOT NULL,
    budjet_id INTEGER REFERENCES spravochnik_budjet_name(id),
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS saldo_152_child(
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES saldo_152(id) NOT NULL,
    organization_id INTEGER REFERENCES spravochnik_organization(id) NOT NULL,
    summa DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);