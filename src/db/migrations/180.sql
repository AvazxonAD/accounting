-- jurnal 7
delete from
    document_prixod_jur7_child;

delete from
    document_prixod_jur7;

delete from
    document_rasxod_jur7_child;

delete from
    document_rasxod_jur7;

delete from
    document_vnutr_peremesh_jur7_child;

delete from
    document_vnutr_peremesh_jur7;

delete from
    saldo_naimenovanie_jur7;

delete from
    iznos_tovar_jur7;

delete from
    naimenovanie_tovarov_jur7;

delete from
    saldo_date;

-- alter main schet id
ALTER TABLE
    document_prixod_jur7
ALTER COLUMN
    main_schet_id
SET
    NOT NULL;

ALTER TABLE
    document_rasxod_jur7
ALTER COLUMN
    main_schet_id
SET
    NOT NULL;

ALTER TABLE
    document_vnutr_peremesh_jur7
ALTER COLUMN
    main_schet_id
SET
    NOT NULL;

ALTER TABLE
    saldo_naimenovanie_jur7
ALTER COLUMN
    main_schet_id
SET
    NOT NULL;

ALTER TABLE
    saldo_date
ALTER COLUMN
    main_schet_id
SET
    NOT NULL;

-- alter budjet id 
ALTER TABLE
    document_prixod_jur7
ALTER COLUMN
    budjet_id
SET
    NOT NULL;

ALTER TABLE
    document_rasxod_jur7
ALTER COLUMN
    budjet_id
SET
    NOT NULL;

ALTER TABLE
    document_vnutr_peremesh_jur7
ALTER COLUMN
    budjet_id
SET
    NOT NULL;

ALTER TABLE
    saldo_naimenovanie_jur7
ALTER COLUMN
    budjet_id
SET
    NOT NULL;

ALTER TABLE
    saldo_date
ADD
    COLUMN budjet_id INTEGER REFERENCES spravochnik_budjet_name(id);

ALTER TABLE
    saldo_date
ALTER COLUMN
    budjet_id
SET
    NOT NULL;