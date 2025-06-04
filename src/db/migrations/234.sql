ALTER TABLE
    public.bajarilgan_ishlar_jur3
ALTER COLUMN
    organization_by_raschet_schet_id TYPE integer USING organization_by_raschet_schet_id :: integer;

ALTER TABLE
    public.bajarilgan_ishlar_jur3
ALTER COLUMN
    organization_by_raschet_schet_gazna_id TYPE integer USING organization_by_raschet_schet_gazna_id :: integer;

ALTER TABLE
    public.bajarilgan_ishlar_jur3
ALTER COLUMN
    shartnoma_grafik_id TYPE integer USING shartnoma_grafik_id :: integer;

ALTER TABLE
    public.bank_prixod
ALTER COLUMN
    shartnoma_grafik_id TYPE integer USING shartnoma_grafik_id :: integer;

ALTER TABLE
    public.bank_rasxod
ALTER COLUMN
    organization_by_raschet_schet_id TYPE integer USING organization_by_raschet_schet_id :: integer;

ALTER TABLE
    public.bank_rasxod
ALTER COLUMN
    organization_by_raschet_schet_gazna_id TYPE integer USING organization_by_raschet_schet_gazna_id :: integer;

ALTER TABLE
    public.bank_rasxod
ALTER COLUMN
    shartnoma_grafik_id TYPE integer USING shartnoma_grafik_id :: integer;

ALTER TABLE
    public.document_prixod_jur7
ALTER COLUMN
    shartnoma_grafik_id TYPE integer USING shartnoma_grafik_id :: integer;

ALTER TABLE
    public.document_prixod_jur7
ALTER COLUMN
    organization_by_raschet_schet_id TYPE integer USING organization_by_raschet_schet_id :: integer;

ALTER TABLE
    public.document_prixod_jur7
ALTER COLUMN
    organization_by_raschet_schet_gazna_id TYPE integer USING organization_by_raschet_schet_gazna_id :: integer;

ALTER TABLE
    public.iznos_tovar_jur7
ALTER COLUMN
    region_id TYPE integer USING region_id :: integer;

ALTER TABLE
    public.kassa_prixod_child
ALTER COLUMN
    kassa_prixod_id TYPE integer USING kassa_prixod_id :: integer;

ALTER TABLE
    public.kassa_rasxod_child
ALTER COLUMN
    kassa_rasxod_id TYPE integer USING kassa_rasxod_id :: integer;

ALTER TABLE
    public.kursatilgan_hizmatlar_jur152
ALTER COLUMN
    organization_by_raschet_schet_id TYPE integer USING organization_by_raschet_schet_id :: integer;

ALTER TABLE
    public.kursatilgan_hizmatlar_jur152
ALTER COLUMN
    organization_by_raschet_schet_gazna_id TYPE integer USING organization_by_raschet_schet_gazna_id :: integer;

ALTER TABLE
    public.kursatilgan_hizmatlar_jur152
ALTER COLUMN
    shartnoma_grafik_id TYPE integer USING shartnoma_grafik_id :: integer;

ALTER TABLE
    public.saldo_naimenovanie_jur7
ALTER COLUMN
    region_id TYPE integer USING region_id :: integer;

ALTER TABLE
    public.shartnoma_grafik
ALTER COLUMN
    smeta_id TYPE integer USING smeta_id :: integer;