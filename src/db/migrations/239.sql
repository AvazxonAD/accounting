alter table
    naimenovanie_tovarov_jur7
add
    column unit_id integer references storage_unit(id);

update
    naimenovanie_tovarov_jur7
set
    unit_id = 5
where
    unit_id is null;

alter table
    naimenovanie_tovarov_jur7
alter column
    unit_id
set
    not null;