ALTER TABLE
    main_book_type
ALTER COLUMN
    sort_order type FLOAT;

INSERT INTO
    main_book_type(id, name, sort_order)
VALUES
    (11, 'jur3a', 3.1)