

CREATE TABLE shartnomalar_organization (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255) NOT NULL,
    doc_date DATE NOT NULL,
    summa DECIMAL NOT NULL,
    opisanie TEXT,
    smeta_id INTEGER REFERENCES smeta(id),
    user_id INTEGER REFERENCES regions(id),
    smeta_2 VARCHAR(255),
    spravochnik_organization_id INTEGER REFERENCES spravochnik_organization(id),
    pudratchi_bool BOOLEAN,
    main_schet_id INTEGER REFERENCES main_schet(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE shartnoma_grafik (
  id SERIAL PRIMARY KEY,
  id_shartnomalar_organization INTEGER REFERENCES shartnomalar_organization(id),
  user_id INTEGER REFERENCES regions(id),
  main_schet_id INTEGER REFERENCES main_schet(id),
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
