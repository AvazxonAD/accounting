const { FeaturesDB } = require('./db');

exports.FeaturesService = class {
    static getTableName(data) {
        if (data.page === 'bank_rasxod') return 'bank_rasxod';
        else if (data.page === 'bank_prixod') return 'bank_prixod';
        else if (data.page === 'kassa_rasxod') return 'kassa_rasxod';
        else if (data.page === 'kassa_prixod') return 'kassa_prixod';
        else if (data.page === 'avans') return 'avans_otchetlar_jur4';
        else if (data.page === 'akt') return 'bajarilgan_ishlar_jur3';
        else if (data.page === 'jur7_prixod') return 'document_prixod_jur7';
        else if (data.page === 'jur7_rasxod') return 'document_rasxod_jur7';
        else if (data.page === 'jur7_internal') return 'document_vnutr_peremesh_jur7';
        else if (data.page === 'show_service') return 'kursatilgan_hizmatlar_jur152';
        else return null;
    }

    static async getDocNum(data) {
        const result = await FeaturesDB.getDocNum(data.tableName, [data.region_id, data.main_schet_id]);
        result.doc_num = Number(result.doc_num) + 1;
        return result;
    }
}