ALTER TABLE
    kursatilgan_hizmatlar_jur152
ADD
    COLUMN schet_id INTEGER REFERENCES jur_schets(id);