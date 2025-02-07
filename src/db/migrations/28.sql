CREATE TABLE organization_by_raschet_schet (
    id SERIAL PRIMARY KEY,
    spravochnik_organization_id INT NOT NULL REFERENCES spravochnik_organization(id),
    raschet_schet VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE organization_by_raschet_schet_gazna (
    id SERIAL PRIMARY KEY,
    spravochnik_organization_id INT NOT NULL REFERENCES spravochnik_organization(id),
    raschet_schet_gazna VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);
