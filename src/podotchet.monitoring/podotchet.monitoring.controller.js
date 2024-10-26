const { queryValidation } = require("../utils/validation");;
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { getLogger } = require('../utils/logger')
const { validationResponse } = require('../utils/response-for-validation');
const { errorCatch } = require("../utils/errorCatch");
const { resFunc } = require("../utils/resFunc");
const { getAllMonitoring } = require('./podotchet.monitoring.service')

const getPodotchetMonitoring = async (req, res) => {
    try {
        const { limit, page, main_schet_id, from, to, podotchet } = validationResponse(queryValidation, req.query)
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;
        await getByIdMainSchetService(region_id, main_schet_id);
        const { total, prixod_sum, rasxod_sum, summaFrom, summaTo, data } = await getAllMonitoring(
            region_id,
            main_schet_id,
            offset,
            limit,
            from,
            to,
            podotchet
        );
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            prixod_sum,
            rasxod_sum,
            summaFrom,
            summaTo
        }
        getLogger.info(`Muvaffaqiyatli podotchet monitoring doclar olindi. UserId: ${req.user.id}`)
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = {
    getPodotchetMonitoring
};
