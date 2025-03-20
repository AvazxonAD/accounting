ALTER TABLE document_vnutr_peremesh_jur7_child
ADD COLUMN eski_iznos_summa DECIMAL;

ALTER TABLE document_prixod_jur7_child
ADD COLUMN iznos_schet VARCHAR;

ALTER TABLE document_prixod_jur7_child
ADD COLUMN iznos_sub_schet VARCHAR;

ALTER TABLE document_prixod_jur7_child
ADD COLUMN iznos_summa DECIMAL;