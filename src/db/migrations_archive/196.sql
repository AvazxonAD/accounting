DELETE FROM
    smeta_grafik_old;

ALTER TABLE
    smeta_grafik_old
ADD
    COLUMN year INTEGER NOT NULL;