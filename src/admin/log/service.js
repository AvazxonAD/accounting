const path = require('path');
const { access, constants, readFile } = require('fs/promises');
const { filterLogs, parseLogs } = require('@helper/functions')
const { AuthDB } = require('../../auth/auth/db')

exports.LogService = class {
    static async getLogs(req, res) {
        const type_logs = ['get', 'post', 'put', 'delete']
        const result = []
        try {
            for(let type of type_logs) {
                const filePath = path.join(__dirname, `../../../logs/${type}.log`);
                await access(filePath, constants.F_OK);
                const data = await readFile(filePath, 'utf8')
                const result_data = parseLogs(data.split(/\r?\n/), type);
                result.push(...result_data)
            }
            result.sort((a, b) => a.date - b.date)
            return res.json({
                message: "log get successfully",
                data: result
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
