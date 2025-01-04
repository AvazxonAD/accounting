CREATE TABLE ox_parent(
    id BIGSERIAL PRIMARY KEY,
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    user_id INT NOT NULL REFERENCES users(id),
    month INT NOT NULL,
    year INT NOT NULL,
    user_id_accepted INT REFERENCES users(id),
    accepted_time TIMESTAMP,
    status INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE ox_child (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT NOT NULL REFERENCES ox_parent(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    allocated_amount DECIMAL NOT NULL,
    by_smeta DECIMAL NOT NULL,
    kassa_rasxod DECIMAL NOT NULL,
    real_rasxod DECIMAL NOT NULL,
    remaining DECIMAL NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);


Table documents_1_ox_xisobot
{
  id bigint
  user_id int [not null, ref: > users.id]
  main_schet_id int [not null, ref: > main_schet.id]
  smeta_id int [not null, ref: > smeta_grafik.smeta_id]
  month int
  year int
  ajratilgan_mablag decimal
  tulangan_mablag_smeta_buyicha decimal
  kassa_rasxod decimal
  haqiqatda_harajatlar decimal
  qoldiq decimal
  
  created_at timestamp 
  updated_at timestamp 
  isdeleted bool
}

Table zakonchit_1_ox_xisobot
{
  id bigint
  user_id int [not null, ref: > users.id] // Жунатган одам
  document_yaratilgan_vaqt timestamp
  user_id_qabul_qilgan int [null, ref: > users.id] // Кабул килган одам // Кабул килган ёки кайтарворган одам малумоти шунга сакланаверади.
  document_qabul_qilingan_vaqt timestamp
  main_schet_id int [not null, ref: > main_schet.id]
  smeta_id int [not null, ref: > smeta_grafik.smeta_id]
  month int
  year int
  ajratilgan_mablag decimal
  tulangan_mablag_smeta_buyicha decimal
  kassa_rasxod decimal
  haqiqatda_harajatlar decimal
  qoldiq decimal
  status int // 1-Отправлено; 2-Получено; 3-Отказано

  created_at timestamp 
  updated_at timestamp 
  isdeleted bool
}