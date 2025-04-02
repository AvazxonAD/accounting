ALTER TABLE
    prixod_book_type
ADD
    COLUMN sort_order INTEGER;

UPDATE
    prixod_book_type
SET
    sort_order = id;

ALTER TABLE
    prixod_book_type
ALTER COLUMN
    sort_order
SET
    NOT NULL;