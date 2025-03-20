ALTER TABLE
    main_book
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

ALTER TABLE
    main_book
ADD
    COLUMN year INTEGER;

ALTER TABLE
    main_book
ADD
    COLUMN month INTEGER;