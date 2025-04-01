ALTER TABLE
    video_module
ADD
    COLUMN status BOOLEAN;

UPDATE
    video_module
SET
    status = true;

ALTER TABLE
    video_module
ALTER COLUMN
    status
SET
    NOT NULL;