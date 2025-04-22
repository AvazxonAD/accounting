DROP TABLE smeta_grafik_old;

CREATE TABLE IF NOT EXISTS smeta_grafik_old (
    id SERIAL PRIMARY KEY,
    smeta_grafik_id INTEGER REFERENCES smeta_grafik(id) NOT NULL,
    sort_order INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);