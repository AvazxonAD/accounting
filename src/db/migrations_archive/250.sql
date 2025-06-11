CREATE TABLE work_trip (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    doc_num VARCHAR NOT NULL,
    doc_date DATE NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    day_summa DECIMAL NOT NULL,
    hostel_ticket_number VARCHAR NOT NULL,
    hostel_summa DECIMAL NOT NULL,
    from_district_id INTEGER NOT NULL REFERENCES districts(id),
    to_district_id INTEGER NOT NULL REFERENCES districts(id),
    road_ticket_number VARCHAR,
    road_summma DECIMAL NOT NULL,
    summa DECIMAL NOT NULL,
    main_schet_id INTEGER NOT NULL REFERENCES main_schet(id),
    schet_id INTEGER NOT NULL REFERENCES jur_schets(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE work_trip_child (
    id SERIAL PRIMARY KEY,
    schet_id INTEGER NOT NULL REFERENCES spravochnik_operatsii(id),
    summa DECIMAL NOT NULL,
    type VARCHAR NOT NULL,
    parent_id INTEGER NOT NULL REFERENCES work_trip(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);