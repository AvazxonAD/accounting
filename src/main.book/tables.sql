CREATE TABLE documents_glavniy_kniga (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    spravochnik_main_book_schet_id INT NOT NULL REFERENCES spravochnik_main_book_schet(id),
    type_document VARCHAR(50) NOT NULL,
    month INT NOT NULL,
    year INT CHECK (year > 1900),
    debet_sum DECIMAL,
    kredit_sum DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE zakonchit_glavniy_kniga (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    document_yaratilgan_vaqt TIMESTAMP DEFAULT NOW(),
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    spravochnik_main_book_schet_id INT NOT NULL REFERENCES spravochnik_main_book_schet(id),
    type_document VARCHAR(50) NOT NULL,
    month INT NOT NULL,
    year INT CHECK (year > 1900),
    debet_sum DECIMAL,
    kredit_sum DECIMAL,
    status INT CHECK (status IN (1, 2, 3)),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);