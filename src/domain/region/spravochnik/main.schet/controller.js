const { JURNAL_SCHETS } = require(`@helper/constants`);
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
      jur3_schets,
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

    const dup3 = HelperFunctions.findDuplicateByKey(jur3_schets, "schet");
    if (dup3) {
      return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
        schet: dup3,
      });
    }

    const dup4 = HelperFunctions.findDuplicateByKey(jur4_schets, "schet");
    if (dup4) {
      return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
        schet: dup4,
      });
    }

    for (let column_name of Object.keys({ jur1_schet, jur2_schet })) {
      const check = await MainSchetService.checkSchet({
        budjet_id: spravochnik_budjet_name_id,
        region_id,
        column: req.body[column_name],
        column_name,
      });

      if (check) {
        return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
          schet: check[column_name],
        });
      }
    }

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
      return req.i18n.t(req.i18n.t("mainSchetNotFound"), 404);
    }

    return res.success(req.i18n.t(req.i18n.t(`getSuccess`), 200, null, data));
  }
};

const {
  createMainSchetService,
  getByIdMainSchetService,
  getAllMainSchetService,
  updateMainSchetService,
  deleteMainSchetService,
  checkMainSchetService,
  getByBudjetIdMainSchetService,
} = require("./main.schet.service");
const { getByIdBudjetService } = require("@budjet/budjet.name.service");
const {
  mainSchetValidator,
  queryMainSchetValidation,
} = require("@helper/validation");
const { resFunc } = require("@helper/functions");
const { validationResponse } = require("@helper/functions");
const { errorCatch } = require("@helper/functions");
const { date } = require("joi");

exports.update = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;

    const old_data = await getByIdMainSchetService(region_id, id);

    const data = validationResponse(mainSchetValidator, req.body);

    for (let column_name of JURNAL_SCHETS) {
      if (old_data[column_name] !== data[column_name]) {
        const check = await MainSchetService.checkSchet({
          budjet_id: data.spravochnik_budjet_name_id,
          region_id,
          column: data[column_name],
          column_name,
        });

        if (check) {
          return res.error(req.i18n.t("accountNumberSchetExists"), 400, {
            schet: check[column_name],
          });
        }
      }
    }

    // if (data.account_number !== old_data.account_number) {
    //   await getByAccountNumberMainSchetService(region_id, data.account_number);
    // }

    await getByIdBudjetService(data.spravochnik_budjet_name_id);

    const result = await updateMainSchetService({ ...data, id });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  } catch (error) {
    errorCatch(error, res);
  }
};

exports.deleteValue = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdMainSchetService(region_id, id);
    await checkMainSchetService(id);
    await deleteMainSchetService(id);

    return res.success(req.i18n.t("deleteSuccess"), 200);
  } catch (error) {
    errorCatch(error, res);
  }
};

exports.getElementById = async (req, res) => {
  try {
    const data = await getByIdMainSchetService(
      req.user.region_id,
      req.params.id,
      true
    );

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  } catch (error) {
    errorCatch(error, res);
  }
};

exports.getByBudjetIdMainSchet = async (req, res) => {
  try {
    const region_id = req.query.region_id;
    const budjet_id = req.query.budjet_id;
    const result = await getByBudjetIdMainSchetService(budjet_id, region_id);

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  } catch (error) {
    errorCatch(error, res);
  }
};
