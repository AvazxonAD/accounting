CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);


CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  role_id SMALLINT REFERENCES role(id),
  region_id SMALLINT REFERENCES regions(id),
  fio VARCHAR(200),
  login VARCHAR(200),
  password VARCHAR(200),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE access (
  id SERIAL PRIMARY KEY,
  region BOOLEAN DEFAULT FALSE, 
  role BOOLEAN DEFAULT FALSE, 
  role_get BOOLEAN DEFAULT FALSE,
  users BOOLEAN DEFAULT FALSE, 
  budjet_get BOOLEAN DEFAULT FALSE,    
  budjet BOOLEAN DEFAULT FALSE,        
  access BOOLEAN DEFAULT FALSE,     
  spravochnik BOOLEAN DEFAULT FALSE, 
  smeta BOOLEAN DEFAULT FALSE, 
  smeta_get BOOLEAN DEFAULT FALSE,     
  smeta_grafik BOOLEAN DEFAULT FALSE,  
  bank BOOLEAN DEFAULT FALSE, 
  kassa BOOLEAN DEFAULT FALSE, 
  shartnoma BOOLEAN DEFAULT FALSE, 
  jur3 BOOLEAN DEFAULT FALSE, 
  jur152 BOOLEAN DEFAULT FALSE,        
  jur4 BOOLEAN DEFAULT FALSE, 
  region_users BOOLEAN DEFAULT FALSE, 
  podotchet_monitoring BOOLEAN DEFAULT FALSE, 
  organization_monitoring BOOLEAN DEFAULT FALSE, 
  role_id INT REFERENCES role(id),
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
  );
