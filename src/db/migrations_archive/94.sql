ALTER TABLE
    main_book
ADD
    COLUMN accept_user_id INTEGER REFERENCES users(id);