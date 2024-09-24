

CREATE TABLE avans_otchetlar_jur4 
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES regions(id),
    doc_num VARCHAR(255),
    doc_date DATE,
    summa DECIMAL,
    opisanie VARCHAR(255),
    spravochnik_podotchet_litso_id INT REFERENCES spravochnik_podotchet_litso(id),
    main_schet_id INT REFERENCES main_schet(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE avans_otchetlar_jur4_child
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES regions(id),
    spravochnik_operatsii_id INT REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    avans_otchetlar_jur4_id INT REFERENCES avans_otchetlar_jur4(id),
    main_schet_id INT REFERENCES main_schet(id),
    own_schet VARCHAR(200),
    own_subschet VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);