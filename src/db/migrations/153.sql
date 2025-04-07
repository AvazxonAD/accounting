ALTER TABLE
    avans_otchetlar_jur4
ADD
    COLUMN schet_id INTEGER REFERENCES jur_schets(id);