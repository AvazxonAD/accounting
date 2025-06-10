ALTER TABLE
    public.users
ALTER COLUMN
    role_id TYPE integer USING role_id :: integer;

ALTER TABLE
    public.users
ALTER COLUMN
    region_id TYPE integer USING region_id :: integer;