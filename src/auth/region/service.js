const { RegionDB } = require('./db');
const { RoleDb } = require('../role/db');
const {} = require('../access/db');

exports.RegionService = class {
    static async createRegion(req, res) {
        const { name } = req.body
        const test = await RegionDB.getByNameRegion(name)
        if (test) {
            return res.status(409).json({
                message: 'this data already exists'
            })
        }
        const result = await RegionDB.createRegion(data.name);
        const roles = await RoleDb.getRole()
        for (let role of roles) {
            await createAccessService(role.id, result.id)
        }
    }
}


// create region
const createRegion = async (req, res) => {
    try {
        const data = validationResponse(regionValidation, req.body)
        const test = await getByNameRegionService(data.name);
        if (test) {
            throw new ErrorResponse("This region has already been entered", 409)
        }
        const result = await createRegionService(data.name);
        const roles = await getRoleService()
        for (let role of roles) {
            await createAccessService(role.id, result.id)
        }
        postLogger.info(`Viloyat yaratildi: ${data.name}. Foydalanuvchi ID: ${req.user.id}`);
        return resFunc(res, 201, result)
    } catch (error) {
        return errorCatch(error, res)
    }
}

// get all region
const getAllReegion = async (req, res) => {
    try {
        const result = await getRegionService();
        getLogger.info(`Barcha mintaqalar olindi. Foydalanuvchi ID: ${req.user.id}`);
        return resFunc(res, 200, result)
    } catch (error) {
        return errorCatch(error, res)
    }
}

// update region
const updateRegion = async (req, res) => {
    try {
        const id = req.params.id;
        const region = await getByIdRegionService(id);
        const data = validationResponse(regionValidation, req.body)
        if (region.name !== data.name.trim()) {
            const test = await getByNameRegionService(data.name);
            if (test) {
                throw new ErrorResponse("This region has already been entered", 409)
            }
        }
        const result = await update_region(id, data.name.trim());
        putLogger.info(`Viloyat yangilandi: ${data.name}. Foydalanuvchi ID: ${req.user.id}`);

        return resFunc(res, 200, result)
    } catch (error) {
        return errorCatch(error, res)
    }
}

// delete region
const deleteRegion = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        await getByIdRegionService(id);
        await delete_region(id);
        deleteLogger.info(`Viloyat o'chirildi. Viloyat ID: ${id}. Foydalanuvchi ID: ${req.user.id}`);
        return resFunc(res, 200, 'delete success true')
    } catch (error) {
        return errorCatch(error, res)
    }
});


// get region by ID
const getElementById = asyncHandler(async (req, res) => {
    try {
        const result = await getByIdRegionService(req.params.id, true);
        getLogger.info(`Viloyat olindi. Viloyat ID: ${req.params.id}. Foydalanuvchi ID: ${req.user.id}`);
        return resFunc(res, 200, result)
    } catch (error) {
        return errorCatch(error, res)
    }
});


module.exports = {
    createRegion,
    getAllReegion,
    updateRegion,
    deleteRegion,
    getElementById,
};
