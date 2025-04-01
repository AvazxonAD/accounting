ALTER TABLE
    document_vnutr_peremesh_jur7
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

ALTER TABLE
    document_prixod_jur7
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

ALTER TABLE
    document_rasxod_jur7
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);