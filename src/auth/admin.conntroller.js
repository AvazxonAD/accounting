const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcrypt");
const { getAdminRoleService } = require("./role.service");
const { getByIdRegionService } = require("./region.service");
const { getByLoginUserService, existLogin } = require("./auth.service");
const { userValidation } = require("../utils/validation");;
const { getLogger, postLogger, putLogger, deleteLogger } = require('../utils/logger');
const { getRoleService } = require('./role.service')
const { createAccessService } = require('./access.service')
const { validationResponse } = require("../utils/response-for-validation");

const {
  createUserSerivice,
  getByIdUserService,
  updateUserService,
  deleteUserService,
  getAdminService,
  checkAdminService,
} = require("./user.service");
const { errorCatch } = require("../utils/errorCatch");
const { resFunc } = require("../utils/resFunc");

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
    await existLogin(data.login);
    await getByIdRegionService(region_id);
    await checkAdminService(region_id, role.id)
    const admin = await createUserSerivice(login, hashedPassword, fio, role.id, region_id);
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
    const {login, password, fio, region_id} = validationResponse(userValidation, req.body)
    const role = await getAdminRoleService()
    await getByIdRegionService(region_id);
    const hashedPassword = await bcrypt.hash(password, 10);
    if (oldUser.login !== login) {
      await existLogin(login);
    }
    if(oldUser.role_id !== role.id || oldUser.region_id !== region_id){
      await checkAdminService(region_id, role.id)
    }
    const admin = await updateUserService(login, hashedPassword, fio, role.id, region_id, id);
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
    const admin = await getByIdUserService(req.params.id, true); 
    if(!admin){
      throw new ErrorResponse('user not found', 404)
    }
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
