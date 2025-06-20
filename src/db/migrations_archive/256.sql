ALTER TABLE
    work_trip DROP COLUMN from_district_id;

ALTER TABLE
    work_trip DROP COLUMN to_district_id;

ALTER TABLE
    work_trip
ADD
    COLUMN from_region_id INTEGER REFERENCES _regions(id);

ALTER TABLE
    work_trip
ADD
    COLUMN to_region_id INTEGER REFERENCES _regions(id);