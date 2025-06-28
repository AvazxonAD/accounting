ALTER TABLE
    region_prixod_schets
ADD
    COLUMN main_schet_id INTEGER REFERENCES main_schet(id);