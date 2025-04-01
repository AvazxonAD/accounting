const { RegionDB } = require("./db");
const { RoleDB } = require("@role/db");
const { tashkentTime } = require("@helper/functions");
const { AccessDB } = require("@access/db");
const { db } = require("@db/index");
const { logRequest } = require("@helper/log");

exports.Controller = class {
  static async createRegion(req, res) {
    const { name } = req.body;
    const existRegion = await RegionDB.getByNameRegion([name]);

    if (existRegion) {
      return res.status(409).json({
        message: "This data already exists",
      });
    }

    let result = null;
    await db.transaction(async (client) => {
      result = await RegionDB.createRegion(
        [name, tashkentTime(), tashkentTime()],
        client
      );

      const { data: roles } = await RoleDB.getRole([0, 999999], null, client);

      const params = roles.reduce((acc, obj) => {
        return acc.concat(obj.id, result.id, tashkentTime(), tashkentTime());
      }, []);

      await AccessDB.createAccess(params, client);
    });

    logRequest("post", { type: "region", id: result.id, user_id: req.user.id });

    return res.status(201).json({
      message: "region created sucessfully",
      data: result,
    });
  }

  static async getRegion(req, res) {
    const { page, limit, search } = req.query;

    const offset = (page - 1) * limit;

    const { data, total } = await RegionDB.getRegion([offset, limit], search);

    const ids = data.map((item) => item.id);
    logRequest("get", { type: "region", id: ids, user_id: req.user.id });

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const id = req.params.id;
    const data = await RegionDB.getById([id], true);
    if (!data) {
      return res.status(404).json({
        message: "region not found",
      });
    }
    logRequest("get", { type: "region", id: data.id, user_id: req.user.id });
    return res.status(200).json({
      message: "region get successfully",
      data,
    });
  }

  static async updateRegion(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    const old_data = await RegionDB.getById([id]);
    if (!old_data) {
      return res.status(404).json({
        message: "region not found!",
      });
    }
    if (old_data.name !== name) {
      const existRegion = await RegionDB.getByNameRegion([name]);
      if (existRegion) {
        return res.status(409).json({
          message: "This data already exists",
        });
      }
    }
    const data = await RegionDB.updateRegion([name, tashkentTime(), id]);
    logRequest("put", { type: "region", id: data.id, user_id: req.user.id });
    return res.status(200).json({
      message: "update region successfully",
      data,
    });
  }

  static async deleteRegion(req, res) {
    const id = req.params.id;
    const data = await RegionDB.getById([id]);
    if (!data) {
      return res.status(404).json({
        message: "region not found!",
      });
    }
    await db.transaction(async (client) => {
      await RegionDB.deleteRegion([id], client);
      await AccessDB.deleteAccess([id], client);
    });
    logRequest("delete", { type: "region", id: data.id, user_id: req.user.id });
    return res.status(200).json({
      message: "delete region successfully",
    });
  }
};
