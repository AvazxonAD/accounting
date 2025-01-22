exports.FeaturesService = class {
    static getTableName(data) {
        if(data.tableName === 'bank_rasxod') return 'bank_rasxod';
        else if(data.tableName === 'bank_prixod') return 'bank_prixod';
        else if(data.tableName === 'kassa_rasxod') return 'kassa_rasxod';
        else if(data.tableName === 'kassa_prixod') return 'kassa_prixod';
        else if(data.tableName === 'avans') return 'avans_otchetlar_jur4';
        else if(data.tableName === 'akt') return 'bajarilgan_ishlar_jur3';
        else if(data.tableName === 'jur7_prixod') return 'document_prixod_jur7';
        else if(data.tableName === 'jur7_rasxod') return 'document_rasxod_jur7';
        else if(data.tableName === 'jur7_internal') return 'document_vnutr_peremesh_jur7';
        else if(data.tableName === 'show_service') return 'kursatilgan_hizmatlar_jur152';
        else if(data.tableName === 'contract') return 'shartnomalar_organization';
        else return null;
    }

    
}