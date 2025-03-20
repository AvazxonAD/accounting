INSERT INTO organization_by_raschet_schet_gazna(
    spravochnik_organization_id, 
    raschet_schet_gazna,
    created_at, 
    updated_at
)
SELECT 
    id, 
    raschet_schet_gazna,
    NOW(), 
    NOW()
FROM spravochnik_organization;

INSERT INTO organization_by_raschet_schet(
    spravochnik_organization_id, 
    raschet_schet,
    created_at, 
    updated_at
)
SELECT 
    id, 
    raschet_schet,
    NOW(), 
    NOW()
FROM spravochnik_organization;
