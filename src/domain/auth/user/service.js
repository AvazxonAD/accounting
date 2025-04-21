const { RoleDB } = require("@role/db");
const { tashkentTime } = require("@helper/functions");
const { UserDB } = require("./db");
const { AuthDB } = require("../auth/db");
const bcrypt = require("bcryptjs");

exports.UserService = class {
  static async createUser(req, res) {
    const region_id = req.user.region_id;
    const { login, password, fio, role_id } = req.body;
    const role = await RoleDB.getByIdRole([role_id]);
    if (!role || role.name === "super-admin" || role.name === "region-admin") {
      return res.error(req.i18n.t("roleNotFound"), 404);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existLogin = await AuthDB.getByLoginAuth([login]);
    if (existLogin) {
      return res.error(req.i18n.t("loginExists"), 400);
    }
    const result = await UserDB.createUser([
      login,
      hashedPassword,
      fio,
      role_id,
      region_id,
      tashkentTime(),
      tashkentTime(),
    ]);
    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async getUser(req, res) {
    const data = await UserDB.getUser([req.user.region_id]);
    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async getByIdUser(req, res) {
    const id = req.params.id;
    const data = await UserDB.getByIdUser([id], true);
    if (!data) {
      return res.error(req.i18n.t("userNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async updateUser(req, res) {
    const { login, password, fio, role_id } = req.body;
    const id = req.params.id;
    const user = await UserDB.getByIdUser([id]);
    if (!user) {
      return res.error(req.i18n.t("userNotFound"), 404);
    }
    const role = await RoleDB.getByIdRole([role_id]);
    if (!role || role.name === "super-admin" || role.name === "region-admin") {
      return res.error(req.i18n.t("roleNotFound"), 404);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (login !== user.login) {
      const existLogin = await AuthDB.getByLoginAuth([login]);
      if (existLogin) {
        return res.error(req.i18n.t("loginExists"), 400);
      }
    }

    const data = await UserDB.updateUser([
      login,
      hashedPassword,
      fio,
      role_id,
      tashkentTime(),
      id,
    ]);
    return res.success(req.i18n.t("updateSuccess"), 200, null, data);
  }

  static async deleteUser(req, res) {
    const id = req.params.id;
    const data = await UserDB.getByIdUser([id]);
    if (!data) {
      return res.error(req.i18n.t("userNotFound"), 404);
    }

    await UserDB.deleteUser([id]);
    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
