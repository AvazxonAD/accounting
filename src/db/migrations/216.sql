ALTER TABLE
    odinox_child
ADD
    COLUMN type_id INTEGER REFERENCES odinox_type(id) NOT NULL;