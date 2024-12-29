const Joi = require('joi');

const emptyBodySchema = Joi.object({ body: {} });
const emptyQuerySchema = Joi.object({ query: {} });
const emptyParamsSchema = Joi.object({ params: {} });

exports.validator = function (callback, schema) {
    return async (req, res, next) => {
        if (!schema) {
            try {
                return await callback(req, res);
            } catch (err) {
                next(err);
            }

            return
        }

        const { error, value } = schema
            .concat(emptyBodySchema)
            .concat(emptyQuerySchema)
            .concat(emptyParamsSchema)
            .validate({
                body: req.body,
                query: req.query,
                params: req.params
            });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        req.body = value.body;
        req.query = value.query;
        req.params = value.params;

        try {
            return await callback(req, res);
        } catch (err) {
            next(err);
        }

    };
}