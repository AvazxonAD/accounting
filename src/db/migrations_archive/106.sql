ALTER TABLE
    video DROP COLUMN super_admin;

ALTER TABLE
    video DROP COLUMN region;

ALTER TABLE
    video
ADD
    COLUMN status BOOLEAN;