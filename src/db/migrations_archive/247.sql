drop table minimum_wage;

CREATE TABLE minimum_wage (
    id SERIAL PRIMARY KEY,
    summa INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

INSERT INTO
    minimum_wage(summa, created_at, updated_at)
values
    (375000, now(), now());