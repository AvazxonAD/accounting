const { GroupDB } = require('./db');

exports.GroupService = class {
    static async getByIdGroup(data) {
        const result = await GroupDB.getByIdGroup([data.id]);
        return result;
    }

    static async getByNameGroup(data) {
        const result = await GroupDB.getByNameGroup([data.name]);
        
        return result;
    }
    
    static async getByNumberNameGroup(data) {
        const result = await GroupDB.getByNumberNameGroup([data.number, data.name]);
        
        return result;
    }
}