ALTER TABLE
    smeta_grafik
ADD
    COLUMN parent_id INTEGER REFERENCES smeta_grafik_parent(id)