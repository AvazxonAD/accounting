CREATE TABLE IF NOT EXISTS real_cost_sub_child(
    id SERIAL PRIMARY KEY,
    contract_grafik_id INTEGER REFERENCES shartnoma_grafik(id),
    grafik_summa DECIMAL NOT NULL,
    rasxod_summa DECIMAL NOT NULL,
    remaining_summa DECIMAL NOT NULL,
    is_year BOOLEAN NOT NULL,
    parent_id INTEGER REFERENCES real_cost_child(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);