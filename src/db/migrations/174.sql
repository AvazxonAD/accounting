CREATE TABLE IF NOT EXISTS podotchet_saldo(
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

CREATE TABLE IF NOT EXISTS podotchet_saldo_child(
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES podotchet_saldo(id) NOT NULL,
    podotchet_id INTEGER REFERENCES spravochnik_podotchet_litso(id) NOT NULL,
    prixod DECIMAL NOT NULL,
    rasxod DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS date_saldo_podotchet(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id),
    schet_id INTEGER REFERENCES jur_schets(id) NOT NULL,
    doc_id INTEGER REFERENCES podotchet_saldo(id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);