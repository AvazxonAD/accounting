CREATE TABLE kursatilgan_hizmatlar_jur152 (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    doc_num VARCHAR(255),
    doc_date DATE,
    summa DECIMAL,
    opisanie VARCHAR(500),
    id_spravochnik_organization INT NOT NULL REFERENCES spravochnik_organization(id),
    shartnomalar_organization_id INT REFERENCES shartnomalar_organization(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE kursatilgan_hizmatlar_jur152_child (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    spravochnik_operatsii_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    kursatilgan_hizmatlar_jur152_id INT NOT NULL REFERENCES kursatilgan_hizmatlar_jur152(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    kol DECIMAL,
    sena DECIMAL,
    nds_foiz DECIMAL,
    nds_summa DECIMAL,
    summa_s_nds DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);