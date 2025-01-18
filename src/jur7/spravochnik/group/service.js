const { GroupDB } = require('./db');

exports.GroupService = class {
    static async getByIdGroup(data) {
        const result = await GroupDB.getByIdGroup([data.id]);
        return result;
    }
}