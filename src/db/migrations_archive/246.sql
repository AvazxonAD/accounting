CREATE TABLE minimum_wage (
    id INTEGER PRIMARY KEY,
    summa INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);