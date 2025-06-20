const express = require("express");
const routes = express.Router();

const { protect } = require("@middleware/auth");
const { Middleware } = require("@middleware/index");
const { checkJur2Saldo, checkJur1Saldo, check159Saldo, checkJur4Saldo, check152Saldo } = require(`@middleware/check.saldo`);
const { Saldo159Service } = require(`@saldo_159/service`);
const { Saldo152Service } = require(`@saldo_152/service`);
const { BankSaldoService } = require(`@jur2_saldo/service`);
const { KassaSaldoService } = require(`@jur1_saldo/service`);
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);

routes
  // Region routes

  // jur2
  .use("/bank/monitoring", protect, checkJur2Saldo(BankSaldoService.getDateSaldo), require("@jur2_monitoring/index"))
  .use("/bank/income", protect, checkJur2Saldo(BankSaldoService.getDateSaldo), require("@jur2_prixod/index"))
  .use("/bank/saldo", protect, require("@jur2_saldo/index"))
  .use("/bank/expense", protect, checkJur2Saldo(BankSaldoService.getDateSaldo), require("@jur2_rasxod/index"))

  // jur1
  .use("/kassa/monitoring", protect, checkJur1Saldo(KassaSaldoService.getDateSaldo), require("@jur1_monitoring/index"))
  .use("/kassa/income", protect, checkJur1Saldo(KassaSaldoService.getDateSaldo), require("@jur1_prixod/index"))
  .use("/kassa/saldo", protect, require("@jur1_saldo/index"))
  .use("/kassa/expense", protect, checkJur1Saldo(KassaSaldoService.getDateSaldo), require("@jur1_rasxod/index"))

  // jur3
  .use("/shartnoma", protect, require("@contract/index"))

  // 159
  .use("/159/monitoring", protect, check159Saldo(Saldo159Service.getDateSaldo), require("@monitoring_159/index"))
  .use("/159/saldo", protect, require("@saldo_159/index"))
  .use("/akt", protect, check159Saldo(Saldo159Service.getDateSaldo), require("@akt/index"))

  // 152
  .use("/152/monitoring", protect, check152Saldo(Saldo152Service.getDateSaldo), require("@monitoring_152/index"))
  .use("/152/saldo", protect, require("@saldo_152/index"))
  .use("/services/show", protect, check152Saldo(Saldo152Service.getDateSaldo), require("@show_service/index"))

  // jur4
  .use("/avans", protect, checkJur4Saldo(Jur4SaldoService.getDateSaldo), require("@avans/index"))
  .use("/work-trip", protect, checkJur4Saldo(Jur4SaldoService.getDateSaldo), require("@work_trip/index"))
  .use("/podotchet/monitoring", protect, checkJur4Saldo(Jur4SaldoService.getDateSaldo), require("@pod_monitoring/index"))
  .use("/podotchet/saldo", protect, require("@podotchet_saldo/index"))

  // auth
  .use("/auth", require("@auth/index"))
  .use("/auth/region", protect, require("@region/index"))
  .use("/auth/role", protect, require("@role/index"))
  .use("/auth/access", protect, require("@access/index"))
  .use("/auth/user", protect, require("@user/index"))
  .use("/auth/admin", protect, require("@admin_users/index"))

  .use("/spravochnik/podotchet-litso", protect, require("@podotchet/podochet.litso.routes"))
  .use("/spravochnik/main/book/schet", protect, require("@main_book_schet/index"))
  .use("/spravochnik/podrazdelenie", protect, require("@podraz/podrazdelenie.routes"))
  .use("/spravochnik/type-operatsii", protect, require("@type_operatsii/type_operatsii.routes"))
  .use("/spravochnik/organization/gazna", protect, require("@gazna/index"))
  .use("/spravochnik/organization/account_number", protect, require("@account_number/index"))
  .use("/spravochnik/organization", protect, require("@organization/index"))
  .use("/spravochnik/operatsii", protect, require("@operatsii/index"))
  .use("/spravochnik/main-schet", require("@main_schet/index"))
  .use("/spravochnik/budjet-name", protect, require("@budjet/budjet_name.routes"))
  .use("/spravochnik/sostav", protect, require("@sostav/sostav.routes"))
  .use("/spravochnik/podpis", protect, require("@podpis/podpis.routes"))
  .use("/spravochnik/bank", protect, require("@bank/index"))

  .use("/smeta/grafik", protect, require("@smeta_grafik/index"))
  .use("/smeta", protect, require("@smeta/index"))

  .use("/jur_7/group", protect, require("@group/index"))
  .use("/jur_7/pereotsenka", protect, require("@pereotsenka/index"))
  .use("/jur_7/podrazdelenie", protect, require("@jur7_podraz/index"))
  .use("/jur_7/responsible", protect, require("@responsible/index"))
  .use("/jur_7/naimenovanie", protect, require("@product/index"))
  .use("/jur_7/doc_prixod", protect, require("@jur7_prixod/index"))
  .use("/jur_7/doc_rasxod", protect, Middleware.jur7Block, require("@jur7_rasxod/index"))
  .use("/jur_7/internal", protect, Middleware.jur7Block, require("@jur7_internal/index"))
  .use("/jur_7/unit", protect, require("@unit/index"))
  .use("/jur_7/saldo", protect, require("@jur7_saldo/index"))
  .use("/jur_7/monitoring", protect, require("@jur7_monitoring/index"))

  .use("/main/book", protect, require("@main_book/index"))

  .use("/odinox", protect, require("@region_odinox/index"))
  .use("/real/cost", protect, require("@region_real_cost/index"))

  .use("/jur8/schets", protect, require("@region_prixod_schets/index"))
  .use("/jur8/monitoring", protect, require("@jur8_monitoring/index"))

  .use("/log", protect, require("@log/index"))

  .use("/features", protect, require("@features/index"))

  .use("/dashboard", protect, require("@region_dashboard/index"))
  .use("/constants", protect, require("@constants/index"))

  // Admin routes

  .use("/admin/spravochnik/report_title", protect, require("@report_title/index"))

  .use("/admin/odinox", protect, require("@admin_odinox/index"))

  .use("/admin/real/cost", protect, require("@admin_real_cost/index"))

  .use("/admin/spravochnik/prixod/schets", protect, require("@prixod_schets/index"))
  .use("/admin/spravochnik/video_module", protect, require("@video_module/index"))
  .use("/admin/spravochnik/minimum-wage", protect, require("@minimum_wage/index"))
  .use("/admin/spravochnik/distances", protect, require("@distances/index"))
  .use("/admin/spravochnik/position", protect, require("@position/index"))

  .use("/admin/main/book", protect, require("@admin_main_book/index"))

  .use("/admin/video", protect, require("@video/index"))

  .use("/admin/dashboard", protect, require("@admin_dashboard/index"))

  .use("/admin/jur7", protect, require("@admin_jur7/index"))

  .use("/admin/jur1", protect, require("@admin_jur1/index"))

  .use("/admin/jur2", protect, require("@admin_jur2/index"))

  .use("/admin/jur3-159", protect, require("@admin_jur3_159/index"))

  .use("/admin/jur3-152", protect, require("@admin_jur3_152/index"))

  .use("/admin/jur4", protect, require("@admin_jur4/index"))

  .use("/admin/control", protect, require("@admin_control/index"));

module.exports = routes;
