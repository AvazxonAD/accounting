ALTER TABLE
    kassa_saldo
ADD
    COLUMN prixod_summa DECIMAL NOT NULL;

ALTER TABLE
    kassa_saldo
ADD
    COLUMN rasxod_summa DECIMAL NOT NULL;

ALTER TABLE
    bank_saldo
ADD
    COLUMN prixod_summa DECIMAL NOT NULL;

ALTER TABLE
    bank_saldo
ADD
    COLUMN rasxod_summa DECIMAL NOT NULL;