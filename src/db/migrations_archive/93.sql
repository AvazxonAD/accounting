ALTER TABLE
    main_book_child
ADD
    CONSTRAINT fk_main_book_child_type FOREIGN KEY (type_id) REFERENCES main_book_type(id);