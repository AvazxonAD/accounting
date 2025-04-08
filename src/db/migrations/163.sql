ALTER TABLE
    jur8_monitoring_child
ADD
    COLUMN schet VARCHAR;

UPDATE
    jur8_monitoring_child
SET
    schet = '0';

ALTER TABLE
    jur8_monitoring_child
ALTER COLUMN
    schet
SET
    NOT NULL;