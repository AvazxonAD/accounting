ALTER TABLE
    public.users
ALTER COLUMN
    role_id TYPE smallint USING role_id :: smallint;

ALTER TABLE
    public.users
ALTER COLUMN
    region_id TYPE smallint USING region_id :: smallint;