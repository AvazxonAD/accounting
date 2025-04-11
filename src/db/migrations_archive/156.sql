CREATE TABLE region_prixod_schets(
    id SERIAL PRIMARY KEY,
    schet_id INTEGER REFERENCES prixod_schets(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);