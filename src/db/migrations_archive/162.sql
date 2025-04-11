ALTER TABLE
    jur8_monitoring_child
ALTER COLUMN
    doc_date TYPE DATE USING TO_DATE(doc_date, 'YYYY-MM-DD');