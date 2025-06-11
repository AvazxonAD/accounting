ALTER TABLE
    work_trip
ADD
    COLUMN worker_id INTEGER NOT NULL REFERENCES spravochnik_podotchet_litso(id);