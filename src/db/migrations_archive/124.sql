CREATE TABLE IF NOT EXISTS prixod_book_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO
    prixod_book_type(name)
VALUES
    ('jur1'),
    ('jur2'),
    ('jur3'),
    ('jur4'),
    ('jur5'),
    ('jur7');

UPDATE
    prixod_book_type
SET
    id = 7
WHERE
    "name" = 'jur7'