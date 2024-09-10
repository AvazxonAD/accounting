CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    login VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    super_admin BOOLEAN DEFAULT false,
    admin BOOLEAN DEFAULT false,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requisites (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    inn VARCHAR(9) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    mfo VARCHAR(5) NOT NULL, 
    bank_name VARCHAR(300) NOT NULL, 
    account_number VARCHAR(20) NOT NULL, 
    balance NUMERIC DEFAULT 0,
    treasury_account_number VARCHAR(40) NOT NULL, 
    shot_number INTEGER NOT NULL, 
    default_value BOOLEAN,
    budget VARCHAR(300) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partners (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    inn VARCHAR(9) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    mfo VARCHAR(5) NOT NULL, 
    bank_name VARCHAR(300) NOT NULL, 
    account_number VARCHAR(20) NOT NULL, 
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    schot VARCHAR(30) NOT NULL,
    number BIGINT NOT NULL,
    shot_status BOOLEAN DEFAULT false,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE positions (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    position_name VARCHAR(200) NOT NULL,
    fio VARCHAR(50) NOT NULL,
    boss BOOLEAN,
    manager BOOLEAN,
    kadr BOOLEAN,
    accountant BOOLEAN,
    mib BOOLEAN,
    inspector BOOLEAN,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    requisite_id INTEGER REFERENCES requisites(id) ON DELETE SET NULL,
    inn VARCHAR(9) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    mfo VARCHAR(5) NOT NULL, 
    bank_name VARCHAR(300) NOT NULL, 
    account_number VARCHAR(20) NOT NULL, 
    treasury_account_number VARCHAR(40) NOT NULL, 
    shot_number INTEGER NOT NULL, 
    budget VARCHAR(300) NOT NULL,
    partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    partner_name VARCHAR(200) NOT NULL, 
    partner_bank_name VARCHAR(300) NOT NULL, 
    partner_account_number VARCHAR(20) NOT NULL, 
    partner_mfo VARCHAR(5) NOT NULL, 
    partner_inn VARCHAR(9) NOT NULL, 
    goal_id INTEGER REFERENCES goals(id) ON DELETE SET NULL,
    goal_info VARCHAR(200) NOT NULL,
    goal_short_name VARCHAR(100) NOT NULL,
    goal_schot VARCHAR(30) NOT NULL,
    goal_number BIGINT NOT NULL,
    position_id_1 INTEGER REFERENCES positions(id) ON DELETE SET NULL,
    position_name_1 VARCHAR(200) NOT NULL,
    position_fio_1 VARCHAR(50) NOT NULL,
    position_id_2 INTEGER REFERENCES positions(id) ON DELETE SET NULL,
    position_name_2 VARCHAR(200) NOT NULL,
    position_fio_2 VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    contract_summa NUMERIC NOT NULL,
    contract_number VARCHAR(30),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE revenues (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    requisite_id INTEGER REFERENCES requisites(id) ON DELETE SET NULL,
    inn VARCHAR(9) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    mfo VARCHAR(5) NOT NULL, 
    bank_name VARCHAR(300) NOT NULL, 
    account_number VARCHAR(20) NOT NULL, 
    treasury_account_number VARCHAR(40) NOT NULL, 
    shot_number INTEGER NOT NULL, 
    budget VARCHAR(300) NOT NULL,
    partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
    partner_name VARCHAR(200) NOT NULL, 
    partner_bank_name VARCHAR(300) NOT NULL, 
    partner_account_number VARCHAR(20) NOT NULL, 
    partner_mfo VARCHAR(5) NOT NULL, 
    partner_inn VARCHAR(9) NOT NULL, 
    goals JSONB[],
    goal_info VARCHAR(200) NOT NULL,
    contract_date DATE,
    contract_summa NUMERIC NOT NULL,
    contract_number VARCHAR(30),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);