CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);


CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  role_id SMALLINT REFERENCES role(id),
  region_id SMALLINT REFERENCES regions(id),
  fio VARCHAR(200),
  login VARCHAR(200),
  password VARCHAR(200),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE access (
  id SERIAL PRIMARY KEY,
  kassa BOOLEAN DEFAULT FALSE,
  bank BOOLEAN DEFAULT FALSE,
  spravochnik BOOLEAN DEFAULT FALSE,
  organization BOOLEAN DEFAULT FALSE,
  region_users BOOLEAN DEFAULT FALSE,
  smeta BOOLEAN DEFAULT false,
  region BOOLEAN DEFAULT false,
  role BOOLEAN DEFAULT false,
  users BOOLEAN DEFAULT false,
  shartnoma BOOLEAN DEFAULT false,
  jur3 BOOLEAN DEFAULT FALSE,
  jur4 BOOLEAN DEFAULT FALSE,
  show_service BOOLEAN DEFAULT FALSE,
  role_id INT REFERENCES role(id),
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);
