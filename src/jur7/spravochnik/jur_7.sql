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
  smeta_id INT NOT NULL REFERENCES smeta(id),
  name VARCHAR(255),
  schet VARCHAR(255),
  iznos_foiz INT,
  provodka_debet VARCHAR(255),
  provodka_subschet VARCHAR(255),
  group_number VARCHAR(255),
  provodka_kredit VARCHAR(255),
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
  group_jur7_id INT NOT NULL REFERENCES group_jur7(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

--prixod rasxod internal
CREATE TABLE document_prixod_jur7 (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  doc_num VARCHAR(255),
  doc_date DATE,
  j_o_num VARCHAR(255),
  opisanie TEXT,
  doverennost VARCHAR(255),
  summa DECIMAL,
  kimdan_id INT NOT NULL REFERENCES spravochnik_organization(id),
  kimdan_name VARCHAR(255),
  kimga_id INT NOT NULL REFERENCES spravochnik_javobgar_shaxs_jur7(id),
  kimga_name VARCHAR(255),
  id_shartnomalar_organization INT REFERENCES shartnomalar_organization(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE document_prixod_jur7_child (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  document_prixod_jur7_id INT NOT NULL REFERENCES document_prixod_jur7(id),
  naimenovanie_tovarov_jur7_id INTEGER NOT NULL REFERENCES naimenovanie_tovarov_jur7(id),
  kol DECIMAL,
  sena DECIMAL,
  summa DECIMAL,
  debet_schet VARCHAR(255),
  debet_sub_schet VARCHAR(255),
  kredit_schet VARCHAR(255),
  kredit_sub_schet VARCHAR(255),
  data_pereotsenka DATE,
  main_schet_id INTEGER REFERENCES main_schet(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE document_rasxod_jur7 (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  doc_num VARCHAR(255),
  doc_date DATE,
  j_o_num VARCHAR(255),
  opisanie TEXT,
  doverennost VARCHAR(255),
  summa DECIMAL,
  kimdan_id INT NOT NULL REFERENCES spravochnik_javobgar_shaxs_jur7(id),
  kimdan_name VARCHAR(255),
  kimga_id INT NOT NULL REFERENCES spravochnik_organization(id),
  kimga_name VARCHAR(255),
  id_shartnomalar_organization INT REFERENCES shartnomalar_organization(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE document_rasxod_jur7_child (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  document_rasxod_jur7_id INT NOT NULL REFERENCES document_rasxod_jur7(id),
  naimenovanie_tovarov_jur7_id INTEGER NOT NULL REFERENCES naimenovanie_tovarov_jur7(id),
  kol DECIMAL,
  sena DECIMAL,
  summa DECIMAL,
  debet_schet VARCHAR(255),
  debet_sub_schet VARCHAR(255),
  kredit_schet VARCHAR(255),
  kredit_sub_schet VARCHAR(255),
  data_pereotsenka DATE,
  main_schet_id INTEGER REFERENCES main_schet(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE document_vnutr_peremesh_jur7 (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  doc_num VARCHAR(255),
  doc_date DATE,
  j_o_num VARCHAR(255),
  opisanie TEXT,
  doverennost VARCHAR(255),
  summa DECIMAL,
  kimdan_id INT NOT NULL REFERENCES spravochnik_javobgar_shaxs_jur7(id),
  kimdan_name VARCHAR(255),
  kimga_id INT NOT NULL REFERENCES spravochnik_javobgar_shaxs_jur7(id),
  kimga_name VARCHAR(255),
  main_schet_id INTEGER REFERENCES main_schet(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE document_vnutr_peremesh_jur7_child (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  document_vnutr_peremesh_jur7_id INT NOT NULL REFERENCES document_vnutr_peremesh_jur7(id),
  naimenovanie_tovarov_jur7_id INTEGER NOT NULL REFERENCES naimenovanie_tovarov_jur7(id),
  kol DECIMAL,
  sena DECIMAL,
  summa DECIMAL,
  debet_schet VARCHAR(255),
  debet_sub_schet VARCHAR(255),
  kredit_schet VARCHAR(255),
  kredit_sub_schet VARCHAR(255),
  data_pereotsenka DATE,
  main_schet_id INTEGER REFERENCES main_schet(id),
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