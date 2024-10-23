CREATE TABLE pereotsenka_jur7 (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  oy_1 DECIMAL,
  oy_2 DECIMAL,
  oy_3 DECIMAL,
  oy_4 DECIMAL,
  oy_5 DECIMAL,
  oy_6 DECIMAL,
  oy_7 DECIMAL,
  oy_8 DECIMAL,
  oy_9 DECIMAL,
  oy_10 DECIMAL,
  oy_11 DECIMAL,
  oy_12 DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE group_jur7 (
  id SERIAL PRIMARY KEY ,
  pereotsenka_jur7_id INT NOT NULL REFERENCES pereotsenka_jur7(id),
  user_id INT NOT NULL REFERENCES users(id),
  name VARCHAR(255),
  schet VARCHAR(255),
  iznos_foiz INT,
  provodka_debet VARCHAR(255),
  provodka_subschet VARCHAR(255),
  provodka_kredit VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_podrazdelenie_jur7 (
  id SERIAL PRIMARY KEY ,
  name VARCHAR(255),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_javobgar_shaxs_jur7 (
  id SERIAL PRIMARY KEY ,
  spravochnik_podrazdelenie_jur7_id INT NOT NULL REFERENCES spravochnik_podrazdelenie_jur7(id),
  fio VARCHAR(255),
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE naimenovanie_tovarov_jur7 (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  spravochnik_budjet_name_id INT REFERENCES spravochnik_budjet_name(id),
  name VARCHAR(255),
  edin VARCHAR(50),
  group_jur7_id INT NOT NULL REFERENCES group_jur7(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE document_jur7 (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  type_document INT,
  doc_num VARCHAR(50),
  doc_date DATE,
  j_o_num VARCHAR(50),
  opisanie VARCHAR(255),
  doverennost VARCHAR(255),
  summa DECIMAL,
  kimdan_id INT NOT NULL REFERENCES spravochnik_organization(id),
  kimdan_name VARCHAR(255),
  kimga_id INT NOT NULL REFERENCES spravochnik_javobgar_shaxs_jur7(id),
  kimga_name VARCHAR(255),
  id_shartnomalar_organization INT REFERENCES shartnomalar_organization(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE document_jur7_child (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  document_jur7_id INT NOT NULL REFERENCES document_jur7(id),
  naimenovanie_tovarov_jur7_id INTEGER NOT NULL REFERENCES naimenovanie_tovarov_jur7(id),
  kol DECIMAL,
  sena DECIMAL,
  summa DECIMAL,
  debet_schet VARCHAR(50),
  debet_sub_schet VARCHAR(50),
  kredit_schet VARCHAR(50),
  kredit_sub_schet VARCHAR(50),
  data_pereotsenka DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);
