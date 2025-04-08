ALTER TABLE
    jur8_monitoring_child
ADD
    COLUMN rasxod_schet VARCHAR;

UPDATE
    jur8_monitoring_child
SET
    rasxod_schet = '0';

ALTER TABLE
    jur8_monitoring_child
ALTER COLUMN
    rasxod_schet
SET
    NOT NULL;