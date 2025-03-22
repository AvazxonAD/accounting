const { BankMfoDB } = require("./db");
const { BankService } = require("./service");
const { tashkentTime } = require("@helper/functions");
const xlsx = require("xlsx");

exports.Controller = class {
  static async getByMfo(req, res) {
    const { mfo } = req.params;

    const result = await BankService.getByMfo({ mfo });

    if (!result) {
      return res.error(req.i18n.t("bankNotFound"), 409);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async create(req, res) {
    const { mfo, bank_name } = req.body;

    // const bankMfo = await BankMfoDB.getByMfoName([mfo, bank_name])

    const bankMfo = await BankMfoDB.getBankMfo([mfo]);

    if (bankMfo) {
      return res.error(req.i18n.t("bankAlreadyExists"), 409);
    }

    const result = await BankMfoDB.create([
      mfo,
      bank_name,
      tashkentTime(),
      tashkentTime(),
    ]);

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async getBankMfo(req, res) {
    const { page, limit, search } = req.query;
    const offset = (page - 1) * limit;
    const { data, total } = await BankMfoDB.getBankMfo([offset, limit], search);
    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data || []);
  }

  static async getByIdBankMfo(req, res) {
    const id = req.params.id;
    const data = await BankMfoDB.getByIdBankMfo([id], true);
    if (!data) {
      return res.error(req.i18n.t("bankNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async updateBankMfo(req, res) {
    const { mfo, bank_name } = req.body;
    const id = req.params.id;
    const oldBankMfo = await BankMfoDB.getByIdBankMfo([id]);
    if (!oldBankMfo) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    // if (oldBankMfo.mfo !== mfo || oldBankMfo.bank_name !== bank_name) {
    //     const bankMfo = await BankMfoDB.getByMfoName([mfo, bank_name]);
    //     if (bankMfo) {
    //         return res.status(409).json({
    //             message: "This data already exists"
    //         });
    //     }
    // }

    if (oldBankMfo.mfo !== mfo) {
      const bankMfo = await BankMfoDB.getBankMfo([mfo]);

      if (bankMfo) {
        return res.error(req.i18n.t("bankAlreadyExists"), 409);
      }
    }

    const result = await BankMfoDB.updateBankMfo([
      mfo,
      bank_name,
      tashkentTime(),
      id,
    ]);

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async deleteBankMfo(req, res) {
    const id = req.params.id;
    const bankMfo = await BankMfoDB.getByIdBankMfo([id]);
    if (!bankMfo) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    await BankMfoDB.deleteBankMfo([id]);

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async importExcelData(req, res) {
    if (!req.file) {
      return next(new ErrorResponse("File not found", 400));
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet).map((row) => {
      const newRow = {};
      for (const key in row) {
        newRow[key.trim()] = row[key];
      }
      return newRow;
    });
    for (let bank of data) {
      await BankMfoDB.create([
        String(bank.mfo).trim(),
        String(bank.bank_name).trim(),
        tashkentTime(),
        tashkentTime(),
      ]);
    }
    return res.status(200).json({
      message: "'Created successfully!",
    });
  }
};
