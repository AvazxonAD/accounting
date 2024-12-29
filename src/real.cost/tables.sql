CREATE TABLE real_cost_doc_parent(
    id BIGSERIAL PRIMARY KEY,
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    type_document VARCHAR(50) NOT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    month INT NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE real_cost_doc_child (
    id BIGSERIAL PRIMARY KEY,
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    parent_id BIGINT NOT NULL REFERENCES real_cost_doc_parent(id),
    debet_sum DECIMAL,
    kredit_sum DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE real_cost_end_parent (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id), 
    user_id_accepted INT REFERENCES users(id),
    accepted_time TIMESTAMP,
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    month INT NOT NULL,
    year INT NOT NULL,
    status INT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE real_cost_end_child (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT NOT NULL REFERENCES real_cost_end_parent(id),
    type_document VARCHAR(50) NOT NULL,
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    debet_sum DECIMAL NOT NULL,
    kredit_sum DECIMAL NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);