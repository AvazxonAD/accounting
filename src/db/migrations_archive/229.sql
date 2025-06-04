CREATE TABLE podpis_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    key VARCHAR
);

INSERT INTO
    podpis_type (name, key)
VALUES
    ('Shapka', 'cap'),
    ('Kunlik hisobot', 'daysReport'),
    ('Akt Sverka', 'akt_sverka'),
    ('Akt jurnal 7 ', 'akt_jur7'),
    ('Jurnal 7 material', 'jur7_material');