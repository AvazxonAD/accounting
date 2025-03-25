--bank_rasxod table rename column 
ALTER TABLE bank_rasxod RENAME COLUMN summa TO tulanmagan_summa;

-- bank_rasxod add column
ALTER TABLE bank_rasxod ADD COLUMN summa DECIMAL DEFAULT 0;
ALTER TABLE bank_rasxod ADD COLUMN tulangan_tulanmagan BOOLEAN DEFAULT FALSE;