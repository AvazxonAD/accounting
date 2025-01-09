CREATE TABLE documents_haqiqiy_harajat (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    type_document VARCHAR NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    debet_sum DECIMAL NOT NULL,
    kredit_sum DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE zakonchit_haqiqiy_harajat (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    document_yaratilgan_vaqt TIMESTAMP NOT NULL,
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    type_document VARCHAR NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    debet_sum DECIMAL NOT NULL,
    kredit_sum DECIMAL NOT NULL,
    status INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);
