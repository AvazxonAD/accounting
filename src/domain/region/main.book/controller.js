const { BudjetService } = require("@budjet/service");
const { MainBookService } = require("./service");
const { HelperFunctions } = require(`@helper/functions`);
const { ReportTitleService } = require(`@report_title/service`);

exports.Controller = class {
  static async delete(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;

    const data = await MainBookService.getById({
      region_id,
      id,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (data.status === 3) {
      return res.error(req.i18n.t("mainBookStatus"), 409);
    }

    await MainBookService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async getMainBookType(req, res) {
    const result = await MainBookService.getMainBookType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;
    const { year, month } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const check = await MainBookService.get({
      offset: 0,
      limit: 1,
      region_id,
      budjet_id,
      year,
      month,
    });

    if (check.total) {
      return res.error(req.i18n.t("docExists"), 409, { year, month });
    }

    const result = await MainBookService.create({
      budjet_id,
      ...req.body,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, year, budjet_id } = req.query;

    const offset = (page - 1) * limit;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const { data, total } = await MainBookService.get({
      region_id,
      offset,
      limit,
      budjet_id,
      year,
    });

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
    const region_id = req.user.region_id;
    const { excel, report_title_id } = req.query;
    const { id } = req.params;

    const data = await MainBookService.getById({
      region_id,
      id,
      isdeleted: true,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    for (let type of data.childs) {
      type.prixod = 0;
      type.rasxod = 0;

      for (let child of type.sub_childs) {
        type.prixod += child.prixod;
        type.rasxod += child.rasxod;
      }
    }

    if (excel === "true") {
      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const { file_path, file_name } = await MainBookService.getByIdExcel({
        ...data,
        report_title,
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file_name}"`
      );

      return res.sendFile(file_path);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async getData(req, res) {
    const { year, month, budjet_id } = req.query;
    const region_id = req.user.region_id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schets = await MainBookService.getMainSchets({
      region_id,
      budjet_id,
    });

    const types = await MainBookService.getMainBookType({});

    const schets = await MainBookService.getUniqueSchets({});
    const set_schets = new Set(schets.map((item) => item.schet));

    for (let main_schet of main_schets) {
      [
        main_schet.jur1_schet,
        main_schet.jur2_schet,
        main_schet.jur3_schet,
        main_schet.jur4_schet,
      ].forEach((schet) => {
        if (schet && !set_schets.has(schet)) {
          set_schets.add(schet);
          schets.push({ schet, prixod: 0, rasxod: 0 });
        }
      });
    }

    schets.sort((a, b) => {
      const numA = a.schet.split("/").map(Number);
      const numB = b.schet.split("/").map(Number);

      for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
        if ((numA[i] || 0) !== (numB[i] || 0)) {
          return (numA[i] || 0) - (numB[i] || 0);
        }
      }
      return 0;
    });

    const jur3AndJur4Schets = main_schets
      .map((item) => [item.jur3_schet, item.jur4_schet])
      .flat();

    const date = HelperFunctions.getMonthStartEnd({ year, month });

    const from = `${date[0].getFullYear()}-${String(date[0].getMonth() + 1).padStart(2, "0")}-${String(date[0].getDate()).padStart(2, "0")}`;
    const to = `${date[1].getFullYear()}-${String(date[1].getMonth() + 1).padStart(2, "0")}-${String(date[1].getDate()).padStart(2, "0")}`;

    for (let type of types) {
      // from
      if (type.id === 0) {
        type.prixod = 0;
        type.rasxod = 0;

        type.sub_childs = await MainBookService.getFromData({
          schets: JSON.parse(JSON.stringify(schets)),
          budjet_id,
          from,
          region_id,
          main_schets: main_schets,
          jur3AndJur4Schets,
          operator: "<",
        });

        for (let child of type.sub_childs) {
          type.prixod += child.prixod;
          type.rasxod += child.rasxod;
        }
      }

      // jurnal 1
      if (type.id === 1) {
        type.sub_childs = await MainBookService.getJur1Data({
          schets: JSON.parse(JSON.stringify(schets)),
          budjet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
        });
      }

      // jurnal 2
      if (type.id === 2) {
        type.sub_childs = await MainBookService.getJur2Data({
          schets: JSON.parse(JSON.stringify(schets)),
          budjet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
        });
      }

      // jurnal 3
      if (type.id === 3) {
        type.sub_childs = await MainBookService.getJur3Data({
          schets: JSON.parse(JSON.stringify(schets)),
          budjet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
        });
      }

      // jurnal 4
      if (type.id === 4) {
        type.sub_childs = await MainBookService.getJur4Data({
          schets: JSON.parse(JSON.stringify(schets)),
          budjet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
        });
      }

      // jurnal 5
      if (type.id === 5) {
        type.sub_childs = JSON.parse(JSON.stringify(schets));
      }

      // jurnal 7
      if (type.id === 7) {
        type.sub_childs = await MainBookService.getJur7Data({
          schets: JSON.parse(JSON.stringify(schets)),
          budjet_id,
          from,
          to,
          region_id,
        });
      }

      // jurnal 9
      if (type.id === 9) {
        type.sub_childs = JSON.parse(JSON.stringify(schets));
      }

      // jurnal 10
      if (type.id === 10) {
        type.sub_childs = await MainBookService.getToData({
          schets: JSON.parse(JSON.stringify(schets)),
          budjet_id,
          to,
          region_id,
          main_schets: main_schets,
          jur3AndJur4Schets,
          operator: "<=",
        });
      }
    }

    const index = types.findIndex((item) => item.id === 9);
    for (let type of types) {
      if (type.id !== 9 && type.id !== 0 && type.id !== 10) {
        for (let child of type.sub_childs) {
          const child_index = types[index].sub_childs.findIndex(
            (item) => item.schet === child.schet
          );

          types[index].sub_childs[child_index].prixod += child.prixod;
          types[index].sub_childs[child_index].rasxod += child.rasxod;
        }
      }

      type.prixod = 0;
      type.rasxod = 0;

      for (let child of type.sub_childs) {
        type.prixod += child.prixod;
        type.rasxod += child.rasxod;
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, types);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const user_id = req.user.id;
    const { month, year } = req.body;
    const { budjet_id } = req.query;

    const old_data = await MainBookService.getById({
      region_id,
      id,
    });

    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (old_data.status === 3) {
      return res.error(req.i18n.t("mainBookStatus"), 409);
    }

    if (old_data.month !== month || year !== old_data.year) {
      const check = await MainBookService.get({
        offset: 0,
        limit: 1,
        region_id,
        budjet_id,
        year,
        month,
      });

      if (check.total) {
        return res.error(req.i18n.t("docExists"), 409, { year, month });
      }
    }

    const result = await MainBookService.update({
      ...req.body,
      old_data,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }
};
