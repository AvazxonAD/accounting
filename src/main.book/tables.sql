CREATE TABLE documents_glavniy_kniga (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    spravochnik_operatsii_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    type_document VARCHAR(50) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    debet_sum DECIMAL,
    kredit_sum DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE zakonchit_glavniy_kniga (
    id BIGINT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id), 
    document_yaratilgan_vaqt TIMESTAMP NOT NULL,
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    spravochnik_operatsii_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    type_document VARCHAR(50) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    debet_sum DECIMAL(18, 2),
    kredit_sum DECIMAL(18, 2),
    status INT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);
