const resFunc = (res, status, data, meta) => {
    return res.success('', status, meta, data);
}

module.exports = {
    resFunc
}