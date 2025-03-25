const { PodrazdelenieDB } = require("./db");
const { tashkentTime } = require("@helper/functions");

exports.Controller = class {
  static async importData(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const filePath = req.file.path;
    const { budjet_id, main_schet_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const data = await PrixodJur7Service.readFile({ filePath });

    const { error, value } = PrixodJur7Schema.import(req.i18n).validate(data);
    if (error) {
      return res.error(error.details[0].message, 400);
    }

    const result_data = PrixodJur7Service.groupData(value);

    for (let doc of result_data) {
      const organization = await OrganizationService.getById({
        region_id,
        id: doc.kimdan_id,
      });
      if (!organization) {
        return res.error(req.i18n.t("organizationNotFound"), 404);
      }

      const responsible = await ResponsibleService.getById({
        region_id,
        id: doc.kimga_id,
      });
      if (!responsible) {
        return res.error(req.i18n.t("responsibleNotFound"), 404);
      }

      for (let child of doc.childs) {
        const group = await GroupService.getById({ id: child.group_jur7_id });
        if (!group) {
          return res.error(req.i18n.t("groupNotFound"), 404);
        }

        // if (!child.iznos && child.eski_iznos_summa > 0) {
        //     return res.error(`${req.i18n.t('iznosSummaError')}`, 400);
        // }

        child.iznos_foiz = group.iznos_foiz;
      }
    }

    await PrixodJur7Service.importData({
      data: result_data,
      user_id,
      budjet_id,
      main_schet_id,
      region_id,
    });

    return res.success(req.i18n.t("createSuccess"), 201);
  }

  static async createPodrazdelenie(req, res) {
    const user_id = req.user.id;
    const { name } = req.body;
    const region_id = req.user.region_id;
    const check = await PodrazdelenieDB.getByNamePodrazdelenie([
      region_id,
      name,
    ]);
    if (check) {
      return res.status(409).json({
        message: "this data already exists",
      });
    }
    const result = await PodrazdelenieDB.createPodrazdelenie([
      user_id,
      name,
      tashkentTime(),
      tashkentTime(),
    ]);
    return res.status(201).json({
      message: "Create podrazdelenie successfully",
      data: result,
    });
  }

  static async getPodrazdelenie(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search } = req.query;
    const offset = (page - 1) * limit;
    const { data, total } = await PodrazdelenieDB.getPodrazdelenie(
      [region_id, offset, limit],
      search
    );
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };
    return res.status(200).json({
      message: "podrazdelenie successfully get",
      meta,
      data: data || [],
    });
  }

  static async getByIdPodrazdelenie(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const data = await PodrazdelenieDB.getByIdPodrazdelenie(
      [region_id, id],
      true
    );
    if (!data) {
      return res.status(404).json({
        message: "podrazdelenie not found",
      });
    }
    return res.status(201).json({
      message: "podrazdelenie successfully get",
      data,
    });
  }

  static async updatePodrazdelenie(req, res) {
    const region_id = req.user.region_id;
    const { name } = req.body;
    const id = req.params.id;
    const old_podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([
      region_id,
      id,
    ]);
    if (!old_podrazdelenie) {
      return res.status(404).json({
        message: "podrazdelenie not found",
      });
    }
    const result = await PodrazdelenieDB.updatePodrazdelenie([
      name,
      tashkentTime(),
      id,
    ]);
    return res.status(200).json({
      message: "Update successful",
      data: result,
    });
  }

  static async deletePodrazdelenie(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([
      region_id,
      id,
    ]);
    if (!podrazdelenie) {
      return res.status(404).json({
        message: "podrazdelenie not found",
      });
    }
    await PodrazdelenieDB.deletePodrazdelenie([id]);
    return res.status(200).json({
      message: "delete podrazdelenie successfully",
    });
  }
};
