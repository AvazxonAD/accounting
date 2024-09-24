const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const pool = require('../../config/db');
const generateToken = require('../../utils/auth/generate.token');
const bcrypt = require('bcrypt')
const {checkValueString } = require('../../utils/check.functions');
const { getByLoginAuth, getByIdAuth, updateAuth, getProfileAuth } = require('../../service/auth.db');
const { getByIdMainSchet, getByBudjet_idMain_schet } = require('../../service/main.schet.db');


// login 
const login = asyncHandler(async (req, res, next) => {
    const { login, password, main_schet_id } = req.body;

    checkValueString(login, password)

    const user = await getByLoginAuth(login)

    if (!user) {
        return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
    }

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
        return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
    }
    let main_schet = null

    if(main_schet_id){
        main_schet = await getByIdMainSchet(user.region_id, main_schet_id)
        if(!main_schet){
            return next(new ErrorResponse('Shot raqami raqami notog`ri kir111itildi', 400))
        }
    }

    const token = generateToken(user);
    return res.status(200).json({
        success: true,
        data: {
            user,
            main_schet,
            token
        },
    });
});

// update
const update = asyncHandler(async (req, res, next) => {
    let { fio, login, oldPassword, newPassword } = req.body;
    const id = req.user.id

    const user = await getByIdAuth(id)

    if (oldPassword || newPassword) {
        checkValueString(oldPassword, newPassword);
        
        oldPassword = oldPassword.trim();
        newPassword = newPassword.trim();
        
        const matchPassword = await bcrypt.compare(oldPassword, user.password);
        if (!matchPassword) {
            return next(new ErrorResponse("Eski parol xato kiritildi", 403));
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = newHashedPassword;
    }

    if (fio) {
        fio = fio.trim();
        user.fio = fio;
    }

    if (login) {
        login = login.trim();
        if (login !== user.login) {
            const test = await getByLoginAuth(login)
            if (test) {
                return next(new ErrorResponse('Login avval ishlatilgan', 400));
            }
            user.login = login;
        }
    }

    const result = await updateAuth(user.login, user.password, user.fio, id)
    if(!result){
        return next(new ErrorResponse("Server xatolik. Malumot yangilanmadi", 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    });
});

// get profile 
const getProfile = asyncHandler(async (req, res, next) => {
    const user = await getProfileAuth(req.user.id)

    if(!user){
        return next(new ErrorResponse('Server xatolik. Foydalanuvchi topilmadi', 404))
    }

    return res.status(200).json({
        success: true,
        data: user
    });
});


// select budget 
const select_budget = asyncHandler(async (req, res, next) => {
    const result = await getByBudjet_idMain_schet(req.params.id)

    return res.status(200).json({
        success: true,
        data: result
    })
})

module.exports = {
    login,
    update,
    getProfile,
    select_budget
}