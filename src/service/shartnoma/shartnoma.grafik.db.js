const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createShartnomaGrafik = handleServiceError(async (user_id, shartnoma_id) => {
  const result = await pool.query(
    `
      INSERT INTO shartnoma_grafik(id_shartnomalar_organization, user_id) VALUES($1, $2) 
    `,
    [shartnoma_id, user_id],
  );
});

module.exports = {
  createShartnomaGrafik,
};
