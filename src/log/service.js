const path = require('path');
const { access, constants, readFile } = require('fs/promises');
const { filterLogs } = require('../helper/functions')
const { AuthDB } = require('../auth/auth/db')

exports.LogService = class {
    static async getLogs(req, res) {
        const { type } = req.query;
        const filePath = path.join(__dirname, `../../logs/${type}.log`);
        try {
            await access(filePath, constants.F_OK);
            const data = await readFile(filePath, 'utf8')
            const result_data = filterLogs(data.split('\r\n'));
            return res.json({
                message: "log get successfully",
                data: result_data
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error, log file not found"
            });
        }
    }

    static async getUser(req, res) {
        const id = req.params.id;
        const result = await AuthDB.getByIdAuth([id], true);
        if(!result){
            return res.status(404).json({
                message: "user not found"
            })
        }
        return res.status(200).json({
            message: "user get successfully",
            data: result
        })
    }
}
