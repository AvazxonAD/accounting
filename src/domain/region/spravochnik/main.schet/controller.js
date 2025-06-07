const { MainSchetService } = require("./service");
const { BudjetService } = require(`@budjet/service`);
const { HelperFunctions } = require(`@helper/functions`);

exports.Controller = class {
  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const {
      account_number,
      jur1_schet,
      jur2_schet,
      jur3_schets_159,
      jur3_schets_152,
      spravochnik_budjet_name_id,
      jur4_schets,
    } = req.body;

    const budjet = await BudjetService.getById({
      id: spravochnik_budjet_name_id,
    });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const checkAccount = await MainSchetService.getByAccount({
      account_number,
      region_id,
    });
    if (checkAccount) {
      return res.error(req.i18n.t("docExists"), 409);
    }

    const dup3_159 = HelperFunctions.findDuplicateByKey(jur3_schets_159, "schet");
    if (dup3_159) {
      return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
        schet: dup3_159,
      });
    }

    const dup3_152 = HelperFunctions.findDuplicateByKey(jur3_schets_152, "schet");
    if (dup3_152) {
      return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
        schet: dup3_152,
      });
    }

    const dup4 = HelperFunctions.findDuplicateByKey(jur4_schets, "schet");
    if (dup4) {
      return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
        schet: dup4,
      });
    }

    // for (let column_name of Object.keys({ jur1_schet, jur2_schet })) {
    //   const check = await MainSchetService.checkSchet({
    //     budjet_id: spravochnik_budjet_name_id,
    //     region_id,
    //     column: req.body[column_name],
    //     column_name,
    //   });

    //   if (check) {
    //     return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
    //       schet: check[column_name],
    //     });
    //   }
    // }

    const result = await MainSchetService.create({ ...req.body, user_id });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async get(req, res) {
    const { limit, page, search, budjet_id } = req.query;
    const region_id = req.user.region_id;

    const offset = (page - 1) * limit;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const { data, total_count } = await MainSchetService.get({
      region_id,
      offset,
      limit,
      budjet_id,
      search,
    });

    const pageCount = Math.ceil(total_count / limit);

    const meta = {
      pageCount: pageCount,
      count: total_count,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;

    const data = await MainSchetService.getById({
      id,
      region_id,
      isdeleted: true,
    });

    if (!data) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    return res.success(req.i18n.t(`getSuccess`), 200, null, data);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const id = req.params.id;
    const {
      account_number,
      jur1_schet,
      jur2_schet,
      jur3_schets_159,
      jur3_schets_152,
      spravochnik_budjet_name_id,
      jur4_schets,
    } = req.body;

    const old_data = await MainSchetService.getById({
      id,
      region_id,
      isdeleted: true,
    });

    if (!old_data) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    if (account_number !== old_data.account_number) {
      const checkAccount = await MainSchetService.getByAccount({
        account_number,
        region_id,
      });

      if (checkAccount) {
        return res.error(req.i18n.t("docExists"), 409);
      }
    }

    const dup3_159 = HelperFunctions.findDuplicateByKey(jur3_schets_159, "schet");
    if (dup3_159) {
      return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
        schet: dup3_159,
      });
    }

    const dup3_152 = HelperFunctions.findDuplicateByKey(jur3_schets_152, "schet");
    if (dup3_152) {
      return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
        schet: dup3_152,
      });
    }

    const dup4 = HelperFunctions.findDuplicateByKey(jur4_schets, "schet");
    if (dup4) {
      return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
        schet: dup4,
      });
    }

    // if (old_data.jur1_schet !== jur1_schet) {
    //   const check = await MainSchetService.checkSchet({
    //     budjet_id: spravochnik_budjet_name_id,
    //     region_id,
    //     column: jur1_schet,
    //     column_name: "jur1_schet",
    //   });

    //   if (check) {
    //     return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
    //       schet: check["jur1_schet"],
    //     });
    //   }
    // }

    // if (old_data.jur2_schet !== jur2_schet) {
    //   const check = await MainSchetService.checkSchet({
    //     budjet_id: spravochnik_budjet_name_id,
    //     region_id,
    //     column: jur2_schet,
    //     column_name: "jur2_schet",
    //   });

    //   if (check) {
    //     return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
    //       schet: check["jur1_schet"],
    //     });
    //   }
    // }

    for (let jur3 of jur3_schets_159) {
      if (jur3.id) {
        const check = old_data.jur3_schets_159.find((item) => item.id === jur3.id);
        if (!check) {
          return res.error(req.i18n.t("accountNumberSchetNotFound"), 404);
        }
      }
    }

    for (let jur3 of jur3_schets_152) {
      if (jur3.id) {
        const check = old_data.jur3_schets_152.find((item) => item.id === jur3.id);
        if (!check) {
          return res.error(req.i18n.t("accountNumberSchetNotFound"), 404);
        }
      }
    }

    for (let jur4 of jur4_schets) {
      if (jur4.id) {
        const check = old_data.jur4_schets.find((item) => item.id === jur4.id);
        if (!check) {
          return res.error(req.i18n.t("accountNumberSchetNotFound"), 404);
        }
      }
    }

    const result = await MainSchetService.update({
      ...req.body,
      region_id,
      old_data,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;

    const data = await MainSchetService.getById({
      id,
      region_id,
      isdeleted: true,
    });

    if (!data) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const result = await MainSchetService.delete({ id });

    return res.success(req.i18n.t(`deleteSuccess`), 200, null, result);
  }

  static async getByBudjet(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;

    const budjet = await BudjetService.getById({
      id: budjet_id,
    });

    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const result = await MainSchetService.getByBudjet({ region_id, budjet_id });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }
};
