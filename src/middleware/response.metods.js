module.exports = (req, res, next) => {
    res.error = (message, statusCode) => {
        return res.status(statusCode).json({
            code: statusCode || 500,
            message: message || "Interval server error",
            meta: null, 
            data: null,
            success: false,
            time: new Date().toISOString()
        })
    }
    res.success = (message, statusCode, meta, data) => {
        return res.status(statusCode).json({
            code: statusCode || 500,
            message: message || "Interval server error",
            meta, 
            data,
            success: true,
            time: new Date().toISOString()
        })
    }
    next();
}