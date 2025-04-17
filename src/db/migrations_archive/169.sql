ALTER TABLE
    saldo_159_child
ADD
    COLUMN prixod DECIMAL NOT NULL;

ALTER TABLE
    saldo_159_child
ADD
    COLUMN rasxod DECIMAL NOT NULL;

ALTER TABLE
    saldo_159_child DROP COLUMN summa;