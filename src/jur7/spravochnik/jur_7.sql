CREATE TABLE pereotsenka_jur7 (
  id SERIAL PRIMARY KEY,
  group_jur7_id INT NOT NULL REFERENCES group_jur7(id),
  name VARCHAR(255),
  pereotsenka_foiz DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE group_jur7 (
  id SERIAL PRIMARY KEY,
  smeta_id INT REFERENCES smeta(id),
  name VARCHAR(10000),
  schet VARCHAR(255),
  iznos_foiz INT,
  provodka_debet VARCHAR(255),
  provodka_subschet VARCHAR(255),
  group_number VARCHAR(255),
  provodka_kredit VARCHAR(255),
  roman_numeral VARCHAR(255),
  pod_group VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_podrazdelenie_jur7 (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_javobgar_shaxs_jur7 (
  id SERIAL PRIMARY KEY,
  spravochnik_podrazdelenie_jur7_id INT NOT NULL REFERENCES spravochnik_podrazdelenie_jur7(id),
  fio VARCHAR(255),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE naimenovanie_tovarov_jur7 (
  id BIGSERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  spravochnik_budjet_name_id INT REFERENCES spravochnik_budjet_name(id),
  name VARCHAR(255),
  edin VARCHAR(50),
  inventar_num VARCHAR(255),
  serial_num VARCHAR(255),
  group_jur7_id INT NOT NULL REFERENCES group_jur7(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE storage_unit (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE iznos_tovar_jur7 (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    inventar_num VARCHAR(255),
    serial_num VARCHAR(255),
    naimenovanie_tovarov_jur7_id INT NOT NULL REFERENCES naimenovanie_tovarov_jur7(id),
    kol DECIMAL,
    sena DECIMAL,
    iznos_start_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);