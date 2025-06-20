update
    group_jur7
set
    provodka_kredit = '0'
where
    provodka_kredit = 'undefined'
    or provodka_kredit is null;

update
    saldo_naimenovanie_jur7
set
    kredit_schet = '0'
where
    kredit_schet is null;