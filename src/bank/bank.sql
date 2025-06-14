CREATE TABLE bank_prixod (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
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
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  summa DECIMAL,
  spravochnik_operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
  id_spravochnik_podrazdelenie INTEGER REFERENCES spravochnik_podrazdelenie(id),
  id_spravochnik_sostav INTEGER REFERENCES spravochnik_sostav(id),
  id_spravochnik_type_operatsii INTEGER REFERENCES spravochnik_type_operatsii(id),
  id_spravochnik_podotchet_litso INTEGER REFERENCES spravochnik_podotchet_litso(id),
  id_bank_prixod INTEGER REFERENCES bank_prixod(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
  main_zarplata_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bank_rasxod (
  id SERIAL PRIMARY KEY,
  doc_num VARCHAR(255),
  doc_date DATE,
  user_id INTEGER REFERENCES users(id),
  summa DECIMAL,
  opisanie VARCHAR(255),
  id_spravochnik_organization INTEGER REFERENCES spravochnik_organization(id),
  id_shartnomalar_organization INTEGER REFERENCES shartnomalar_organization(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
  rukovoditel VARCHAR,
  glav_buxgalter VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE bank_rasxod_child (
  id SERIAL PRIMARY KEY,
  spravochnik_operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
  summa DECIMAL,
  id_spravochnik_podrazdelenie INTEGER REFERENCES spravochnik_podrazdelenie(id),
  id_spravochnik_sostav INTEGER REFERENCES spravochnik_sostav(id),
  id_spravochnik_type_operatsii INTEGER REFERENCES spravochnik_type_operatsii(id),
  id_bank_rasxod INTEGER REFERENCES bank_rasxod(id),
  user_id INTEGER REFERENCES users(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
  main_zarplata_id INTEGER,
  id_spravochnik_podotchet_litso INTEGER REFERENCES spravochnik_podotchet_litso(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);