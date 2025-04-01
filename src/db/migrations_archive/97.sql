--- column add 
ALTER TABLE
    main_book_type
ADD
    COLUMN sort_order INTEGER;

-- insert into
INSERT INTO
    main_book_type(id, name, sort_order)
VALUES
    (0, 'from', 0);

INSERT INTO
    main_book_type(id, name, sort_order)
VALUES
    (10, 'to', 10);

--update
UPDATE
    main_book_type
SET
    sort_order = 1
WHERE
    name = 'jur1';

UPDATE
    main_book_type
SET
    sort_order = 2
WHERE
    name = 'jur2';

UPDATE
    main_book_type
SET
    sort_order = 3
WHERE
    name = 'jur3';

UPDATE
    main_book_type
SET
    sort_order = 4
WHERE
    name = 'jur4';

UPDATE
    main_book_type
SET
    sort_order = 5
WHERE
    name = 'jur5';

UPDATE
    main_book_type
SET
    sort_order = 7
WHERE
    name = 'jur7';