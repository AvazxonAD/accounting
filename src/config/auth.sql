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
