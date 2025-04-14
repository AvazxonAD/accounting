ALTER TABLE
    kassa_prixod
ADD
    COLUMN organ_id INTEGER REFERENCES spravochnik_organization(id);

ALTER TABLE
    kassa_prixod
ADD
    COLUMN contract_id INTEGER REFERENCES shartnomalar_organization(id);

ALTER TABLE
    kassa_prixod
ADD
    COLUMN contract_grafik_id INTEGER REFERENCES shartnoma_grafik(id);

ALTER TABLE
    kassa_prixod
ADD
    COLUMN organ_account_id INTEGER REFERENCES organization_by_raschet_schet(id);

ALTER TABLE
    kassa_prixod
ADD
    COLUMN organ_gazna_id INTEGER REFERENCES organization_by_raschet_schet_gazna(id);