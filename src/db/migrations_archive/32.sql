UPDATE smeta
SET smeta_number = REGEXP_REPLACE(smeta_number, '\s+', '', 'g');