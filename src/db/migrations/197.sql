<<<<<<< HEAD
CREATE TABLE IF NOT EXISTS odinox_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO
    odinox_type(name, sort_order)
VALUES
    ('jur1_rasxod', 1),
    ('jur2_rasxod', 2),
    ('akt', 3),
    ('jur5', 4),
    ('jur7_prixod', 5);

CREATE TABLE IF NOT EXISTS odinox(
    id SERIAL PRIMARY KEY,
    status INTEGER NOT NULL,
    accept_time TIMESTAMPTZ,
    send_time TIMESTAMPTZ,
    main_schet_id INTEGER REFERENCES main_schet(id) NOT NULL,
    accept_user_id INTEGER REFERENCES users(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS odinox_child(
    id SERIAL PRIMARY KEY,
    smeta_id INTEGER REFERENCES smeta(id),
    summa DECIMAL NOT NULL,
    parent_id INTEGER REFERENCES odinox(id) NOT NULL,
    type_id INTEGER REFERENCES odinox_type(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);
=======
DO $$ DECLARE rec RECORD;

new_schet_id INTEGER;

BEGIN FOR rec IN
SELECT
    id,
    main_schet_id
FROM
    bajarilgan_ishlar_jur3 LOOP
SELECT
    id INTO new_schet_id
FROM
    jur_schets
WHERE
    main_schet_id = rec.main_schet_id
    AND schet = '159'
    AND type = '159';

IF new_schet_id IS NULL THEN
INSERT INTO
    jur_schets (
        main_schet_id,
        schet,
        type,
        created_at,
        updated_at
    )
VALUES
    (rec.main_schet_id, '159', '159', now(), now()) RETURNING id INTO new_schet_id;

END IF;

UPDATE
    bajarilgan_ishlar_jur3
SET
    schet_id = new_schet_id
WHERE
    id = rec.id
    AND isdeleted = false
    AND schet_id IS NULL;

END LOOP;

END $$;
>>>>>>> c752c5eec1ef36fb2600d307489eb91002f437d9
