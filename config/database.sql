-- bank
CREATE TABLE regions (
  id INTEGER PRIMARY KEY,
  name VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE role (
  id INTEGER PRIMARY KEY,
  name VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  role_id SMALLINT REFERENCES roles(id),
  region_id SMALLINT REFERENCES regions(id),
  fio VARCHAR(200),
  login VARCHAR(200),
  password VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_podotchet_litso (
  id INTEGER PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_podrazdelenie (
  id INTEGER PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_sostav (
  id INTEGER PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_type_operatsii (
  id INTEGER PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_organization (
  id INTEGER PRIMARY KEY,
  name VARCHAR(200),
  okonx VARCHAR(200),
  bank_klient VARCHAR(200),
  raschet_schet VARCHAR(200),
  raschet_schet_gazna VARCHAR(200),
  mfo VARCHAR(200),
  inn VARCHAR(200),
  user_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_operatsii (
  id INTEGER PRIMARY KEY,
  name VARCHAR(200),
  schet VARCHAR(200),
  sub_schet VARCHAR(200),
  type_schet VARCHAR(200), -- tolov yoki ushlanma
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_budjet_name (
    id INTEGER PRIMARY KEY,
    name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE main_schet (
    id INTEGER PRIMARY KEY,
    spravochnik_budjet_name_id INTEGER REFERENCES spravochnik_budjet_name(id),
    tashkilot_nomi VARCHAR(255),
    tashkilot_bank VARCHAR(255),
    tashkilot_mfo VARCHAR(50),
    tashkilot_inn INTEGER,
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
    user_id INTEGER REFERENCES regions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE shartnomalar_organization (
    id INTEGER PRIMARY KEY,
    doc_num VARCHAR(255) NOT NULL,
    doc_date DATE NOT NULL,
    summa DOUBLE PRECISION NOT NULL,
    opisanie TEXT,
    smeta_id INTEGER REFERENCES smeta(id),
    user_id INTEGER REFERENCES regions(id),
    smeta_2 VARCHAR(255),
    spravochnik_organization_id INTEGER REFERENCES spravochnik_organization(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE smeta (
    id INTEGER PRIMARY KEY,
    father_smeta_name VARCHAR(255),
    smeta_name VARCHAR(255) NOT NULL,
    smeta_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE shartnoma_grafik (
  id INTEGER PRIMARY KEY,
  id_shartnomalar_organization INTEGER REFERENCES shartnomalar_organization(id),
  user_id INTEGER REFERENCES regions(id),
  oy_1 DECIMAL DEFAULT 0,
  oy_2 DECIMAL DEFAULT 0,
  oy_3 DECIMAL DEFAULT 0,
  oy_4 DECIMAL DEFAULT 0,
  oy_5 DECIMAL DEFAULT 0,
  oy_6 DECIMAL DEFAULT 0,
  oy_7 DECIMAL DEFAULT 0,
  oy_8 DECIMAL DEFAULT 0,
  oy_9 DECIMAL DEFAULT 0,
  oy_10 DECIMAL DEFAULT 0,
  oy_11 DECIMAL DEFAULT 0,
  oy_12 DECIMAL DEFAULT 0,
  year INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bank_prixod (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES regions(id),
  doc_num VARCHAR(255),
  doc_date DATE,
  summa DECIMAL,
  provodki_boolean BOOLEAN,
  dop_provodki_boolean BOOLEAN,
  opisanie VARCHAR(255),
  id_spravochnik_organization INTEGER REFERENCES spravochnik_organization(id),
  id_shartnomalar_organization INTEGER REFERENCES shartnomalar_organization(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bank_prixod_child (
  id INTEGER PRIMARY KEY,
  user_id INTEGER
  REFERENCES regions(id),
  summa DECIMAL,
  spravochnik_operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
  id_spravochnik_podrazdelenie INTEGER REFERENCES spravochnik_podrazdelenie(id),
  id_spravochnik_sostav INTEGER REFERENCES spravochnik_sostav(id),
  id_spravochnik_type_operatsii INTEGER REFERENCES spravochnik_type_operatsii(id),
  id_spravochnik_podotchet_litso INTEGER REFERENCES spravochnik_podotchet_litso(id),
  id_bank_prixod INTEGER REFERENCES bank_prixod(id),
  own_schet VARCHAR(200),
  own_subschet VARCHAR(200),
  main_schet_id INTEGER REFERENCES main_schet(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bank_rasxod (
    id INTEGER PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    user_id INTEGER REFERENCES regions(id),
    summa DECIMAL,
    opisanie VARCHAR(255),
    id_spravochnik_organization INTEGER REFERENCES spravochnik_organization(id),
    id_shartnomalar_organization INTEGER REFERENCES shartnomalar_organization(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bank_rasxod_child (
    id INTEGER PRIMARY KEY,
    spravochnik_operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INTEGER REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INTEGER REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INTEGER REFERENCES spravochnik_type_operatsii(id),
    id_bank_rasxod INTEGER REFERENCES bank_rasxod(id),
    user_id INTEGER REFERENCES regions(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    own_schet VARCHAR(200),
    own_subschet VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE kassa_prixod_rasxod (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    opisanie VARCHAR(255),
    prixod_summa DECIMAL,
    rasxod_summa DECIMAL,
    id_podotchet_litso INTEGER REFERENCES spravochnik_podotchet_litso(id),
    user_id INTEGER REFERENCES regions(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE kassa_prixod_rasxod_child (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES regions(id),
  spravochnik_operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
  summa DECIMAL,
  id_spravochnik_podrazdelenie INTEGER REFERENCES spravochnik_podrazdelenie(id),
  id_spravochnik_sostav INTEGER REFERENCES spravochnik_sostav(id),
  id_spravochnik_type_operatsii INTEGER REFERENCES spravochnik_type_operatsii(id),
  kassa_prixod_rasxod_id INTEGER REFERENCES kassa_prixod_rasxod(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
  own_schet VARCHAR(200),
  own_subschet VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE smeta_grafik (
  id SERIAL PRIMARY KEY,
  smeta_id INTEGER REFERENCES smeta(id),
  spravochnik_budjet_name_id INTEGER REFERENCES spravochnik_budjet_name(id),
  user_id INTEGER REFERENCES regions(id),
  itogo DECIMAL DEFAULT 0,
  oy_1 DECIMAL DEFAULT 0,
  oy_2 DECIMAL DEFAULT 0,
  oy_3 DECIMAL DEFAULT 0,
  oy_4 DECIMAL DEFAULT 0,
  oy_5 DECIMAL DEFAULT 0,
  oy_6 DECIMAL DEFAULT 0,
  oy_7 DECIMAL DEFAULT 0,
  oy_8 DECIMAL DEFAULT 0,
  oy_9 DECIMAL DEFAULT 0,
  oy_10 DECIMAL DEFAULT 0,
  oy_11 DECIMAL DEFAULT 0,
  oy_12 DECIMAL DEFAULT 0,
  year INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bajarilgan_ishlar_jur3 (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES regions(id),
    doc_num VARCHAR(255),
    doc_date DATE,
    summa DECIMAL,
    opisanie VARCHAR(255),
    id_spravochnik_organization INT REFERENCES spravochnik_organization(id),
    shartnomalar_organization_id INT REFERENCES shartnomalar_organization(id),
    main_schet_id INT REFERENCES main_schet(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bajarilgan_ishlar_jur3_child (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES regions(id),
    spravochnik_operatsii_id INT REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    bajarilgan_ishlar_jur3_id INT REFERENCES bajarilgan_ishlar_jur3(id),
    main_schet_id INT REFERENCES main_schet(id),
    own_schet VARCHAR(200),
    own_subschet VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE avans_otchetlar_jur4 
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES regions(id),
    doc_num VARCHAR(255),
    doc_date DATE,
    summa DECIMAL,
    opisanie VARCHAR(255),
    spravochnik_podotchet_litso_id INT REFERENCES spravochnik_podotchet_litso(id),
    main_schet_id INT REFERENCES main_schet(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE avans_otchetlar_jur4_child
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES regions(id),
    spravochnik_operatsii_id INT REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    avans_otchetlar_jur4_id INT REFERENCES avans_otchetlar_jur4(id),
    main_schet_id INT REFERENCES main_schet(id),
    own_schet VARCHAR(200),
    own_subschet VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);