const errorCatch = (error, res) => {
    return res.status(error?.statusCode || 500).send({
        error: error.message
    });
}

module.exports = { errorCatch }