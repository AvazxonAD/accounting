ALTER TABLE
    organ_saldo
ADD
    COLUMN prixod_summa DECIMAL;

ALTER TABLE
    organ_saldo
ADD
    COLUMN rasxod_summa DECIMAL;

ALTER TABLE
    organ_saldo
ADD
    COLUMN prixod BOOLEAN;

ALTER TABLE
    organ_saldo
ADD
    COLUMN rasxod BOOLEAN;

ALTER TABLE
    organ_saldo DROP COLUMN summa;