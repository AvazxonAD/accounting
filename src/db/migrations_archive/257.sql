UPDATE
    work_trip
SET
    isdeleted = true
where
    from_region_id is null
    or to_region_id is null