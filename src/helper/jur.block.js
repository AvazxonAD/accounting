const { Saldo152Service } = require(`@saldo_152/service`);
const { Saldo159Service } = require(`@saldo_159/service`);
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);
const { MainSchetService } = require("@main_schet/service");
const { HelperFunctions } = require("./functions");

exports.jurBlocks = async (data) => {
  const jur_schets = await MainSchetService.getJurSchets({
    region_id: data.region_id,
    main_schet_id: data.main_schet_id,
  });

  const doc_date = HelperFunctions.smallDate(data);

  const childs = data.old_data ? data.childs.concat(data.old_data.childs) : data.childs;

  for (let child of childs) {
    const schet_name = child.kredit_schet ? child.kredit_schet : child.schet;

    const schet = jur_schets.find((item) => item.schet === schet_name);

    if (schet) {
      if (schet.type === "152") {
        await Saldo152Service.createSaldoDate({
          ...data,
          schet_id: schet.id,
          main_schet_id: schet.main_schet_id,
          doc_date,
        });
      } else if (schet.type === "159") {
        await Saldo159Service.createSaldoDate({
          ...data,
          schet_id: schet.id,
          main_schet_id: schet.main_schet_id,
          doc_date,
        });
      } else if (schet.type === "jur4") {
        await Jur4SaldoService.createSaldoDate({
          ...data,
          schet_id: schet.id,
          main_schet_id: schet.main_schet_id,
          doc_date,
        });
      }
    }
  }
};
