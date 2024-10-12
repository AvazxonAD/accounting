const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to, podotchet_id) => {
  try {
    const data = await pool.query(
      `
        
        
      `,[region_id, main_schet_id, offset, limit, from, to, podotchet_id],
    ); 
    return {
      data: data.rows[0]?.data || [],
      total: data.rows[0].total_count,
      prixod_sum: data.rows[0].prixod_sum,
      rasxod_sum: data.rows[0].rasxod_sum,
      summaFrom: data.rows[0].summa_from,
      summaTo: data.rows[0].summa_to,
    };
  } catch (error) {
    throw new  ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getAllMonitoring,
};
