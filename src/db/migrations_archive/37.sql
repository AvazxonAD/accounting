ALTER TABLE shartnoma_grafik ADD COLUMN itogo DECIMAL;

UPDATE shartnoma_grafik
SET itogo = COALESCE(oy_1, 0) + COALESCE(oy_2, 0) + COALESCE(oy_3, 0) + 
            COALESCE(oy_4, 0) + COALESCE(oy_5, 0) + COALESCE(oy_6, 0) + 
            COALESCE(oy_7, 0) + COALESCE(oy_8, 0) + COALESCE(oy_9, 0) + 
            COALESCE(oy_10, 0) + COALESCE(oy_11, 0) + COALESCE(oy_12, 0);

ALTER TABLE shartnoma_grafik ALTER COLUMN itogo SET NOT NULL;