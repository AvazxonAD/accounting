CREATE TABLE IF NOT EXISTS real_cost(
    id SERIAL PRIMARY KEY,
    status INTEGER NOT NULL,
    accept_time TIMESTAMPTZ,
    send_time TIMESTAMPTZ,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    accept_user_id INTEGER REFERENCES users(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

DROP TABLE real_cost_child;

CREATE TABLE IF NOT EXISTS real_cost_child(
    id SERIAL PRIMARY KEY,
    smeta_id INTEGER REFERENCES smeta(id),
    summa DECIMAL NOT NULL,
    is_year BOOLEAN NOT NULL,
    parent_id INTEGER REFERENCES real_cost(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS real_cost_sub_child(
    id SERIAL PRIMARY KEY,
    contract_grafik_id INTEGER REFERENCES shartnoma_grafik(id),
    grafik_summa DECIMAL NOT NULL,
    rasxod_summa DECIMAL NOT NULL,
    remaining_summa DECIMAL NOT NULL,
    parent_id INTEGER REFERENCES real_cost_child(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);