const { Saldo159Service } = require(`@saldo_159/service`);
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);

exports.jurBlocks = async (data) => {
  const jur_schets = await MainSchetService.getJurSchets({
    region_id: data.region_id,
    main_schet_id: data.main_schet_id,
  });

  for (let child of data.childs) {
    const schet = jur_schets.find((item) => item.schet === child.schet);

    if (schet) {
      if (schet.type === "jur3") {
        await Saldo159Service.createSaldoDate({
          ...data,
          schet_id: schet.id,
          main_schet_id: schet.main_schet_id,
          client,
        });
      } else if (schet.type === "jur4") {
        await Jur4SaldoService.createSaldoDate({
          ...data,
          schet_id: schet.id,
          main_schet_id: schet.main_schet_id,
          client,
        });
      }
    }
  }
};
