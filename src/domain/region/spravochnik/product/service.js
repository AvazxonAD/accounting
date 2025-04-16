const { ProductDB } = require("./db");
const { tashkentTime } = require("@helper/functions");

exports.ProductService = class {
  static async getById(data) {
    const result = await ProductDB.getById([data.region_id, data.id]);
    return result;
  }

  static async get(data) {
    const result = await ProductDB.get(
      [data.region_id, data.offset, data.limit],
      data.search,
      data.iznos
    );
    return result;
  }

  static async create(data) {
    const result = [];
    for (let doc of data.childs) {
      if (doc.iznos) {
        for (let i = 1; i <= doc.kol; i++) {
          const product = await ProductDB.create([
            data.user_id,
            data.budjet_id,
            doc.name,
            doc.edin,
            doc.group_jur7_id,
            doc.inventar_num,
            doc.serial_num,
            doc.iznos,
            tashkentTime(),
            tashkentTime(),
          ]);

          result.push({ ...product, ...doc, kol: 1 });
        }
      } else {
        const product = await ProductDB.create([
          data.user_id,
          data.budjet_id,
          doc.name,
          doc.edin,
          doc.group_jur7_id,
          doc.inventar_num,
          doc.serial_num,
          doc.iznos,
          tashkentTime(),
          tashkentTime(),
        ]);
        result.push({ ...product, ...doc });
      }
    }
    return result;
  }

  static async deleteNaimenovanie(data) {
    for (let child of data.childs) {
      await ProductDB.deleteNaimenovanie(child.naimenovanie_tovarov_jur7_id);
    }
  }
};
