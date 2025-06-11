CREATE TABLE distances (
    id SERIAL PRIMARY KEY,
    from_district_id INT NOT NULL REFERENCES districts(id),
    to_district_id INT NOT NULL REFERENCES districts(id),
    distance_km NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);