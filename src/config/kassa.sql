
CREATE TABLE kassa_prixod (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    opisanie VARCHAR(255),
    summa DECIMAL DEFAULT 0,
    id_podotchet_litso INTEGER REFERENCES spravochnik_podotchet_litso(id),
    user_id INTEGER REFERENCES users(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE kassa_prixod_child (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  spravochnik_operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
  summa DECIMAL,
  id_spravochnik_podrazdelenie INTEGER REFERENCES spravochnik_podrazdelenie(id),
  id_spravochnik_sostav INTEGER REFERENCES spravochnik_sostav(id),
  id_spravochnik_type_operatsii INTEGER REFERENCES spravochnik_type_operatsii(id),
  kassa_prixod_rasxod_id INTEGER REFERENCES kassa_prixod_rasxod(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
  own_schet VARCHAR(200),
  own_subschet VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);
