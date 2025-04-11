DELETE FROM
    main_book_saldo;

ALTER TABLE
    main_book_saldo
ALTER COLUMN
    year
SET
    NOT NULL;

ALTER TABLE
    main_book_saldo
ALTER COLUMN
    month
SET
    NOT NULL;