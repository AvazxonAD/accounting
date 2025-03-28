ALTER TABLE
    document_vnutr_peremesh_jur7_child
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

ALTER TABLE
    document_prixod_jur7_child
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

ALTER TABLE
    document_rasxod_jur7_child
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);