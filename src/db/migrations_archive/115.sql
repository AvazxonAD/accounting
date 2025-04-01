CREATE TABLE prixod_schet(
    id SERIAL PRIMARY KEY,
    name VARCHAR(1000) NOT NULL,
    schet VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);