const { jur3Validation } = require('../../helpers/validation/bajarilgan_ishlar/jur_3.validation');
const ErrorResponse = require('../../utils/errorResponse');
const { validationResponse } = require('../../helpers/response-for-validation');
const { errorCatch } = require('../../helpers/errorCatch');
const { getByIdMainSchet } = require('../../service/spravochnik/main.schet.service');
const { getByIdOperatsii } = require("../../service/spravochnik/operatsii.service");
const {
    getByIdOrganization,
} = require("../../service/spravochnik/organization.service");
const { getByIdShartnomaDB } = require("../../service/shartnoma/shartnoma.service");

const createJurnal3 = async (req, res) => {
    try {
        const user_id = req.user.id;
        const region_id = req.user.region_id;
        const main_schet_id = req.query.main_schet_id;
        await getByIdMainSchet(region_id, main_schet_id);
        const data = validationResponse(jur3Validation, req.body);
        await getByIdOperatsii(data.spravochnik_operatsii_own_id, "Akt_priyom_peresdach");
        await getByIdOrganization(region_id, data.id_spravochnik_organization);
        const shartnoma = await getByIdShartnomaDB(region_id, main_schet_id, data.shartnomalar_organization_id);
        if (!shartnoma.pudratchi_bool) {
            throw new ErrorResponse("Shartnoma pudratchi not", 404);
        }
        return res.status(200).json({
            data: data,
        });
    } catch (error) {
        errorCatch(error, res);
    }
}

module.exports = {
    createJurnal3
}