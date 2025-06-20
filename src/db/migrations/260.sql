CREATE TABLE positions(
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false
)