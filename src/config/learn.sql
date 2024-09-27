SELECT main_schet.*
FROM main_schet
JOIN users ON main_schet.user_id = users.id
JOIN regions ON users.region_id = regions.id
WHERE regions.id = region_id
