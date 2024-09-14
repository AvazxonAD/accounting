-- Rollar jadvali
CREATE TABLE role (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL, -- Maksimal uzunlik belgilandi
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Foydalanuvchilar jadvali
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  login VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  fio VARCHAR(255),
  role_id INT REFERENCES role(id),
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Rekvizitlar jadvali
CREATE TABLE requisite (
  iid BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255),
  bank_mfo VARCHAR(255),
  user_id INT UNIQUE REFERENCES users(id),
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Asosiy hisoblar jadvali
CREATE TABLE main_schet (
  id BIGINT PRIMARY KEY,
  shot_number INT,
  account_number INT,
  budget VARCHAR(255),
  balance DOUBLE PRECISION,
  user_id INT REFERENCES users(id),
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Hamkorlar jadvali
CREATE TABLE partner (
  id BIGSERIAL PRIMARY KEY,
  inn BIGINT,
  name VARCHAR(255),
  bank_name VARCHAR(255),
  bank_mfo VARCHAR(255),
  account_number BIGINT,
  user_id INT REFERENCES users(id),
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Maqsad jadvali
CREATE TABLE target (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  short_name VARCHAR(255),
  shot_number INT,
  smeta_number INT,
  payment_status BOOLEAN,
  user_id INT REFERENCES users(id),
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Xarajatlar jadvali
CREATE TABLE rasxod (
  id BIGSERIAL PRIMARY KEY,
  doc_number INT,
  date1 DATE,
  date2 DATE,
  user_id INT REFERENCES users(id),
  partner_id INT REFERENCES partner(id),
  contract_summa DOUBLE PRECISION,
  contract_string_summa DOUBLE PRECISION,
  target_id INT REFERENCES target(id),
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Kelib tushgan mablag'lar jadvali
CREATE TABLE prixod (
  id BIGSERIAL PRIMARY KEY,
  doc_number INT,
  date DATE,
  user_id INT REFERENCES users(id),
  partner_id INT REFERENCES partner(id),
  contract_summa DOUBLE PRECISION,
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Mablag'lar kelib tushgan maqsadlar jadvali
CREATE TABLE target_of_prixod (
  id BIGSERIAL PRIMARY KEY,
  target_id INT REFERENCES target(id),
  prixod_id INT REFERENCES prixod(id),
  user_id INT REFERENCES users(id),
  prixod_summa DOUBLE PRECISION,
  createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN NOT NULL DEFAULT FALSE
);
