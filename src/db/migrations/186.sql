DELETE FROM
    jur8_monitoring_child;

DELETE FROM
    jur8_monitoring;

ALTER TABLE
    jur8_monitoring
ADD
    COLUMN main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL;