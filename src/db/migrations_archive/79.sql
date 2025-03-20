ALTER TABLE
    organ_saldo
ADD
    COLUMN contract_grafik_id BIGINT REFERENCES shartnoma_grafik(id);