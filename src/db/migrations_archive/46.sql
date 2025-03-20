UPDATE group_jur7 set provodka_kredit = null WHERE isdeleted = false AND provodka_kredit = 'undefined';
UPDATE group_jur7 set provodka_debet = null WHERE isdeleted = false AND provodka_debet = 'undefined';
UPDATE group_jur7 set provodka_subschet = null WHERE isdeleted = false AND provodka_subschet = 'undefined';
