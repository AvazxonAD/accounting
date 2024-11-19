const {
  getByAllSmeta,
  createSmeta,
  getAllSmeta,
  getByIdSmeta,
  updateSmeta,
  deleteSmeta,
} = require("../smeta/smeta.service");
const { smetaValidation, queryValidation } = require("../utils/validation");;
const { errorCatch } = require("../utils/errorCatch");
const { validationResponse } = require("../utils/response-for-validation");
const { resFunc } = require("../utils/resFunc");
const xlsx = require('xlsx')

// create
const create = async (req, res) => {
  try {
    const { smeta_name, smeta_number, father_smeta_name } = validationResponse(smetaValidation, req.body)
    await getByAllSmeta(smeta_name, smeta_number, father_smeta_name);
    const result = await createSmeta(smeta_name, smeta_number, father_smeta_name);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getAll = async (req, res) => {
  try {
    const { page, limit, search } = validationResponse(queryValidation, req.query)
    const offset = (page - 1) * limit;
    const { data, total } = await getAllSmeta(offset, limit, search);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }
    resFunc(res, 200, data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getElementById = async (req, res) => {
  try {
    const result = await getByIdSmeta(req.params.id, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// update
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { smeta_name, smeta_number, father_smeta_name } = validationResponse(smetaValidation, req.body)
    const smeta = await getByIdSmeta(id);
    if (smeta.smeta_name !== smeta_name ||
      smeta.smeta_number !== smeta_number ||
      smeta.father_smeta_name !== father_smeta_name
    ) {
      await getByAllSmeta(smeta_name, smeta_number, father_smeta_name);
    }
    const result = await updateSmeta(smeta_name, smeta_number, father_smeta_name, id);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deleteValue = async (req, res) => {
  try {
    const id = req.params.id;
    await getByIdSmeta(id);
    await deleteSmeta(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

const importExcelData = async (req, res) => {
  try {
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
    for(let smeta of data){
      await createSmeta(smeta.smeta_name, Number(smeta.smeta_number) ?  smeta.smeta_number : 1000000000, smeta.father_smeta_name);
    }
    return resFunc(res, 200, 'Created success true');
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  create,
  getAll,
  deleteValue,
  update,
  getElementById,
  importExcelData
};
