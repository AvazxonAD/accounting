CREATE TABLE IF NOT EXISTS real_cost_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO
    real_cost_type(name, sort_order)
VALUES
    ('smeta_grafik', 0),
    ('contract_data', 1),
    ('organization', 2),
    ('contract_grafik', 3),
    ('bank_rasxod', 4),
    ('remaining', 5),
    ('smeta_grafik_year', 6),
    ('contract_data_year', 7),
    ('organization_year', 8),
    ('contract_grafik_year', 9),
    ('bank_rasxod_year', 10),
    ('remaining_year', 11);

CREATE TABLE IF NOT EXISTS real_cost(
    id SERIAL PRIMARY KEY,
    status INTEGER NOT NULL,
    accept_time TIMESTAMPTZ,
    send_time TIMESTAMPTZ,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    accept_user_id INTEGER REFERENCES users(id),
    user_id INTEGER REFERENCES users(id) NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS real_cost_child(
    id SERIAL PRIMARY KEY,
    smeta_id INTEGER REFERENCES smeta(id),
    summa DECIMAL NOT NULL,
    parent_id INTEGER REFERENCES real_cost(id) NOT NULL,
    type_id INTEGER REFERENCES real_cost_type(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS real_cost_sub_child(
    id SERIAL PRIMARY KEY,
    contract_grafik_id INTEGER REFERENCES shartnoma_grafik(id),
    contract_grafik_summa DECIMAL NOT NULL,
    bank_rasxod_summa DECIMAL NOT NULL,
    remaining_summa DECIMAL NOT NULL,
    parent_id INTEGER REFERENCES real_cost_child(id) NOT NULL,
    type_id INTEGER REFERENCES real_cost_type(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);