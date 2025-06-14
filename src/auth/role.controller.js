const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const { roleValidation } = require("../utils/validation");;
const { createAccessService } = require('./access.service')
const { getAdminService } = require('./user.service')
const { getLogger, postLogger, putLogger, deleteLogger } = require('../utils/logger');
const { validationResponse } = require('../utils/response-for-validation')
const { resFunc } = require("../utils/resFunc");
const { errorCatch } = require('../utils/errorCatch')
const { getRegionService } = require('./region.service')

const {
  getByNameRoleService,
  createRoleService,
  getRoleService,
  getByIdRoleService,
  updateRoleService,
  deleteRoleService,
} = require("./role.service");


// create role
const createRole = async (req, res) => {
  try {
    const user_id = req.user.id;
    const data = validationResponse(roleValidation, req.body)
    const test = await getByNameRoleService(data.name);
    if (test) {
      throw new ErrorResponse("Ushbu ma'lumot avval kiritilgan", 409)
    }
    const name = data.name.trim()
    if (name === 'region-admin' || name === 'super-admin') {
      throw new ErrorResponse("This role cannot be added", 400)
    }
    const role = await createRoleService(data.name);
    const regions = await getRegionService()
    for (let region of regions) {
      await createAccessService(role.id, region.id)
    }
    postLogger.info(`Rol yaratildi: ${data.name}. Foydalanuvchi ID: ${user_id}`);
    return resFunc(res, 200, role)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all role
const getAllRole = async (req, res) => {
  try {
    const user_id = req.user.id;
    const roles = await getRoleService();
    getLogger.info(`Barcha rollar olish muvaffaqiyatli. Foydalanuvchi ID: ${user_id}`);

    return resFunc(res, 200, roles)
  } catch (error) {
    errorCatch(error, res)
  }
}

// update role
const updateRole = async (req, res) => {
  try {
    const user_id = req.user.id;
    const id = req.params.id;
    const role = await getByIdRoleService(id);
    const data = validationResponse(roleValidation, req.body)
    const name = data.name.trim()
    if (role.name !== name) {
      const test = await getByNameRoleService(name);
      if (test) {
        throw new ErrorResponse("This data has already been entered", 409)
      }
    }
    const result = await updateRoleService(id, data.name);
    putLogger.info(`Rol yangilandi: ${data.name}. Foydalanuvchi ID: ${user_id}`);

    return resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}


// delete role
const deleteRole = async (req, res) => {
  try {
    const user_id = req.user.id;
    const id = req.params.id;
    const role = await getByIdRoleService(id);
    if (role.name === 'super-admin' || role.name === 'region-admin') {
      throw new ErrorResponse('This data cannot be deleted', 400)
    }

    await deleteRoleService(id);
    deleteLogger.info(`Rol o'chirildi. RoleId: ${id}. Foydalanuvchi ID: ${user_id}`);

    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}


// get role by ID
const getByIdRole = async (req, res) => {
  try {
    const role = await getByIdRoleService(req.params.id, true);
    const user_id = req.user.id
    getLogger.info(`Role olindi. RoleId: ${req.params.id}. Foydalanuvchi ID: ${user_id}`);

    return res.status(200).json({
      success: true,
      data: role,
    })
  } catch (error) {
    errorCatch(error, res)
  }
}


module.exports = {
  createRole,
  updateRole,
  deleteRole,
  getAllRole,
  getByIdRole,
};
