CREATE TABLE IF NOT EXISTS odinox_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO
    odinox_type(name, sort_order)
VALUES
    ('jur1_rasxod', 1),
    ('jur2_rasxod', 2),
    ('akt', 3),
    ('jur5', 4),
    ('jur7_prixod', 5);

CREATE TABLE IF NOT EXISTS odinox(
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

CREATE TABLE IF NOT EXISTS odinox_child(
    id SERIAL PRIMARY KEY,
    smeta_id INTEGER REFERENCES smeta(id),
    summa DECIMAL NOT NULL,
    parent_id INTEGER REFERENCES odinox(id) NOT NULL,
    type_id INTEGER REFERENCES odinox_type(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);