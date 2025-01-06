CREATE TABLE documents_haqiqiy_harajat (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    type_document VARCHAR,
    month INT,
    year INT CHECK (year BETWEEN 1900 AND 2100),
    debet_sum DECIMAL,
    kredit_sum DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE zakonchit_haqiqiy_harajat (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    document_yaratilgan_vaqt TIMESTAMP,
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    type_document VARCHAR,
    month INT,
    year INT CHECK (year > 1900),
    debet_sum DECIMAL,
    kredit_sum DECIMAL,
    status INT CHECK (month BETWEEN 1 AND 3),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);
