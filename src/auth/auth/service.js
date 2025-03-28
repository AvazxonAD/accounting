const { tashkentTime, generateToken } = require("@helper/functions");
const { AuthDB } = require("./db");
const bcrypt = require("bcryptjs");
const { AccessDB } = require("@access/db");

exports.AuthService = class {
  static async loginAuth(req, res) {
    const { login, password } = req.body;
    const user = await AuthDB.getByLoginAuth([login]);
    if (!user) {
      return res.error(req.i18n.t("authError"), 403);
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.error(req.i18n.t("authError"), 403);
    }

    let region_id;
    const result = await AuthDB.getByIdAuth([user.id]);

    if (
      result.role_name === "region-admin" ||
      result.role_name === "super-admin"
    ) {
      region_id = null;
    } else {
      region_id = result.region_id;
    }

    result.access_object = await AccessDB.getByRoleIdAccess(
      [result.role_id],
      region_id
    );

    delete result.password;
    const token = generateToken(result);

    return res.success(req.i18n.t("login"), 200, null, { result, token });
  }

  static async updateAuth(req, res) {
    const { login, fio, newPassword, oldPassword } = req.body;
    const id = req.user.id;
    const user = await AuthDB.getByIdAuth([id]);
    if (oldPassword || newPassword) {
      const matchPassword = await bcrypt.compare(oldPassword, user.password);
      if (!matchPassword) {
        return res.status(403).json({
          message: "The old password was entered incorrectly",
        });
      }
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newHashedPassword;
    }
    if (fio) {
      user.fio = fio;
    }
    if (login) {
      if (login !== user.login) {
        const test = await AuthDB.getByLoginAuth([login]);
        if (test) {
          return res.status(409).json({
            message: "This login is already in use",
          });
        }
        user.login = login;
      }
    }
    const result = await AuthDB.updateAuth([
      user.login,
      user.password,
      user.fio,
      tashkentTime(),
      id,
    ]);
    return res.status(200).json({
      message: "update auth successfully",
      data: result,
    });
  }
};
