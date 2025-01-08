CREATE TABLE saldo_naimenovanie_jur7 (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (id),
    naimenovanie_tovarov_jur7_id BIGINT NOT NULL REFERENCES naimenovanie_tovarov_jur7 (id),
    kol DECIMAL NOT NULL,
    sena DECIMAL NOT NULL,
    summa DECIMAL NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    date_saldo DATE NOT NULL,
    kimning_buynida INT NOT NULL REFERENCES spravochnik_javobgar_shaxs_jur7 (id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);
