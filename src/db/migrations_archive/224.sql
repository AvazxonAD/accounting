CREATE TABLE smeta_grafik_parent(
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    order_number INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    isdeleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);