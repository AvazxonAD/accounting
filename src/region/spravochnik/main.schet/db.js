const { db } = require('@db/index')
exports.MainSchetDB = class {
    static async getByIdMainSchet(params, isdeleted = null) {
        const ignore = `AND m_s.isdeleted = false`
        const query = `--sql
            SELECT 
                m_s.id, 
                m_s.account_number, 
                m_s.spravochnik_budjet_name_id, 
                m_s.tashkilot_nomi, 
                m_s.tashkilot_bank, 
                m_s.tashkilot_mfo, 
                m_s.tashkilot_inn, 
                m_s.account_name, 
                m_s.jur1_schet, 
                m_s.jur1_subschet,
                m_s.jur2_schet, 
                m_s.jur2_subschet,
                m_s.jur3_schet,
                m_s.jur3_subschet, 
                m_s.jur4_schet,
                m_s.jur4_subschet, 
                s_b_n.name AS budjet_name
            FROM main_schet m_s
            JOIN users AS u ON m_s.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = m_s.spravochnik_budjet_name_id
            WHERE r.id = $1
                AND m_s.id = $2 ${isdeleted ? '' : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }
}