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
  raschet_schet VARCHAR(200),
  raschet_schet_gazna VARCHAR(200),
  inn VARCHAR(9),
  mfo VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE spravochnik_operatsii (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  schet VARCHAR(200),
  sub_schet VARCHAR(200),
  type_schet VARCHAR(200), -- tolov yoki ushlanma
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
