CREATE TABLE IF NOT EXISTS video_module(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    create_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false
)