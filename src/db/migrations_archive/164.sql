CREATE TABLE IF NOT EXISTS main_book_saldo (
    id SERIAL PRIMARY KEY,
    main_book_id INTEGER REFERENCES main_book(id) NOT NULL,
    budjet_id INTEGER REFERENCES spravochnik_budjet_name(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);