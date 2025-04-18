DELETE FROM
    main_book_child;

DELETE FROM
    main_book;

DELETE FROM
    main_book_saldo;

ALTER TABLE
    main_book
ADD
    COLUMN main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL;

ALTER TABLE
    main_book_saldo
ADD
    COLUMN main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL;