CREATE TABLE _regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    region_id INTEGER REFERENCES _regions(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);