const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const create_user = handleServiceError(
  async (login, password, fio, role_id, region_id) => {
    const result = await pool.query(
      `INSERT INTO users(login, password, fio, role_id, region_id) 
        VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
      [login, password, fio, role_id, region_id],
    );
    return result.rows[0];
  },
);

const getByIdUser = handleServiceError(async (id) => {
  let result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
});

const update_user = handleServiceError(
  async (login, password, fio, role_id, region_id, id) => {
    const result = await pool.query(
      `UPDATE users SET login = $1, password = $2, fio = $3, role_id =$4, region_id = $5
        WHERE id = $6
        RETURNING *
    `,
      [login, password, fio, role_id, region_id, id],
    );
    return result.rows[0];
  },
);

const getAllRegionUsers = handleServiceError(async (region_id) => {
  const result = await pool.query(
    `SELECT 
            users.id, 
            users.role_id, 
            users.region_id, 
            users.fio,
            users.login,
            role.name AS role_name,
            regions.name AS region_name
            FROM users 
            JOIN role ON role.id = users.role_id
            JOIN regions ON regions.id = users.region_id
            WHERE region_id = $1 AND users.isdeleted = false
    `,
    [region_id],
  );
  return result.rows;
});

module.exports = {
  create_user,
  getAllRegionUsers,
  getByIdUser,
  update_user,
};
