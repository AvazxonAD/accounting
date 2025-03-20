ALTER TABLE kursatilgan_hizmatlar_jur152 ADD COLUMN  shartnoma_grafik_id BIGINT REFERENCES shartnoma_grafik(id);

ALTER TABLE bajarilgan_ishlar_jur3 ADD COLUMN  shartnoma_grafik_id BIGINT REFERENCES shartnoma_grafik(id);

ALTER TABLE bank_prixod ADD COLUMN  shartnoma_grafik_id BIGINT REFERENCES shartnoma_grafik(id);