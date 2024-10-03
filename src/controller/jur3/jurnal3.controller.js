const { jur3Validation } = require('../../helpers/validation/bajarilgan_ishlar/jur_3.validation');
const ErrorResponse = require('../../utils/errorResponse');

const createJurnal3 = async (req, res) => {
    try {
        const { error, value } = jur3Validation.validate(req.body);
        if (error) {
            return new ErrorResponse(error.details[0].message, 400);
        }
        
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}