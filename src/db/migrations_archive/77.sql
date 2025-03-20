ALTER TABLE
    organ_saldo
ADD
    COLUMN organ_account_number_id INTEGER REFERENCES organization_by_raschet_schet(id);

ALTER TABLE
    organ_saldo
ADD
    COLUMN organ_gazna_number_id INTEGER REFERENCES organization_by_raschet_schet_gazna(id);