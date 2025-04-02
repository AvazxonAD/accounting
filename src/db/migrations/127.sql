ALTER TABLE
    prixod_book_child
ADD
    COLUMN type_id INTEGER REFERENCES prixod_book_type(id);

ALTER TABLE
    prixod_book_child
ALTER COLUMN
    type_id
SET
    NOT NULL;