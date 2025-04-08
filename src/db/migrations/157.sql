CREATE TABLE jur8_monitoring(
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    budjet_id INTEGER REFERENCES spravochnik_budjet_name(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE jur8_monitoring_child(
    id SERIAL PRIMARY KEY,
    schet_id INTEGER REFERENCES region_prixod_schets(id) NOT NULL,
    parent_id INTEGER REFERENCES jur8_monitoring(id) NOT NULL,
    summa DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);