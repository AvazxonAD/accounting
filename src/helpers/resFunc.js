const resFunc = (res, status, data) => {
    return res.status(status).send({
        success: true,
        data: data
    })
}

module.exports = {
    resFunc
}