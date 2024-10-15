const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const bcrypt = require("bcrypt");
const { getByIdRoleService } = require("../../service/auth/role.service");
const { getByLoginUserService, existLogin } = require("../../service/auth/auth.service");
const { userValidation } = require("../../helpers/validation/auth/user.validation");
const { validationResponse } = require('../../helpers/response-for-validation')
const { errorCatch } = require('../../helpers/errorCatch')

const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

const {
  createUserSerivice,
  getUserService,
  getByIdUserService,
  updateUserService,
  deleteUserService,
} = require("../../service/auth/user.service");
const { resFunc } = require("../../helpers/resFunc");

// create user
const createUser = async (req, res) => {
  try {
    const region_id = req.user.region_id
    const user_id = req.user.id;
    const data = validationResponse(userValidation, req.body)
    let { login, password, fio, role_id } = data;
    const role = await getByIdRoleService(role_id)
    if(role.name === 'super-admin' || role.name === 'region-admin'){
      throw new ErrorResponse('role not found', 404)
    }
    login = login.trim();
    password = password.trim();
    fio = fio.trim();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await existLogin(data.login);
    const result = await createUserSerivice(login, hashedPassword, fio, role.id, region_id);
    postLogger.info(`Foydalanuvchi yaratildi: ${login}. Foydalanuvchi ID: ${user_id}`);
  
    return resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }
};

// get user
const getUser = async (req, res) => {
  const region_id = req.user.region_id
  const users = await getUserService(region_id)
  return res.status(200).json({
    success: true,
    data: users,
  });
};


// update user  
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const region_id = req.user.region_id
    const oldUser = await getByIdUserService(id);
    const data = validationResponse(userValidation, req.body)
    let { login, password, fio, role_id } = data;    
    const role = await getByIdRoleService(role_id)
    if(role.name === 'super-admin' || role.name === 'region-admin'){
      throw new ErrorResponse('Error: role not found', 404)
    }
    login = login.trim();
    password = password.trim();
    fio = fio.trim();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (oldUser.login !== login) {
      const test = await getByLoginUserService(login);
      if (test) {
        throw new ErrorResponse("This login has already been entered", 409)
      }
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
  const id = req.params.id;
  const userToDelete = await getByIdUserService(id);
  if (userToDelete.role_name === 'region-admin' || userToDelete.role_name === 'super-admin') {
    return next(new ErrorResponse('Ochirish mumkin emas', 404))
  }
  await deleteUserService(id);
  deleteLogger.info(`Foydalanuvchi ochirildi: ${userToDelete.login}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli ochirildi",
  });
};


// get by id user
const getByIdUser = async (req, res) => {
  const user = await getByIdUserService(req.params.id);
  getLogger.info(`Muvaffaqyatli foydalanuvchi ma'lumotlari olindi. Foydalanuvchi ID: ${req.user.id}`);
  return res.status(200).json({
    success: true,
    data: user,
  });
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getByIdUser
};
