DROP TABLE bank_saldo_child;

DROP TABLE bank_saldo;

DROP TABLE kassa_saldo;

DROP TABLE kassa_saldo_child;

CREATE TABLE IF NOT EXISTS kassa_saldo (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    rasxod_summa DECIMAL NOT NULL,
    prixod_summa DECIMAL NOT NULL,
    prixod BOOLEAN NOT NULL,
    rasxod BOOLEAN NOT NULL,
    opisanie VARCHAR(255),
    user_id INTEGER REFERENCES users(id) NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS kassa_saldo_child (
    id SERIAL PRIMARY KEY,
    operatsii_id INTEGER REFERENCES spravochnik_operatsii(id) NOT NULL,
    summa DECIMAL NOT NULL,
    podraz_id INTEGER REFERENCES spravochnik_podrazdelenie(id),
    sostav_id INTEGER REFERENCES spravochnik_sostav(id),
    type_operatsii_id INTEGER REFERENCES spravochnik_type_operatsii(id),
    parent_id INTEGER REFERENCES organ_saldo(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bank_saldo (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    rasxod_summa DECIMAL NOT NULL,
    prixod_summa DECIMAL NOT NULL,
    prixod BOOLEAN NOT NULL,
    rasxod BOOLEAN NOT NULL,
    opisanie VARCHAR(255),
    user_id INTEGER REFERENCES users(id) NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bank_saldo_child (
    id SERIAL PRIMARY KEY,
    operatsii_id INTEGER REFERENCES spravochnik_operatsii(id) NOT NULL,
    summa DECIMAL NOT NULL,
    podraz_id INTEGER REFERENCES spravochnik_podrazdelenie(id),
    sostav_id INTEGER REFERENCES spravochnik_sostav(id),
    type_operatsii_id INTEGER REFERENCES spravochnik_type_operatsii(id),
    parent_id INTEGER REFERENCES organ_saldo(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);