CREATE TABLE IF NOT EXISTS prixod_book(
    id SERIAL PRIMARY KEY,
    status INTEGER NOT NULL,
    accept_time TIMESTAMPTZ,
    send_time TIMESTAMPTZ NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    accept_user_id INTEGER REFERENCES users(id),
    budjet_id INTEGER REFERENCES spravochnik_budjet_name(id),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS prixod_book_child(
    id SERIAL PRIMARY KEY,
    schet VARCHAR NOT NULL,
    prixod DECIMAL NOT NULL,
    rasxod DECIMAL NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    parent_id INTEGER REFERENCES prixod_book(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);