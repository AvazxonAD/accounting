ALTER TABLE
    spravochnik_javobgar_shaxs_jur7
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);