CREATE TABLE IF NOT EXISTS jur_schets(
    id SERIAL PRIMARY KEY,
    schet VARCHAR NOT NULL,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    type VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
)