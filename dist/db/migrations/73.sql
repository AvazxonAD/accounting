CREATE TABLE report_title(
    id SERIAL PRIMARY KEY,
    name VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
)