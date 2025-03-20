CREATE TABLE IF NOT EXISTS organ_saldo (
    id BIGSERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    user_id INTEGER REFERENCES users(id),
    summa DECIMAL,
    opisanie VARCHAR(255),
    organ_id INTEGER REFERENCES spravochnik_organization(id),
    contract_id INTEGER REFERENCES shartnomalar_organization(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS organ_saldo_child (
    id BIGSERIAL PRIMARY KEY,
    operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    podraz_id INTEGER REFERENCES spravochnik_podrazdelenie(id),
    sostav_id INTEGER REFERENCES spravochnik_sostav(id),
    type_operatsii_id INTEGER REFERENCES spravochnik_type_operatsii(id),
    parent_id BIGSERIAL REFERENCES organ_saldo(id),
    user_id INTEGER REFERENCES users(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);