CREATE TABLE smeta (
    id SERIAL PRIMARY KEY,
    father_smeta_name VARCHAR(255),
    group_number VARCHAR,
    smeta_name VARCHAR(255),
    smeta_number VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE smeta_grafik (
  id SERIAL PRIMARY KEY,
  smeta_id INTEGER REFERENCES smeta(id),
  spravochnik_budjet_name_id INTEGER REFERENCES spravochnik_budjet_name(id),
  user_id INTEGER REFERENCES users(id),
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
  itogo DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);