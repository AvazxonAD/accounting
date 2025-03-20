UPDATE
    main_book_child
SET
    type = 'jur1';

ALTER TABLE
    main_book_child
ALTER COLUMN
    type
SET
    NOT NULL;