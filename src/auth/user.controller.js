const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcrypt");
const { getByIdRoleService } = require("./role.service");
const { getByLoginUserService, existLogin } = require("./auth.service");
const { userValidation } = require("../utils/validation");;
const { validationResponse } = require('../utils/response-for-validation')
const { errorCatch } = require('../utils/errorCatch')
const { getLogger, postLogger, putLogger, deleteLogger } = require('../utils/logger');
const {
  createUserSerivice,
  getUserService,
  getByIdUserService,
  updateUserService,
  deleteUserService,
} = require("./user.service");
const { resFunc } = require("../utils/resFunc");

// create user
const createUser = async (req, res) => {
  try {
    const region_id = req.user.region_id
    const user_id = req.user.id;
    const {login, password, fio, role_id} = validationResponse(userValidation, req.body)
    const role = await getByIdRoleService(role_id)
    if(role.name === 'super-admin' || role.name === 'region-admin'){
      throw new ErrorResponse('role not found', 404)
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await existLogin(login);
    const result = await createUserSerivice(login, hashedPassword, fio, role.id, region_id);
    postLogger.info(`Foydalanuvchi yaratildi: ${login}. Foydalanuvchi ID: ${user_id}`);
    return resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }
};

// get user
const getUser = async (req, res) => {
  try {
    const region_id = req.user.region_id
    const users = await getUserService(region_id)
    resFunc(res, 200, users)
  } catch (error) {
    errorCatch(error, res)
  }
};

// update user  
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const region_id = req.user.region_id
    const oldUser = await getByIdUserService(id);
    if(oldUser.role_name === 'super-admin' || oldUser.role_name === 'region-admin'){
      throw new ErrorResponse('This operation cannot be performed', 403)
    }
    const data = validationResponse(userValidation, req.body)
    let { login, password, fio, role_id } = data;    
    const role = await getByIdRoleService(role_id)
    if(role.name === 'super-admin' || role.name === 'region-admin'){
      throw new ErrorResponse('Error: role not found', 404)
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (oldUser.login !== login) {
      await existLogin(login);
    }
    const result = await updateUserService(login, hashedPassword, fio, role_id, region_id, id);
    putLogger.info(`Foydalanuvchi yangilandi: ${login}. Foydalanuvchi ID: ${req.user.id}`);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
};

// delete user  
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userToDelete = await getByIdUserService(id);
    if (userToDelete.role_name === 'region-admin' || userToDelete.role_name === 'super-admin') {
      throw new ErrorResponse('Cannot delete', 404)
    }
    await deleteUserService(id);
    deleteLogger.info(`Foydalanuvchi ochirildi: ${userToDelete.login}. Foydalanuvchi ID: ${req.user.id}`);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
};

// get by id user
const getByIdUser = async (req, res) => {
  try {
    const result = await getByIdUserService(req.params.id, true);
    getLogger.info(`Muvaffaqyatli foydalanuvchi ma'lumotlari olindi. Foydalanuvchi ID: ${req.user.id, true}`);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getByIdUser
};
