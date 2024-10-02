CREATE TABLE kassa_prixod (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    opisanie VARCHAR(500),
    summa DECIMAL,
    id_podotchet_litso INT REFERENCES spravochnik_podotchet_litso(id),
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false 
);

CREATE TABLE kassa_prixod_child (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    spravochnik_operatsii_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    kassa_prixod_id BIGINT NOT NULL REFERENCES kassa_prixod(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false 
);



CREATE TABLE kassa_rasxod (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    opisanie VARCHAR(500),
    summa DECIMAL,
    id_podotchet_litso INT REFERENCES spravochnik_podotchet_litso(id),
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false 
);

CREATE TABLE kassa_rasxod_child (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    spravochnik_operatsii_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    kassa_rasxod_id BIGINT NOT NULL REFERENCES kassa_rasxod(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false 
);
