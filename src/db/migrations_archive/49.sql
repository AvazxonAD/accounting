UPDATE document_prixod_jur7_child SET summa_s_nds = summa WHERE summa_s_nds IS NULL;

ALTER TABLE document_prixod_jur7_child ALTER COLUMN summa_s_nds  SET NOT NULL; 