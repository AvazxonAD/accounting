const { checkSchetsEquality, HelperFunctions } = require("@helper/functions");
const { PodrazdelenieService } = require("@podraz/service");
const { MainSchetService } = require("@main_schet/service");
const { WorkerTripService } = require("./service");
const { PodotchetService } = require("@podotchet/service");
const { OperatsiiService } = require("@operatsii/service");
const { SostavService } = require("@sostav/service");
const { TypeOperatsiiService } = require("@type_operatsii/service");
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);
const { MinimumWageService } = require("@minimum_wage/service");
const { DistancesService } = require("@distances/service");

exports.Controller = class {
  static async create(req, res) {
    const { worker_id, from_district_id, to_district_id, childs, from_date, to_date, hostel_summa, doc_date } = req.body;
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find((item) => item.id === Number(schet_id));
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const worker = await PodotchetService.getById({
      id: worker_id,
      region_id,
    });
    if (!worker) {
      return res.error(req.i18n.t("podotchetNotFound"), 404);
    }

    const distance = await DistancesService.getByDistrictId({
      from_district_id,
      to_district_id,
    });
    if (!distance) {
      return res.error(req.i18n.t("distancesNotFound"), 404);
    }

    const minimum_wage = await MinimumWageService.get();

    const operatsiis = [];

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date });

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    for (let child of childs) {
      const schet = await OperatsiiService.getById({
        id: child.schet_id,
        type: "work_trip",
      });
      if (!schet) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }
      operatsiis.push(schet);
    }

    if (!checkSchetsEquality(operatsiis)) {
      return res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const road_summa = HelperFunctions.roadSumma({ ...req.body, distance, minimum_wage });

    if (new Date(from_date) >= new Date(to_date)) {
      return res.error(req.i18n.t("fromDateError"), 400);
    }

    const day_data = HelperFunctions.daySumma({ ...req.body, minimum_wage });

    const summa = road_summa + day_data.summa + hostel_summa;

    const chils_sum = HelperFunctions.childsSumma(childs);

    console.log(road_summa, req.body.road_summa);
    if (summa !== req.body.summa || summa !== chils_sum) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const result = await WorkerTripService.create({
      ...req.body,
      ...req.query,
      user_id,
      region_id,
      summa,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, from, to, main_schet_id, schet_id, search, order_by, order_type } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find((item) => item.id === Number(schet_id));
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: from,
    });

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const offset = (page - 1) * limit;
    const { summa, total_count, data, page_summa } = await WorkerTripService.get({
      ...req.query,
      region_id,
      main_schet_id,
      from,
      to,
      offset,
      limit,
      search,
      order_by,
      order_type,
    });

    const pageCount = Math.ceil(total_count / limit);
    const meta = {
      pageCount: pageCount,
      count: total_count,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
      page_summa,
    };
    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const { main_schet_id, schet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find((item) => item.id === Number(schet_id));
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const result = await WorkerTripService.getById({
      region_id,
      main_schet_id,
      schet_id,
      id,
      isdeleted: true,
    });
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async update(req, res) {
    const id = req.params.id;
    const { worker_id, from_district_id, to_district_id, childs, hostel_summa, doc_date, from_date, to_date } = req.body;
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find((item) => item.id === Number(schet_id));
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const old_data = await WorkerTripService.getById({
      region_id,
      main_schet_id,
      schet_id,
      id,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const worker = await PodotchetService.getById({
      id: worker_id,
      region_id,
    });
    if (!worker) {
      return res.error(req.i18n.t("podotchetNotFound"), 404);
    }

    const distance = await DistancesService.getByDistrictId({
      from_district_id,
      to_district_id,
    });
    if (!distance) {
      return res.error(req.i18n.t("distancesNotFound"), 404);
    }

    const minimum_wage = await MinimumWageService.get();

    const operatsiis = [];

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date });

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    for (let child of childs) {
      const schet = await OperatsiiService.getById({
        id: child.schet_id,
        type: "work_trip",
      });
      if (!schet) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }
      operatsiis.push(schet);
    }

    if (!checkSchetsEquality(operatsiis)) {
      return res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const road_summa = HelperFunctions.roadSumma({ ...req.body, distance, minimum_wage });

    if (new Date(from_date) >= new Date(to_date)) {
      return res.error(req.i18n.t("fromDateError"), 400);
    }

    const day_data = HelperFunctions.daySumma({ ...req.body, minimum_wage });

    const summa = road_summa + day_data.summa + hostel_summa;

    const chils_sum = HelperFunctions.childsSumma(childs);

    if (summa !== req.body.summa || summa !== chils_sum) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const result = await WorkerTripService.update({
      ...req.body,
      ...req.query,
      user_id,
      region_id,
      summa,
      id,
      old_data,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async delete(req, res) {
    const { main_schet_id, schet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find((item) => item.id === Number(schet_id));
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const doc = await WorkerTripService.getById({
      region_id,
      main_schet_id,
      schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: doc.doc_date,
    });

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const result = await WorkerTripService.delete({
      id,
      region_id,
      user_id,
      ...req.query,
      ...doc,
    });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, result);
  }
};
