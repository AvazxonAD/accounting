const { db } = require("@db/index");
const { REGIONS } = require(`@helper/constants`);

exports.DbCreate = class {
  static async regionCreate() {
    const regions = await db.query(`SELECT * FROM _regions`);

    if (regions.length === 0) {
      await db.transaction(async (client) => {
        for (let region of REGIONS) {
          const region_db = await client.query(`INSERT INTO _regions(name, created_at, updated_at) VALUES($1, now(), now()) RETURNING id`, [
            region.title,
          ]);

          const region_id = region_db.rows[0].id;
          for (let district of region.districts) {
            await client.query(`INSERT INTO districts(name, region_id, created_at, updated_at) VALUES($1, $2, now(), now())`, [
              district.title.latin,
              region_id,
            ]);
          }
        }
      });
    }
  }
};
