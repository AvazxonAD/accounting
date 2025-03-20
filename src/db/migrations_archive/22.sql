CREATE TABLE IF NOT EXISTS bajarilgan_ishlar_jur3 (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    user_id INTEGER REFERENCES users(id),
    main_schet_id INT REFERENCES main_schet(id),
    summa DECIMAL,
    opisanie VARCHAR(255),
    id_spravochnik_organization INT REFERENCES spravochnik_organization(id),
    shartnomalar_organization_id INT REFERENCES shartnomalar_organization(id),
    spravochnik_operatsii_own_id INT REFERENCES spravochnik_operatsii(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bajarilgan_ishlar_jur3_child (
    id SERIAL PRIMARY KEY,
    spravochnik_operatsii_id INT REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    spravochnik_operatsii_own_id INT REFERENCES spravochnik_operatsii(id),
    bajarilgan_ishlar_jur3_id INT REFERENCES bajarilgan_ishlar_jur3(id),
    user_id INT REFERENCES users(id),
    main_schet_id INT REFERENCES main_schet(id),
    kol DECIMAL,
    sena DECIMAL,
    nds_foiz DECIMAL,
    nds_summa DECIMAL,
    summa_s_nds DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS access (
    id SERIAL PRIMARY KEY,
    role_create BOOLEAN DEFAULT FALSE,
    role_update BOOLEAN DEFAULT FALSE,
    role_get BOOLEAN DEFAULT FALSE,
    role_delete BOOLEAN DEFAULT FALSE,
    region_create BOOLEAN DEFAULT FALSE,
    region_update BOOLEAN DEFAULT FALSE,
    region_get BOOLEAN DEFAULT FALSE,
    region_delete BOOLEAN DEFAULT FALSE,
    users_create BOOLEAN DEFAULT FALSE,
    users_update BOOLEAN DEFAULT FALSE,
    users_get BOOLEAN DEFAULT FALSE,
    users_delete BOOLEAN DEFAULT FALSE,
    budjet_create BOOLEAN DEFAULT FALSE,
    budjet_update BOOLEAN DEFAULT FALSE,
    budjet_get BOOLEAN DEFAULT FALSE,
    budjet_delete BOOLEAN DEFAULT FALSE,
    access_update BOOLEAN DEFAULT FALSE,
    access_get BOOLEAN DEFAULT FALSE,
    main_schet_create BOOLEAN DEFAULT FALSE,
    main_schet_update BOOLEAN DEFAULT FALSE,
    main_schet_get BOOLEAN DEFAULT FALSE,
    main_schet_delete BOOLEAN DEFAULT FALSE,
    operatsii_create BOOLEAN DEFAULT FALSE,
    operatsii_update BOOLEAN DEFAULT FALSE,
    operatsii_get BOOLEAN DEFAULT FALSE,
    operatsii_delete BOOLEAN DEFAULT FALSE,
    organization_create BOOLEAN DEFAULT FALSE,
    organization_update BOOLEAN DEFAULT FALSE,
    organization_get BOOLEAN DEFAULT FALSE,
    organization_delete BOOLEAN DEFAULT FALSE,
    podotchet_create BOOLEAN DEFAULT FALSE,
    podotchet_update BOOLEAN DEFAULT FALSE,
    podotchet_get BOOLEAN DEFAULT FALSE,
    podotchet_delete BOOLEAN DEFAULT FALSE,
    podpis_create BOOLEAN DEFAULT FALSE,
    podpis_update BOOLEAN DEFAULT FALSE,
    podpis_get BOOLEAN DEFAULT FALSE,
    podpis_delete BOOLEAN DEFAULT FALSE,
    podrazdelenie_create BOOLEAN DEFAULT FALSE,
    podrazdelenie_update BOOLEAN DEFAULT FALSE,
    podrazdelenie_get BOOLEAN DEFAULT FALSE,
    podrazdelenie_delete BOOLEAN DEFAULT FALSE,
    sostav_create BOOLEAN DEFAULT FALSE,
    sostav_update BOOLEAN DEFAULT FALSE,
    sostav_get BOOLEAN DEFAULT FALSE,
    sostav_delete BOOLEAN DEFAULT FALSE,
    type_operatsii_create BOOLEAN DEFAULT FALSE,
    type_operatsii_update BOOLEAN DEFAULT FALSE,
    type_operatsii_get BOOLEAN DEFAULT FALSE,
    type_operatsii_delete BOOLEAN DEFAULT FALSE,
    akt_create BOOLEAN DEFAULT FALSE,
    akt_update BOOLEAN DEFAULT FALSE,
    akt_get BOOLEAN DEFAULT FALSE,
    akt_delete BOOLEAN DEFAULT FALSE,
    admin_create BOOLEAN DEFAULT FALSE,
    admin_update BOOLEAN DEFAULT FALSE,
    admin_get BOOLEAN DEFAULT FALSE,
    admin_delete BOOLEAN DEFAULT FALSE,
    avans_create BOOLEAN DEFAULT FALSE,
    avans_update BOOLEAN DEFAULT FALSE,
    avans_get BOOLEAN DEFAULT FALSE,
    avans_delete BOOLEAN DEFAULT FALSE,
    bank_prixod_create BOOLEAN DEFAULT FALSE,
    bank_prixod_update BOOLEAN DEFAULT FALSE,
    bank_prixod_get BOOLEAN DEFAULT FALSE,
    bank_prixod_delete BOOLEAN DEFAULT FALSE,
    bank_rasxod_create BOOLEAN DEFAULT FALSE,
    bank_rasxod_update BOOLEAN DEFAULT FALSE,
    bank_rasxod_get BOOLEAN DEFAULT FALSE,
    bank_rasxod_delete BOOLEAN DEFAULT FALSE,
    bank_monitoring BOOLEAN DEFAULT FALSE,
    internal_j7_create BOOLEAN DEFAULT FALSE,
    internal_j7_update BOOLEAN DEFAULT FALSE,
    internal_j7_get BOOLEAN DEFAULT FALSE,
    internal_j7_delete BOOLEAN DEFAULT FALSE,
    prixod_j7_create BOOLEAN DEFAULT FALSE,
    prixod_j7_update BOOLEAN DEFAULT FALSE,
    prixod_j7_get BOOLEAN DEFAULT FALSE,
    prixod_j7_delete BOOLEAN DEFAULT FALSE,
    rasxod_j7_create BOOLEAN DEFAULT FALSE,
    rasxod_j7_update BOOLEAN DEFAULT FALSE,
    rasxod_j7_get BOOLEAN DEFAULT FALSE,
    rasxod_j7_delete BOOLEAN DEFAULT FALSE,
    iznos_j7 BOOLEAN DEFAULT FALSE,
    group_j7_create BOOLEAN DEFAULT FALSE,
    group_j7_update BOOLEAN DEFAULT FALSE,
    group_j7_get BOOLEAN DEFAULT FALSE,
    group_j7_delete BOOLEAN DEFAULT FALSE,
    product_j7_create BOOLEAN DEFAULT FALSE,
    product_j7_update BOOLEAN DEFAULT FALSE,
    product_j7_get BOOLEAN DEFAULT FALSE,
    product_j7_delete BOOLEAN DEFAULT FALSE,
    pereotsenka_j7_create BOOLEAN DEFAULT FALSE,
    pereotsenka_j7_update BOOLEAN DEFAULT FALSE,
    pereotsenka_j7_get BOOLEAN DEFAULT FALSE,
    pereotsenka_j7_delete BOOLEAN DEFAULT FALSE,
    podrazdelenie_j7_create BOOLEAN DEFAULT FALSE,
    podrazdelenie_j7_update BOOLEAN DEFAULT FALSE,
    podrazdelenie_j7_get BOOLEAN DEFAULT FALSE,
    podrazdelenie_j7_delete BOOLEAN DEFAULT FALSE,
    responsible_j7_create BOOLEAN DEFAULT FALSE,
    responsible_j7_update BOOLEAN DEFAULT FALSE,
    responsible_j7_get BOOLEAN DEFAULT FALSE,
    responsible_j7_delete BOOLEAN DEFAULT FALSE,
    unit_storage_j7_create BOOLEAN DEFAULT FALSE,
    unit_storage_j7_update BOOLEAN DEFAULT FALSE,
    unit_storage_j7_get BOOLEAN DEFAULT FALSE,
    unit_storage_j7_delete BOOLEAN DEFAULT FALSE,
    kassa_prixod_create BOOLEAN DEFAULT FALSE,
    kassa_prixod_update BOOLEAN DEFAULT FALSE,
    kassa_prixod_get BOOLEAN DEFAULT FALSE,
    kassa_prixod_delete BOOLEAN DEFAULT FALSE,
    kassa_rasxod_create BOOLEAN DEFAULT FALSE,
    kassa_rasxod_update BOOLEAN DEFAULT FALSE,
    kassa_rasxod_get BOOLEAN DEFAULT FALSE,
    kassa_rasxod_delete BOOLEAN DEFAULT FALSE,
    kassa_monitoring BOOLEAN DEFAULT FALSE,
    organ_monitoring BOOLEAN DEFAULT FALSE,
    podotchet_monitoring BOOLEAN DEFAULT FALSE,
    shartnoma_create BOOLEAN DEFAULT FALSE,
    shartnoma_update BOOLEAN DEFAULT FALSE,
    shartnoma_get BOOLEAN DEFAULT FALSE,
    shartnoma_delete BOOLEAN DEFAULT FALSE,
    shartnoma_grafik_create BOOLEAN DEFAULT FALSE,
    shartnoma_grafik_update BOOLEAN DEFAULT FALSE,
    shartnoma_grafik_get BOOLEAN DEFAULT FALSE,
    shartnoma_grafik_delete BOOLEAN DEFAULT FALSE,
    show_service_create BOOLEAN DEFAULT FALSE,
    show_service_update BOOLEAN DEFAULT FALSE,
    show_service_get BOOLEAN DEFAULT FALSE,
    show_service_delete BOOLEAN DEFAULT FALSE,
    smeta_create BOOLEAN DEFAULT FALSE,
    smeta_update BOOLEAN DEFAULT FALSE,
    smeta_get BOOLEAN DEFAULT FALSE,
    smeta_delete BOOLEAN DEFAULT FALSE,
    smeta_grafik_create BOOLEAN DEFAULT FALSE,
    smeta_grafik_update BOOLEAN DEFAULT FALSE,
    smeta_grafik_get BOOLEAN DEFAULT FALSE,
    smeta_grafik_delete BOOLEAN DEFAULT FALSE,
    role_id INT REFERENCES role(id),
    region_id INT REFERENCES regions(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS oldAccess (
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
    jur7 BOOLEAN DEFAULT FALSE,
    role_id INT REFERENCES role(id),
    region_id INT REFERENCES regions(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS avans_otchetlar_jur4 (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    doc_num VARCHAR(255),
    doc_date DATE,
    main_schet_id INT REFERENCES main_schet(id),
    summa DECIMAL,
    opisanie VARCHAR(255),
    spravochnik_podotchet_litso_id INT REFERENCES spravochnik_podotchet_litso(id),
    spravochnik_operatsii_own_id INT REFERENCES spravochnik_operatsii(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS avans_otchetlar_jur4_child (
    id SERIAL PRIMARY KEY,
    spravochnik_operatsii_id INT REFERENCES spravochnik_operatsii(id),
    spravochnik_operatsii_own_id INT REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    user_id INT REFERENCES users(id),
    avans_otchetlar_jur4_id INT REFERENCES avans_otchetlar_jur4(id),
    main_schet_id INT REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bank_prixod (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    doc_num VARCHAR(255),
    doc_date DATE,
    summa DECIMAL,
    provodki_boolean BOOLEAN,
    dop_provodki_boolean BOOLEAN,
    opisanie VARCHAR(255),
    id_spravochnik_organization INTEGER REFERENCES spravochnik_organization(id),
    id_shartnomalar_organization INTEGER REFERENCES shartnomalar_organization(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bank_prixod_child (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    summa DECIMAL,
    spravochnik_operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
    id_spravochnik_podrazdelenie INTEGER REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INTEGER REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INTEGER REFERENCES spravochnik_type_operatsii(id),
    id_spravochnik_podotchet_litso INTEGER REFERENCES spravochnik_podotchet_litso(id),
    id_bank_prixod INTEGER REFERENCES bank_prixod(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    main_zarplata_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bank_rasxod (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    user_id INTEGER REFERENCES users(id),
    summa DECIMAL,
    opisanie VARCHAR(255),
    id_spravochnik_organization INTEGER REFERENCES spravochnik_organization(id),
    id_shartnomalar_organization INTEGER REFERENCES shartnomalar_organization(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    rukovoditel VARCHAR,
    glav_buxgalter VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bank_rasxod_child (
    id SERIAL PRIMARY KEY,
    spravochnik_operatsii_id INTEGER REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INTEGER REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INTEGER REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INTEGER REFERENCES spravochnik_type_operatsii(id),
    id_bank_rasxod INTEGER REFERENCES bank_rasxod(id),
    user_id INTEGER REFERENCES users(id),
    main_schet_id INTEGER REFERENCES main_schet(id),
    main_zarplata_id INTEGER,
    id_spravochnik_podotchet_litso INTEGER REFERENCES spravochnik_podotchet_litso(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS kassa_prixod (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    opisanie VARCHAR(500),
    summa DECIMAL,
    id_podotchet_litso INT REFERENCES spravochnik_podotchet_litso(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS kassa_prixod_child (
    id SERIAL PRIMARY KEY,
    spravochnik_operatsii_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    kassa_prixod_id BIGINT NOT NULL REFERENCES kassa_prixod(id),
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS kassa_rasxod (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255),
    doc_date DATE,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    opisanie VARCHAR(500),
    summa DECIMAL,
    id_podotchet_litso INT REFERENCES spravochnik_podotchet_litso(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS kassa_rasxod_child (
    id SERIAL PRIMARY KEY,
    spravochnik_operatsii_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    user_id INT NOT NULL REFERENCES users(id),
    kassa_rasxod_id BIGINT NOT NULL REFERENCES kassa_rasxod(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS documents_glavniy_kniga (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    spravochnik_main_book_schet_id INT NOT NULL REFERENCES spravochnik_main_book_schet(id),
    type_document VARCHAR(50) NOT NULL,
    month INT NOT NULL,
    year INT CHECK (year > 1900),
    debet_sum DECIMAL,
    kredit_sum DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS zakonchit_glavniy_kniga (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    document_yaratilgan_vaqt TIMESTAMP DEFAULT NOW(),
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    spravochnik_main_book_schet_id INT NOT NULL REFERENCES spravochnik_main_book_schet(id),
    type_document VARCHAR(50) NOT NULL,
    month INT NOT NULL,
    year INT CHECK (year > 1900),
    debet_sum DECIMAL,
    kredit_sum DECIMAL,
    status INT CHECK (status IN (1, 2, 3)),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS documents_1_ox_xisobot (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    month INT NOT NULL,
    year INT NOT NULL,
    ajratilgan_mablag DECIMAL NOT NULL,
    tulangan_mablag_smeta_buyicha DECIMAL NOT NULL,
    kassa_rasxod DECIMAL NOT NULL,
    haqiqatda_harajatlar DECIMAL NOT NULL,
    qoldiq DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS zakonchit_1_ox_xisobot (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    document_yaratilgan_vaqt TIMESTAMP NOT NULL,
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    month INT NOT NULL,
    year INT NOT NULL,
    ajratilgan_mablag DECIMAL NOT NULL,
    tulangan_mablag_smeta_buyicha DECIMAL NOT NULL,
    kassa_rasxod DECIMAL NOT NULL,
    haqiqatda_harajatlar DECIMAL NOT NULL,
    qoldiq DECIMAL NOT NULL,
    status INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS documents_haqiqiy_harajat (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    type_document VARCHAR NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    debet_sum DECIMAL NOT NULL,
    kredit_sum DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS zakonchit_haqiqiy_harajat (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    document_yaratilgan_vaqt TIMESTAMP NOT NULL,
    user_id_qabul_qilgan INT REFERENCES users(id),
    document_qabul_qilingan_vaqt TIMESTAMP,
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    budjet_id INT NOT NULL REFERENCES spravochnik_budjet_name(id),
    smeta_grafik_id INT NOT NULL REFERENCES smeta_grafik(id),
    type_document VARCHAR NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    debet_sum DECIMAL NOT NULL,
    kredit_sum DECIMAL NOT NULL,
    status INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);



CREATE TABLE IF NOT EXISTS shartnomalar_organization (
    id SERIAL PRIMARY KEY,
    doc_num VARCHAR(255) NOT NULL,
    doc_date DATE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    budjet_id INTEGER REFERENCES spravochnik_budjet_name(id),
    summa DECIMAL NOT NULL,
    opisanie TEXT,
    smeta_id INTEGER REFERENCES smeta(id),
    smeta2_id INTEGER REFERENCES smeta(id),
    spravochnik_organization_id INTEGER REFERENCES spravochnik_organization(id),
    pudratchi_bool BOOLEAN,
    yillik_oylik BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS shartnoma_grafik (
  id SERIAL PRIMARY KEY,
  id_shartnomalar_organization INTEGER REFERENCES shartnomalar_organization(id),
  user_id INTEGER REFERENCES users(id),
  budjet_id INTEGER REFERENCES spravochnik_budjet_name(id),
  oy_1 DECIMAL DEFAULT 0,
  oy_2 DECIMAL DEFAULT 0,
  oy_3 DECIMAL DEFAULT 0,
  oy_4 DECIMAL DEFAULT 0,
  oy_5 DECIMAL DEFAULT 0,
  oy_6 DECIMAL DEFAULT 0,
  oy_7 DECIMAL DEFAULT 0,
  oy_8 DECIMAL DEFAULT 0,
  oy_9 DECIMAL DEFAULT 0,
  oy_10 DECIMAL DEFAULT 0,
  oy_11 DECIMAL DEFAULT 0,
  oy_12 DECIMAL DEFAULT 0,
  year INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS kursatilgan_hizmatlar_jur152 (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    doc_num VARCHAR(255),
    doc_date DATE,
    summa DECIMAL,
    opisanie VARCHAR(500),
    id_spravochnik_organization INT NOT NULL REFERENCES spravochnik_organization(id),
    shartnomalar_organization_id INT REFERENCES shartnomalar_organization(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS kursatilgan_hizmatlar_jur152_child (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    spravochnik_operatsii_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    spravochnik_operatsii_own_id INT NOT NULL REFERENCES spravochnik_operatsii(id),
    summa DECIMAL,
    id_spravochnik_podrazdelenie INT REFERENCES spravochnik_podrazdelenie(id),
    id_spravochnik_sostav INT REFERENCES spravochnik_sostav(id),
    id_spravochnik_type_operatsii INT REFERENCES spravochnik_type_operatsii(id),
    kursatilgan_hizmatlar_jur152_id INT NOT NULL REFERENCES kursatilgan_hizmatlar_jur152(id),
    main_schet_id INT NOT NULL REFERENCES main_schet(id),
    kol DECIMAL,
    sena DECIMAL,
    nds_foiz DECIMAL,
    nds_summa DECIMAL,
    summa_s_nds DECIMAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS smeta (
    id SERIAL PRIMARY KEY,
    father_smeta_name VARCHAR(255),
    group_number VARCHAR,
    smeta_name VARCHAR(255),
    smeta_number VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS smeta_grafik (
  id SERIAL PRIMARY KEY,
  smeta_id INTEGER REFERENCES smeta(id),
  spravochnik_budjet_name_id INTEGER REFERENCES spravochnik_budjet_name(id),
  user_id INTEGER REFERENCES users(id),
  itogo DECIMAL DEFAULT 0,
  oy_1 DECIMAL DEFAULT 0,
  oy_2 DECIMAL DEFAULT 0,
  oy_3 DECIMAL DEFAULT 0,
  oy_4 DECIMAL DEFAULT 0,
  oy_5 DECIMAL DEFAULT 0,
  oy_6 DECIMAL DEFAULT 0,
  oy_7 DECIMAL DEFAULT 0,
  oy_8 DECIMAL DEFAULT 0,
  oy_9 DECIMAL DEFAULT 0,
  oy_10 DECIMAL DEFAULT 0,
  oy_11 DECIMAL DEFAULT 0,
  oy_12 DECIMAL DEFAULT 0,
  year INT,
  itogo DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_podotchet_litso (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_podrazdelenie (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_sostav (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_type_operatsii (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  rayon VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_organization (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  okonx VARCHAR(200),
  bank_klient VARCHAR(200),
  raschet_schet_gazna VARCHAR(200),
  mfo VARCHAR(200),
  inn VARCHAR(40),
  raschet_schet VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  parent_id INTEGER REFERENCES spravochnik_organization(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_operatsii (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  schet VARCHAR(200),
  sub_schet VARCHAR(200),
  type_schet VARCHAR(200),
  smeta_id INTEGER REFERENCES smeta(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_budjet_name (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS main_schet (
    id SERIAL PRIMARY KEY,
    spravochnik_budjet_name_id INTEGER REFERENCES spravochnik_budjet_name(id),
    tashkilot_nomi VARCHAR(255),
    tashkilot_bank VARCHAR(255),
    tashkilot_mfo VARCHAR(50),
    tashkilot_inn VARCHAR(20),
    account_number VARCHAR(20),
    account_name VARCHAR(255),
    jur1_schet VARCHAR(255),
    jur1_subschet VARCHAR(255),
    jur2_schet VARCHAR(255),
    jur2_subschet VARCHAR(255),
    jur3_schet VARCHAR(255),
    jur3_subschet VARCHAR(255),
    jur4_schet VARCHAR(255),
    jur4_subschet VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_podpis_dlya_doc (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type_document VARCHAR(255), 
    numeric_poryadok INT,  
    doljnost_name VARCHAR(255), 
    fio_name VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS schet_operatsii (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  schet VARCHAR(200),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_bank_mfo (
  id SERIAL PRIMARY KEY,
  mfo VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spravochnik_main_book_schet (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR,
  schet VARCHAR,
  created_at timestamp, 
  updated_at timestamp,
  isdeleted BOOLEAN DEFAULT FALSE
);