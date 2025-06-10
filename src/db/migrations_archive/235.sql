ALTER TABLE
    public.document_prixod_jur7_child
ALTER COLUMN
    naimenovanie_tovarov_jur7_id TYPE bigint USING naimenovanie_tovarov_jur7_id :: bigint;

ALTER TABLE
    public.document_rasxod_jur7_child
ALTER COLUMN
    naimenovanie_tovarov_jur7_id TYPE bigint USING naimenovanie_tovarov_jur7_id :: bigint;

ALTER TABLE
    public.document_vnutr_peremesh_jur7_child
ALTER COLUMN
    naimenovanie_tovarov_jur7_id TYPE bigint USING naimenovanie_tovarov_jur7_id :: bigint;

ALTER TABLE
    public.documents_glavniy_kniga
ALTER COLUMN
    spravochnik_main_book_schet_id TYPE bigint USING spravochnik_main_book_schet_id :: bigint;

ALTER TABLE
    public.iznos_tovar_jur7
ALTER COLUMN
    naimenovanie_tovarov_jur7_id TYPE bigint USING naimenovanie_tovarov_jur7_id :: bigint;

ALTER TABLE
    public.zakonchit_glavniy_kniga
ALTER COLUMN
    spravochnik_main_book_schet_id TYPE bigint USING spravochnik_main_book_schet_id :: bigint;