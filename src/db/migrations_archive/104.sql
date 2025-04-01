CREATE TABLE IF NOT EXISTS video(
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES video_module(id),
    name VARCHAR NOT NULL,
    file VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false
)