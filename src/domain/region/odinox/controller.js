const { BudjetService } = require("@budjet/service");
const { OdinoxService } = require("./service");
const { HelperFunctions } = require(`@helper/functions`);
const { ReportTitleService } = require(`@report_title/service`);
const { ValidatorFunctions } = require(`@helper/database.validator`);

exports.Controller = class {
  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;
    const { year, month, childs } = req.body;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const check = await OdinoxService.getByMonth({
      region_id,
      main_schet_id,
      year,
      month,
    });

    if (check) {
      return res.error(req.i18n.t("docExists"), 409, { year, month });
    }

    const check_create = await OdinoxService.checkCreateCount({
      region_id,
      main_schet_id,
    });

    if (check_create.length > 0) {
      const last_date = HelperFunctions.lastDate({ year, month });
      const check = await OdinoxService.getByMonth({
        region_id,
        main_schet_id,
        year: last_date.year,
        month: last_date.month,
      });

      if (check) {
        return res.error(req.i18n.t("yearMonthCreateError"), 400);
      }
    }

    for (let child of childs) {
      const check = await OdinoxService.getByIdType({ id: child.type_id });
      if (!check) {
        return res.error(req.i18n.t("validationError"), 400);
      }
    }

    const result = await OdinoxService.create({
      main_schet_id,
      ...req.body,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async getSmeta(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await OdinoxService.getSmeta({
      ...req.query,
      region_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getOdinoxType(req, res) {
    const result = await OdinoxService.getOdinoxType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getData(req, res) {
    const { year, month, main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const types = await OdinoxService.getOdinoxType({});

    const date = HelperFunctions.getMonthStartEnd({ year, month });

    const last_date = HelperFunctions.lastDate({ year, month });

    const last_doc = await OdinoxService.getByMonth({
      region_id,
      year: last_date.year,
      month: last_date.month,
      main_schet_id,
    });

    const smetas = await OdinoxService.getSmeta({ ...req.query, region_id });

    for (let type of types) {
      if (type.sort_order === 0) {
        type.sub_childs = OdinoxService.getJur0Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
        });
      }

      if (type.sort_order === 1) {
        type.sub_childs = await OdinoxService.getJur1Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
        });
      }

      if (type.sort_order === 2) {
        type.sub_childs = await OdinoxService.getJur2Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
        });
      }

      if (type.sort_order === 3) {
        type.sub_childs = await OdinoxService.getJur3Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
        });
      }

      if (type.sort_order === 4) {
        type.sub_childs = await OdinoxService.getJur4Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          grafik: types.find((item) => item.sort_order === 0),
          jur3a_akt_avans: types.find((item) => item.sort_order === 3),
        });
      }

      if (type.sort_order === 5) {
        type.sub_childs = await OdinoxService.getCangculate({
          smetas: JSON.parse(JSON.stringify(smetas)),
          doc: types.find((item) => item.sort_order === 0),
          old: last_doc
            ? last_doc.childs.find((item) => item.sort_order === 0)
            : [],
        });
      }

      if (type.sort_order === 6) {
        type.sub_childs = await OdinoxService.getCangculate({
          smetas: JSON.parse(JSON.stringify(smetas)),
          doc: types.find((item) => item.sort_order === 1),
          old: last_doc
            ? last_doc.childs.find((item) => item.sort_order === 1)
            : [],
        });
      }

      if (type.sort_order === 7) {
        type.sub_childs = await OdinoxService.getCangculate({
          smetas: JSON.parse(JSON.stringify(smetas)),
          doc: types.find((item) => item.sort_order === 2),
          old: last_doc
            ? last_doc.childs.find((item) => item.sort_order === 2)
            : [],
        });
      }

      if (type.sort_order === 8) {
        type.sub_childs = await OdinoxService.getCangculate({
          smetas: JSON.parse(JSON.stringify(smetas)),
          doc: types.find((item) => item.sort_order === 3),
          old: last_doc
            ? last_doc.childs.find((item) => item.sort_order === 3)
            : [],
        });
      }

      if (type.sort_order === 9) {
        type.sub_childs = await OdinoxService.getCangculate({
          smetas: JSON.parse(JSON.stringify(smetas)),
          doc: types.find((item) => item.sort_order === 4),
          old: last_doc
            ? last_doc.childs.find((item) => item.sort_order === 4)
            : [],
        });
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, types);
  }
};
