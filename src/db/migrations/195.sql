DROP TABLE smeta_grafik_old;

CREATE TABLE IF NOT EXISTS smeta_grafik_old (
    id SERIAL PRIMARY KEY,
    smeta_grafik_id INTEGER REFERENCES smeta_grafik(id) NOT NULL,
    sort_order INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    smeta_name VARCHAR NOT NULL,
    smeta_number VARCHAR NOT NULL,
    budjet_name VARCHAR NOT NULL,
    itogo DECIMAL NOT NULL,
    oy_1 DECIMAL NOT NULL,
    oy_2 DECIMAL NOT NULL,
    oy_3 DECIMAL NOT NULL,
    oy_4 DECIMAL NOT NULL,
    oy_5 DECIMAL NOT NULL,
    oy_6 DECIMAL NOT NULL,
    oy_7 DECIMAL NOT NULL,
    oy_8 DECIMAL NOT NULL,
    oy_9 DECIMAL NOT NULL,
    oy_10 DECIMAL NOT NULL,
    oy_11 DECIMAL NOT NULL,
    oy_12 DECIMAL NOT NULL,
    account_number VARCHAR NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);