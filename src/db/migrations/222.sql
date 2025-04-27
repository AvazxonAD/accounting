ALTER TABLE
    real_cost_sub_child DROP COLUMN bank_rasxod_summa;

ALTER TABLE
    real_cost_sub_child
ADD
    COLUMN is_year BOOLEAN NOT NULL