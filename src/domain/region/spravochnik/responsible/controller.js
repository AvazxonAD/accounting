const { PodrazdelenieDB } = require("../jur7.podrazdelenie/db");
const { ResponsibleDB } = require("./db");
const { tashkentTime } = require("@helper/functions");
const { ResponsibleService } = require("./service");
const { ResponsibleSchema } = require("./schema");
const { ValidatorFunctions } = require("@helper/database.validator");

exports.Controller = class {
  static async import(req, res) {
    const user_id = req.user.id;

    if (!req.file) {
      return res.error(req.i18n.t("fileError"), 400);
    }

    const filePath = req.file.path;
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;

    await ValidatorFunctions.budjet({ budjet_id });
    const data = await ResponsibleService.readFile({ filePath });

    const { error, value } = ResponsibleSchema.importData(req.i18n).validate(data);
    if (error) {
      return res.error(error.details[0].message, 400);
    }

    for (let doc of value) {
      const responsible = await ResponsibleService.getByFio({ region_id, fio: doc.fio });
      if (responsible) {
        return res.error(req.i18n.t(`responsibleExists`, { data: doc.fio }), 404);
      }
    }

    await ResponsibleService.import({ responsibles: value, user_id, budjet_id });

    return res.success(req.i18n.t("createSuccess"), 201);
  }

  static async template(req, res) {
    const { fileName, fileRes } = await ResponsibleService.templateFile();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.send(fileRes);
  }

  static async createResponsible(req, res) {
    const { id: user_id, region_id } = req.user;
    const { spravochnik_podrazdelenie_jur7_id, fio } = req.body;
    const { budjet_id } = req.query;

    await ValidatorFunctions.budjet({ budjet_id });

    const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, spravochnik_podrazdelenie_jur7_id]);
    if (!podrazdelenie) {
      return res.error(req.i18n.t("podrazdelenieNotFound"), 404);
    }

    const result = await ResponsibleDB.createResponsible([
      spravochnik_podrazdelenie_jur7_id,
      fio,
      user_id,
      budjet_id,
      tashkentTime(),
      tashkentTime(),
    ]);

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, podraz_id, excel, budjet_id } = req.query;
    const offset = (page - 1) * limit;

    await ValidatorFunctions.budjet({ budjet_id });

    if (podraz_id) {
      const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, podraz_id]);
      if (!podrazdelenie) {
        return res.error(req.i18n.t("podrazdelenieNotFound"), 404);
      }
    }

    const { data, total } = await ResponsibleDB.get([budjet_id, offset, limit], region_id, search, podraz_id);

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    if (excel === "true") {
      const { fileName, filePath } = await ResponsibleService.export(data);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { budjet_id } = req.query;

    await ValidatorFunctions.budjet({ budjet_id });

    const data = await ResponsibleDB.getById([id, budjet_id], region_id, true);
    if (!data) {
      return res.error(req.i18n.t("responsibleNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async updateResponsible(req, res) {
    const region_id = req.user.region_id;
    const { spravochnik_podrazdelenie_jur7_id, fio } = req.body;
    const id = req.params.id;
    const { budjet_id } = req.query;

    await ValidatorFunctions.budjet({ budjet_id });

    const responsible = await ResponsibleDB.getById([id, budjet_id], region_id);
    if (!responsible) {
      return res.error(req.i18n.t("responsibleNotFound"), 404);
    }

    const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, spravochnik_podrazdelenie_jur7_id]);
    if (!podrazdelenie) {
      return res.error(req.i18n.t("podrazdelenieNotFound"), 404);
    }

    const result = await ResponsibleDB.updateResponsible([fio, tashkentTime(), spravochnik_podrazdelenie_jur7_id, id]);

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async deleteResponsible(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { budjet_id } = req.query;

    await ValidatorFunctions.budjet({ budjet_id });

    const responsible = await ResponsibleDB.getById([id, budjet_id], region_id);
    if (!responsible) {
      return res.error(req.i18n.t("responsibleNotFound"), 404);
    }

    await ResponsibleDB.deleteResponsible([id]);

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
