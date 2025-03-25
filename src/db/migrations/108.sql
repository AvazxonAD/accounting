CREATE TABLE IF NOT EXISTS organ_saldo (
    id INTEGER PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    summa DECIMAL NOT NULL,
    prixod BOOLEAN NOT NULL,
    rasxod BOOLEAN NOT NULL,
    opisanie VARCHAR(255),
    organ_id INTEGER REFERENCES spravochnik_organization(id) NOT NULL,
    contract_id INTEGER REFERENCES shartnomalar_organization(id),
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    organ_account_number_id INTEGER REFERENCES organization_by_raschet_schet(id),
    organ_gazna_number_id INTEGER REFERENCES organization_by_raschet_schet_gazna(id),
    contract_grafik_id INTEGER REFERENCES shartnoma_grafik(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS organ_saldo_child (
    id INTEGER PRIMARY KEY,
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