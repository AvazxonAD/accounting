ALTER TABLE
    main_book_child RENAME COLUMN type TO type_id;

UPDATE
    main_book_child
SET
    type_id = '1';

ALTER TABLE
    main_book_child
ALTER COLUMN
    type_id TYPE INTEGER USING type_id :: INTEGER;