-- 1. UPDATE orqali qiymatlarni yangilang
UPDATE
    bajarilgan_ishlar_jur3 d
SET
    schet_id = j.id
FROM
    jur_schets j
WHERE
    j.main_schet_id = d.main_schet_id
    AND type = 'jur3';

-- 2. NULL qiymatlar yo‘qligini tekshiring
SELECT
    COUNT(*)
FROM
    bajarilgan_ishlar_jur3
WHERE
    schet_id IS NULL;

-- 3. Agar yuqoridagisi 0 bo‘lsa, NOT NULL qilib o‘zgartiring
ALTER TABLE
    bajarilgan_ishlar_jur3
ALTER COLUMN
    schet_id
SET
    NOT NULL;