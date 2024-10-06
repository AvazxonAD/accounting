const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const bcrypt = require("bcrypt");
const { getAdminRoleService } = require("../../service/auth/role.service");
const { getByIdRegionService } = require("../../service/auth/region.service");
const { getByLoginUserService } = require("../../service/auth/auth.service");
const { userValidation } = require("../../helpers/validation/auth/user.validation");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');
const { getRoleService } = require('../../service/auth/role.service')
const { createAccessService } = require('../../service/auth/access.service')
const { validationResponse } = require("../../helpers/response-for-validation");

const {
  createUserSerivice,
  getByIdUserService,
  updateUserService,
  deleteUserService,
  getAdminService,
} = require("../../service/auth/user.service");
const { errorCatch } = require("../../helpers/errorCatch");
const { resFunc } = require("../../helpers/resFunc");

// create admin
const createAdmin = async (req, res) => {
  try {
    const data = validationResponse(userValidation, req.body)
    let { login, password, fio, region_id } = data;
    const role = await getAdminRoleService();
    login = login.trim();
    password = password.trim();
    fio = fio.trim();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const test = await getByLoginUserService(data.login);
    if (test) {
      throw new ErrorResponse("This login has already been registered", 409)
    }
    await getByIdRegionService(region_id);
    const admin = await createUserSerivice(login, hashedPassword, fio, role.id, region_id);
    const roles = await getRoleService()
    for (let role of roles) {
      await createAccessService(role.id, admin.id)
    }
    postLogger.info(`Foydalanuvchi yaratildi: ${login}. Foydalanuvchi ID: ${req.user.id}`);
  
    resFunc(res, 201, admin)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get admin 
const getAdmin = async (req, res) => {
  try {
    const role = await getAdminRoleService()
    const admins = await getAdminService(role.id)
    resFunc(res, 200, admins)
  } catch (error) {
    errorCatch(error, res)
  }
}

// update admin 
const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const oldUser = await getByIdUserService(id);
    const data = validationResponse(userValidation, req.body)
    let { login, password, fio, region_id } = data;
    await getByIdRegionService(region_id);
    login = login.trim();
    password = password.trim();
    fio = fio.trim();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (oldUser.login !== login) {
      const test = await getByLoginUserService(login);
      if (test) {
      throw new ErrorResponse("This login has already been registered", 409)
      }
    }
  
    const admin = await updateUserService(login, hashedPassword, fio, region_id, id);
    putLogger.info(`Foydalanuvchi yangilandi: ${login}. Foydalanuvchi ID: ${req.user.id}`);
  
    resFunc(res, 200, admin)
  } catch (error) {
    errorCatch(error, res)
  }
}


// delete  admin 
const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const userToDelete = await getByIdUserService(id);
    if (userToDelete.role_name === 'super-admin') {
      throw new ErrorResponse('Deletion is not allowed', 403)
    }
    await deleteUserService(id);
    deleteLogger.info(`Foydalanuvchi ochirildi: ${userToDelete.login}. Foydalanuvchi ID: ${req.user.id}`);
  
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}


// get by id admin 
const getByIdAdmin = async (req, res) => {
  try {
    const admin = await getByIdUserService(req.params.id); 
    getLogger.info(`Muvaffaqyatli foydalanuvchi ma'lumotlari olindi. Foydalanuvchi ID: ${req.user.id}`);
  
    resFunc(res, 200, admin)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getByIdAdmin
};
