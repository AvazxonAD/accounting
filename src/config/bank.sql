
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
