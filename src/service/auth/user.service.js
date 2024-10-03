const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const create_user = handleServiceError(async (login, password, fio, role_id, region_id) => {
    const user = await pool.query(
      `INSERT INTO users(login, password, fio, role_id, region_id, created_at) 
        VALUES($1, $2, $3, $4, $5, $6) RETURNING * 
    `,
      [login, password, fio, role_id, region_id, new Date()],
    );
    return user.rows[0]
});

const getByIdUser = handleServiceError(async (id) => {
  let result = await pool.query(`
            SELECT 
              users.id, 
          users.fio, 
          users.login, 
          users.region_id, 
          users.role_id, 
          role.name AS role_name,
          access.kassa AS access_kassa,
          access.bank AS access_bank,
          access.spravochnik AS access_spravochnik,
          access.organization AS access_organization,
          access.region_users AS access_region_users,
          access.smeta AS access_smeta,
          access.region AS access_region,
          access.role AS access_role, 
          access.users AS access_users,
          access.shartnoma AS access_shartnoma,
          access.jur3 AS access_jur3,
          access.jur4 AS access_jur4
        FROM users 
        INNER JOIN role ON role.id = users.role_id
        INNER JOIN access ON access.role_id = role.id 
        WHERE users.id = $1`, [id]);
  return result.rows[0];
});

const update_user = handleServiceError(
  async (login, password, fio, role_id, id) => {
    await pool.query(
      `UPDATE users SET login = $1, password = $2, fio = $3, role_id  = $4, updated_at = $5
        WHERE id = $6
    `,
      [login, password, fio, role_id, new Date(), id],
    );
  },
);

const getAllRegionUsersDB = handleServiceError(async (region_id) => {
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

const getAllUsersForSuperAdminDB = handleServiceError(async (role_id) => {
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
            WHERE users.isdeleted = false AND role_id = $1
    `, [role_id],
  );
  return result.rows;
});

const deleteUserDb = handleServiceError(async (id) => {
  await pool.query(`UPDATE users SET isdeleted = $1 WHERE id = $2`, [true, id]);
});

module.exports = {
  create_user,
  getAllRegionUsersDB,
  getByIdUser,
  update_user,
  deleteUserDb,
  getAllUsersForSuperAdminDB,
};
