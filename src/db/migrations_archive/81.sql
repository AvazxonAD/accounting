ALTER TABLE
    podotchet_saldo
ADD
    COLUMN prixod_summa DECIMAL;

ALTER TABLE
    podotchet_saldo
ADD
    COLUMN rasxod_summa DECIMAL;

ALTER TABLE
    podotchet_saldo
ADD
    COLUMN prixod BOOLEAN;

ALTER TABLE
    podotchet_saldo
ADD
    COLUMN rasxod BOOLEAN;

ALTER TABLE
    podotchet_saldo DROP COLUMN summa;