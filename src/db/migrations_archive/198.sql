DO $$ DECLARE rec RECORD;

new_schet_id INTEGER;

BEGIN FOR rec IN
SELECT
    id,
    main_schet_id
FROM
    kursatilgan_hizmatlar_jur152 LOOP
SELECT
    id INTO new_schet_id
FROM
    jur_schets
WHERE
    main_schet_id = rec.main_schet_id
    AND schet = '152'
    AND type = '152';

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
    (rec.main_schet_id, '152', '152', now(), now()) RETURNING id INTO new_schet_id;

END IF;

UPDATE
    kursatilgan_hizmatlar_jur152
SET
    schet_id = new_schet_id
WHERE
    id = rec.id
    AND isdeleted = false
    AND schet_id IS NULL;

END LOOP;

END $$;