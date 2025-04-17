-- Table: public.main_zarplata
-- DROP TABLE IF EXISTS public.main_zarplata;
CREATE TABLE IF NOT EXISTS public.main_zarplata (
    id bigint NOT NULL DEFAULT nextval('main_zarplata_id_seq' :: regclass),
    user_id integer NOT NULL,
    kartochka character varying(255) COLLATE pg_catalog."default",
    rayon character varying(255) COLLATE pg_catalog."default",
    vacant_id integer DEFAULT 0,
    fio character varying(255) COLLATE pg_catalog."default",
    spravochik_zarplata_zvanie_id integer DEFAULT 0,
    xarbiy boolean,
    ostanovit_raschet boolean,
    raschet_schet character varying(255) COLLATE pg_catalog."default",
    fio_dop character varying(255) COLLATE pg_catalog."default",
    bank character varying(255) COLLATE pg_catalog."default",
    date_birth date,
    inps character varying(255) COLLATE pg_catalog."default",
    spravochnik_zarplata_grafik_raboti_id integer DEFAULT 0,
    spravochnik_sostav_id integer DEFAULT 0,
    stavka character varying(10) COLLATE pg_catalog."default",
    nachalo_slujbi date,
    vis_na_1_year integer,
    month_1 integer DEFAULT 0,
    day_1 integer DEFAULT 0,
    itogo numeric,
    workplace_id bigint DEFAULT 0,
    doljnost_name character varying(255) COLLATE pg_catalog."default",
    doljnost_prikaz_num character varying(255) COLLATE pg_catalog."default",
    doljnost_prikaz_date character varying(255) COLLATE pg_catalog."default",
    spravochnik_zarplata_istochnik_finance_id integer DEFAULT 0,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    isdeleted boolean DEFAULT false,
    inn character varying COLLATE pg_catalog."default",
    CONSTRAINT main_zarplata_pkey PRIMARY KEY (id),
    CONSTRAINT main_zarplata_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT main_zarplata_vacant_id_fkey FOREIGN KEY (vacant_id) REFERENCES public.vacant (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
) TABLESPACE pg_default;

ALTER TABLE
    IF EXISTS public.main_zarplata OWNER to postgres;

-- Index: idx_main_zarplata_spravochik_zarplata_zvanie_id
-- DROP INDEX IF EXISTS public.idx_main_zarplata_spravochik_zarplata_zvanie_id;
CREATE INDEX IF NOT EXISTS idx_main_zarplata_spravochik_zarplata_zvanie_id ON public.main_zarplata USING btree (spravochik_zarplata_zvanie_id ASC NULLS LAST) TABLESPACE pg_default;

-- Index: idx_main_zarplata_spravochnik_sostav_id
-- DROP INDEX IF EXISTS public.idx_main_zarplata_spravochnik_sostav_id;
CREATE INDEX IF NOT EXISTS idx_main_zarplata_spravochnik_sostav_id ON public.main_zarplata USING btree (spravochnik_sostav_id ASC NULLS LAST) TABLESPACE pg_default;

-- Index: idx_main_zarplata_spravochnik_zarplata_grafik_raboti_id
-- DROP INDEX IF EXISTS public.idx_main_zarplata_spravochnik_zarplata_grafik_raboti_id;
CREATE INDEX IF NOT EXISTS idx_main_zarplata_spravochnik_zarplata_grafik_raboti_id ON public.main_zarplata USING btree (
    spravochnik_zarplata_grafik_raboti_id ASC NULLS LAST
) TABLESPACE pg_default;

-- Index: idx_main_zarplata_spravochnik_zarplata_istochnik_finance_id
-- DROP INDEX IF EXISTS public.idx_main_zarplata_spravochnik_zarplata_istochnik_finance_id;
CREATE INDEX IF NOT EXISTS idx_main_zarplata_spravochnik_zarplata_istochnik_finance_id ON public.main_zarplata USING btree (
    spravochnik_zarplata_istochnik_finance_id ASC NULLS LAST
) TABLESPACE pg_default;

-- Index: idx_main_zarplata_user_id
-- DROP INDEX IF EXISTS public.idx_main_zarplata_user_id;
CREATE INDEX IF NOT EXISTS idx_main_zarplata_user_id ON public.main_zarplata USING btree (user_id ASC NULLS LAST) TABLESPACE pg_default;

-- Index: idx_main_zarplata_vacant_id
-- DROP INDEX IF EXISTS public.idx_main_zarplata_vacant_id;
CREATE INDEX IF NOT EXISTS idx_main_zarplata_vacant_id ON public.main_zarplata USING btree (vacant_id ASC NULLS LAST) TABLESPACE pg_default;

-- Index: idx_main_zarplata_workplace_id
-- DROP INDEX IF EXISTS public.idx_main_zarplata_workplace_id;
CREATE INDEX IF NOT EXISTS idx_main_zarplata_workplace_id ON public.main_zarplata USING btree (workplace_id ASC NULLS LAST) TABLESPACE pg_default;