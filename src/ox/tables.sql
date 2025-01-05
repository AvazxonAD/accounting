CREATE TABLE documents_1_ox_xisobot (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    month INT,
    year INT,
    ajratilgan_mablag DECIMAL,
    tulangan_mablag_smeta_buyicha DECIMAL,
    kassa_rasxod DECIMAL,
    haqiqatda_harajatlar DECIMAL,
    qoldiq DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN
);

CREATE TABLE zakonchit_1_ox_xisobot (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    document_yaratilgan_vaqt TIMESTAMP,
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    month INT,
    year INT,
    ajratilgan_mablag DECIMAL,
    tulangan_mablag_smeta_buyicha DECIMAL,
    kassa_rasxod DECIMAL,
    haqiqatda_harajatlar DECIMAL,
    qoldiq DECIMAL,
    status INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN
);