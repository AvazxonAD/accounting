CREATE TABLE IF NOT EXISTS main_book(
    id SERIAL PRIMARY KEY,
    status INTEGER NOT NULL,
    accept_time TIMESTAMPTZ,
    send_time TIMESTAMPTZ,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS main_book_child(
    id SERIAL PRIMARY KEY,
    schet VARCHAR NOT NULL,
    prixod DECIMAL NOT NULL,
    rasxod DECIMAL NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    parent_id INTEGER REFERENCES main_book(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);