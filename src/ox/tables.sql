CREATE TABLE documents_1_ox_xisobot (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    month INT NOT NULL,
    year INT NOT NULL,
    ajratilgan_mablag DECIMAL NOT NULL,
    tulangan_mablag_smeta_buyicha DECIMAL NOT NULL,
    kassa_rasxod DECIMAL NOT NULL,
    haqiqatda_harajatlar DECIMAL NOT NULL,
    qoldiq DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE zakonchit_1_ox_xisobot (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    document_yaratilgan_vaqt TIMESTAMP NOT NULL,
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    month INT NOT NULL,
    year INT NOT NULL,
    ajratilgan_mablag DECIMAL NOT NULL,
    tulangan_mablag_smeta_buyicha DECIMAL NOT NULL,
    kassa_rasxod DECIMAL NOT NULL,
    haqiqatda_harajatlar DECIMAL NOT NULL,
    qoldiq DECIMAL NOT NULL,
    status INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);
