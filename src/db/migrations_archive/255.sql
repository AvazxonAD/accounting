ALTER TABLE
    distances DROP COLUMN from_district_id;

ALTER TABLE
    distances DROP COLUMN to_district_id;

ALTER TABLE
    distances
ADD
    COLUMN from_region_id INTEGER REFERENCES _regions(id);

ALTER TABLE
    distances
ADD
    COLUMN to_region_id INTEGER REFERENCES _regions(id);