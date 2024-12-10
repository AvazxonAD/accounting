CREATE TABLE spravochnik_podotchet_litso (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_podrazdelenie (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_sostav (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_type_operatsii (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_organization (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  okonx VARCHAR(200),
  bank_klient VARCHAR(200),
  raschet_schet_gazna VARCHAR(200),
  mfo VARCHAR(200),
  inn VARCHAR(40),
  raschet_schet VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  parent_id INTEGER REFERENCES spravochnik_organization(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_operatsii (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  schet VARCHAR(200),
  sub_schet VARCHAR(200),
  type_schet VARCHAR(200),
  smeta_id INTEGER REFERENCES smeta(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_budjet_name (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE main_schet (
    id SERIAL PRIMARY KEY,
    spravochnik_budjet_name_id INTEGER REFERENCES spravochnik_budjet_name(id),
    tashkilot_nomi VARCHAR(255),
    tashkilot_bank VARCHAR(255),
    tashkilot_mfo VARCHAR(50),
    tashkilot_inn VARCHAR(20),
    account_number VARCHAR(20),
    account_name VARCHAR(255),
    jur1_schet VARCHAR(255),
    jur1_subschet VARCHAR(255),
    jur2_schet VARCHAR(255),
    jur2_subschet VARCHAR(255),
    jur3_schet VARCHAR(255),
    jur3_subschet VARCHAR(255),
    jur4_schet VARCHAR(255),
    jur4_subschet VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_podpis_dlya_doc (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type_document VARCHAR(255), 
    numeric_poryadok INT,  
    doljnost_name VARCHAR(255), 
    fio_name VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE schet_operatsii (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  schet VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_bank_mfo (
  id SERIAL PRIMARY KEY,
  mfo VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);
