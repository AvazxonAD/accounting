CREATE TABLE IF NOT EXISTS saldo_date(
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);